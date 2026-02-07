/**
 * japimport/pimpsRepository – Acesso a dados via PostgreSQL direto.
 *
 * Usa SQL nativo para contornar PGRST002 (PostgREST schema cache).
 * Se PostgreSQL direto falhar (firewall/timeout), usa fallback via PostgREST.
 * Schema: japbase
 */
import { queryPostgres } from '@/lib/db/postgres'
import { getSupabaseServer } from '@/lib/db/supabase'
import type { Pimp, ProdutoPimp, PimpTransito, PimpRecebido } from './types'
import * as fallback from './pimpsRepositoryFallback'

const SCHEMA = 'japbase'

// Cache de método que funciona (postgres ou supabase)
let _workingMethod: 'postgres' | 'supabase' | null = null

/** Forçar PostgREST quando firewall bloqueia PostgreSQL (porta 5432). PostgREST usa HTTPS (443). */
function forcePostgRest(): boolean {
  return process.env.FORCE_POSTGREST === 'true' || process.env.FORCE_POSTGREST === '1'
}

// Verifica se DATABASE_URL está configurada
function hasPostgresConfig(): boolean {
  const url = process.env.DATABASE_URL?.trim()
  return !!(url && url.length > 20 && url.includes('postgres'))
}

/** Usa PostgREST em vez de PostgreSQL direto (ex.: firewall bloqueia 5432) */
function usePostgRest(): boolean {
  return forcePostgRest() || _workingMethod === 'supabase' || !hasPostgresConfig()
}

function isFirewallError(error: string | undefined): boolean {
  if (!error) return false
  const msg = error.toLowerCase()
  return (
    msg.includes('timeout') ||
    msg.includes('connection refused') ||
    msg.includes('econnrefused') ||
    msg.includes('enotfound') ||
    msg.includes('network') ||
    msg.includes('firewall') ||
    msg.includes('bloqueado') ||
    msg.includes('socket hang up')
  )
}

export async function getPimps(filters?: {
  status?: string
  search?: string
}): Promise<Pimp[]> {
  // Firewall bloqueia PostgreSQL? Usa PostgREST (HTTPS 443)
  if (usePostgRest()) {
    _workingMethod = 'supabase'
    return fallback.getPimpsFromSupabase(filters)
  }

  // Tenta PostgreSQL direto primeiro
  let sql = `
    SELECT
      estimated_pimp::text as id,
      estimated_pimp::text as pimp_numero,
      (array_agg(exporter ORDER BY created_at DESC))[1] as exporter,
      (array_agg(proforma_pedido ORDER BY created_at DESC))[1] as proforma,
      (array_agg(status ORDER BY created_at DESC))[1] as status,
      (array_agg(order_date ORDER BY created_at DESC))[1]::text as order_date,
      (array_agg(eta ORDER BY created_at DESC))[1]::text as eta,
      NULL::text as arrival_date,
      SUM(COALESCE(usd_total,0)) as usd_total,
      SUM(COALESCE(usd_freight,0)) as usd_freight,
      'gripmaster' as origem,
      MIN(created_at)::text as created_at
    FROM ${SCHEMA}.pimp_pedidos_gripmaster
    WHERE 1=1
  `
  const params: any[] = []
  let i = 1

  if (filters?.status) {
    sql += ` AND status = $${i++}`
    params.push(filters.status)
  }
  if (filters?.search?.trim()) {
    sql += ` AND (
      estimated_pimp::text ILIKE $${i} OR
      COALESCE(exporter,'') ILIKE $${i} OR
      COALESCE(proforma_pedido,'') ILIKE $${i} OR
      COALESCE(status,'') ILIKE $${i}
    )`
    params.push(`%${filters.search.trim()}%`)
    i++
  }

  sql += ` GROUP BY estimated_pimp ORDER BY estimated_pimp DESC`

  const { rows, error } = await queryPostgres(sql, params)
  
  // Se erro de firewall/timeout, usa fallback e marca método
  if (error && isFirewallError(error)) {
    console.warn('PostgreSQL bloqueado (firewall?). Usando PostgREST como fallback...')
    _workingMethod = 'supabase'
    return fallback.getPimpsFromSupabase(filters)
  }

  if (error) {
    console.error('getPimps (PostgreSQL):', error)
    // Tenta fallback uma vez se não for firewall
    if (_workingMethod === null) {
      console.log('Tentando fallback PostgREST...')
      const fallbackResult = await fallback.getPimpsFromSupabase(filters)
      if (fallbackResult.length > 0) {
        _workingMethod = 'supabase'
        return fallbackResult
      }
    }
    return []
  }

  // Sucesso com PostgreSQL - marca método e continua
  if (_workingMethod === null && rows.length > 0) {
    _workingMethod = 'postgres'
  }

  const pimps = rows as Pimp[]

  const pimpNums = pimps.map((p) => parseInt(p.pimp_numero, 10)).filter((n) => !isNaN(n))
  if (pimpNums.length === 0) return pimps

  const transitoSql = `
    SELECT pimp, status, eta, arrival_date
    FROM ${SCHEMA}.pimp_transito_geral
    WHERE pimp = ANY($1::int[])
    ORDER BY created_at DESC
  `
  const { rows: transitoRows } = await queryPostgres(transitoSql, [pimpNums])
  const transitoByPimp = new Map<number, any>()
  for (const t of transitoRows as any[]) {
    if (t.pimp && !transitoByPimp.has(t.pimp)) {
      transitoByPimp.set(t.pimp, t)
    }
  }

  return pimps.map((p) => {
    const num = parseInt(p.pimp_numero, 10)
    const t = transitoByPimp.get(num)
    return {
      ...p,
      arrival_date: t?.arrival_date ? String(t.arrival_date) : null,
      status: t?.status || p.status,
      eta: t?.eta ? String(t.eta) : p.eta,
    }
  })
}

export async function getProdutosByPimp(pimpId: string): Promise<ProdutoPimp[]> {
  if (usePostgRest()) {
    return fallback.getProdutosByPimpFromSupabase(pimpId)
  }

  const pimpNum = parseInt(pimpId, 10)
  if (isNaN(pimpNum)) return []

  const sql = `
    SELECT
      id::text,
      $1::text as pimp_id,
      cod as codigo_produto,
      description as descricao,
      qtd as quantidade,
      usd_unity as valor_unitario_usd,
      brl_unity as valor_unitario_brl,
      usd_total as valor_total_usd,
      created_at::text as created_at
    FROM ${SCHEMA}.pimp_pedidos_gripmaster
    WHERE estimated_pimp = $2
    ORDER BY created_at ASC
  `
  const { rows, error } = await queryPostgres(sql, [pimpId, pimpNum])
  
  if (error && isFirewallError(error)) {
    _workingMethod = 'supabase'
    return fallback.getProdutosByPimpFromSupabase(pimpId)
  }
  
  if (error) {
    console.error('getProdutosByPimp (PostgreSQL):', error)
    if (_workingMethod === null) {
      return fallback.getProdutosByPimpFromSupabase(pimpId)
    }
    return []
  }
  
  return rows as ProdutoPimp[]
}

export async function getAllProdutos(filters?: {
  pimp_id?: string
  search?: string
}): Promise<ProdutoPimp[]> {
  if (usePostgRest()) {
    return fallback.getAllProdutosFromSupabase(filters)
  }
  let sql = `
    SELECT
      id::text,
      estimated_pimp::text as pimp_id,
      cod as codigo_produto,
      description as descricao,
      qtd as quantidade,
      usd_unity as valor_unitario_usd,
      brl_unity as valor_unitario_brl,
      usd_total as valor_total_usd,
      created_at::text as created_at
    FROM ${SCHEMA}.pimp_pedidos_gripmaster
    WHERE 1=1
  `
  const params: any[] = []
  let i = 1

  if (filters?.pimp_id) {
    const n = parseInt(filters.pimp_id, 10)
    if (!isNaN(n)) {
      sql += ` AND estimated_pimp = $${i++}`
      params.push(n)
    }
  }
  if (filters?.search?.trim()) {
    sql += ` AND (cod ILIKE $${i} OR description ILIKE $${i})`
    params.push(`%${filters.search.trim()}%`)
    i++
  }

  sql += ` ORDER BY created_at DESC`

  const { rows, error } = await queryPostgres(sql, params)
  
  if (error && isFirewallError(error)) {
    _workingMethod = 'supabase'
    return fallback.getAllProdutosFromSupabase(filters)
  }
  
  if (error) {
    console.error('getAllProdutos (PostgreSQL):', error)
    if (_workingMethod === null) {
      return fallback.getAllProdutosFromSupabase(filters)
    }
    return []
  }
  
  return rows as ProdutoPimp[]
}

export async function getTransito(filters?: {
  pimp_id?: string
  search?: string
}): Promise<Array<PimpTransito & { pimp_numero?: string }>> {
  if (usePostgRest()) {
    return fallback.getTransitoFromSupabase(filters)
  }
  let sql = `
    SELECT
      id::text,
      pimp::text as pimp_numero,
      pimp::text as pimp_id,
      carrier,
      agent,
      container,
      invoice as invoice_numero,
      status as status_averbacao,
      COALESCE(arrival_date::text, eta::text) as arrival_port_date,
      created_at::text as created_at
    FROM ${SCHEMA}.pimp_transito_geral
    WHERE 1=1
  `
  const params: any[] = []
  let i = 1

  if (filters?.pimp_id) {
    const n = parseInt(filters.pimp_id, 10)
    if (!isNaN(n)) {
      sql += ` AND pimp = $${i++}`
      params.push(n)
    }
  }
  if (filters?.search?.trim()) {
    sql += ` AND (
      COALESCE(exporter,'') ILIKE $${i} OR
      COALESCE(carrier,'') ILIKE $${i} OR
      COALESCE(agent,'') ILIKE $${i} OR
      COALESCE(container,'') ILIKE $${i} OR
      COALESCE(invoice,'') ILIKE $${i} OR
      COALESCE(status,'') ILIKE $${i}
    )`
    params.push(`%${filters.search.trim()}%`)
    i++
  }

  sql += ` ORDER BY created_at DESC`

  const { rows, error } = await queryPostgres(sql, params)
  
  if (error && isFirewallError(error)) {
    _workingMethod = 'supabase'
    return fallback.getTransitoFromSupabase(filters)
  }
  
  if (error) {
    console.error('getTransito (PostgreSQL):', error)
    if (_workingMethod === null) {
      return fallback.getTransitoFromSupabase(filters)
    }
    return []
  }
  
  return rows as Array<PimpTransito & { pimp_numero?: string }>
}

export async function getRecebidos(filters?: {
  pimp_id?: string
  search?: string
}): Promise<PimpRecebido[]> {
  if (usePostgRest()) {
    return fallback.getRecebidosFromSupabase(filters)
  }
  let sql = `
    SELECT
      id::text,
      pimp::text as pimp,
      COALESCE(exporter,'') as exporter,
      qtd,
      cod,
      description,
      usd_total,
      usd_freight,
      received_date::text as received_date,
      reference,
      created_at::text as created_at
    FROM ${SCHEMA}.pimp_recebidos_geral
    WHERE 1=1
  `
  const params: any[] = []
  let i = 1

  if (filters?.pimp_id) {
    const n = parseInt(filters.pimp_id, 10)
    if (!isNaN(n)) {
      sql += ` AND pimp = $${i++}`
      params.push(n)
    }
  }
  if (filters?.search?.trim()) {
    sql += ` AND (
      COALESCE(exporter,'') ILIKE $${i} OR
      COALESCE(cod,'') ILIKE $${i} OR
      COALESCE(description,'') ILIKE $${i} OR
      COALESCE(reference,'') ILIKE $${i}
    )`
    params.push(`%${filters.search.trim()}%`)
    i++
  }

  sql += ` ORDER BY created_at DESC`

  const { rows, error } = await queryPostgres(sql, params)
  
  if (error && isFirewallError(error)) {
    _workingMethod = 'supabase'
    return fallback.getRecebidosFromSupabase(filters)
  }
  
  if (error) {
    console.error('getRecebidos (PostgreSQL):', error)
    if (_workingMethod === null) {
      return fallback.getRecebidosFromSupabase(filters)
    }
    return []
  }
  
  return rows as PimpRecebido[]
}

export async function testConnection(): Promise<{ ok: boolean; message: string }> {
  // Firewall bloqueia PostgreSQL? Usa PostgREST (HTTPS 443)
  if (forcePostgRest() || !hasPostgresConfig()) {
    _workingMethod = 'supabase'

    try {
      const supabase = getSupabaseServer()
      const delays = [0, 2000, 4000, 6000]

      for (let i = 0; i < delays.length; i++) {
        if (i > 0) await new Promise((r) => setTimeout(r, delays[i]))

        // Tenta com schema explícito primeiro
        let { data, error } = await supabase
          .schema(SCHEMA)
          .from('pimp_pedidos_gripmaster')
          .select('id')
          .limit(5)

        // Se PGRST002, tenta sem schema (usa padrão do cliente)
        if (error) {
          const code = (error as any).code || ''
          if (code === 'PGRST002' || (error.message || '').includes('schema cache')) {
            console.log('PGRST002 detectado, tentando sem schema explícito...')
            const retry = await supabase.from('pimp_pedidos_gripmaster').select('id').limit(5)
            if (!retry.error) {
              data = retry.data
              error = null
            } else {
              continue
            }
          } else {
            continue
          }
        }

        if (!error) {
          const count = Array.isArray(data) ? data.length : 0
          return {
            ok: true,
            message:
              count > 0
                ? `✅ PostgREST OK! ${count} registro(s) em ${SCHEMA}.pimp_pedidos_gripmaster. Dados devem carregar.`
                : `✅ PostgREST conectado! Schema '${SCHEMA}' acessível. Tabela vazia ou sem registros.`,
          }
        }

        return {
          ok: false,
          message: `❌ PostgREST: ${error.message} (código: ${code || 'N/A'})`,
        }
      }

      return {
        ok: false,
        message:
          `⚠️ PGRST002: Schema 'japbase' não está exposto no PostgREST.\n\n` +
          `📋 SOLUÇÃO:\n` +
          `1. Supabase Dashboard → Project Settings → API → Exposed schemas → adicione "japbase"\n` +
          `2. SQL Editor: Execute o script em docs/configurar-schema-japbase.sql\n` +
          `3. Ou execute manualmente: NOTIFY pgrst, 'reload schema'\n` +
          `4. Aguarde 1–2 minutos e teste novamente\n\n` +
          `💡 Link direto: https://supabase.com/dashboard/project/nqppjrtpwcnlufxsbknn/settings/api`,
      }
    } catch (err: any) {
      return {
        ok: false,
        message: `❌ Erro: ${err?.message || 'Erro inesperado'}`,
      }
    }
  }

  // Testa PostgreSQL direto primeiro
  const { rows, error } = await queryPostgres(
    `SELECT COUNT(*) as count FROM ${SCHEMA}.pimp_pedidos_gripmaster LIMIT 1`
  )

  if (!error && rows && rows.length > 0) {
    const count = parseInt(rows[0]?.count || '0', 10)
    _workingMethod = 'postgres'
    return {
      ok: true,
      message:
        count > 0
          ? `✅ PostgreSQL direto OK! Encontrados ${count} registro(s) em ${SCHEMA}.pimp_pedidos_gripmaster.`
          : `✅ PostgreSQL direto conectado! Schema '${SCHEMA}' acessível, mas ainda não há registros.`,
    }
  }

  // Se PostgreSQL falhou, testa PostgREST como fallback
  if (isFirewallError(error)) {
    console.warn('PostgreSQL bloqueado (firewall?). Testando PostgREST...')
  }

  try {
    const supabase = getSupabaseServer()
    const delays = [0, 2000, 4000]
    let lastError: any = null

    for (let i = 0; i < delays.length; i++) {
      if (i > 0) await new Promise((r) => setTimeout(r, delays[i]))
      
      const { data, error: supabaseError } = await supabase
        .schema(SCHEMA)
        .from('pimp_pedidos_gripmaster')
        .select('id')
        .limit(1)

      if (!supabaseError) {
        _workingMethod = 'supabase'
        const count = Array.isArray(data) ? data.length : 0
        return {
          ok: true,
          message:
            count > 0
              ? `✅ PostgREST OK! Encontrados ${count} registro(s). PostgreSQL direto bloqueado (firewall?).`
              : `✅ PostgREST conectado! PostgreSQL direto bloqueado (firewall?).`,
        }
      }

      const code = (supabaseError as any).code || ''
      if (code === 'PGRST002' || supabaseError.message?.includes('schema cache')) {
        lastError = supabaseError
        continue
      }

      return {
        ok: false,
        message: `❌ PostgREST: ${supabaseError.message}`,
      }
    }

    return {
      ok: false,
      message:
        `⚠️ Ambos os métodos falharam:\n` +
        `- PostgreSQL direto: ${error || 'timeout/firewall'}\n` +
        `- PostgREST: PGRST002 após ${delays.length} tentativas\n\n` +
        `Soluções:\n` +
        `1. Execute no SQL Editor: NOTIFY pgrst, 'reload schema'\n` +
        `2. Verifique firewall/rede corporativa\n` +
        `3. Aguarde 1-2 minutos e tente novamente`,
    }
  } catch (err: any) {
    return {
      ok: false,
      message: `❌ Erro: ${err?.message || 'Erro inesperado'}`,
    }
  }
}

// Re-exportar com nomes compatíveis
export const getPimpsFromPostgres = getPimps
export const getProdutosByPimpFromPostgres = getProdutosByPimp
export const getAllProdutosFromPostgres = getAllProdutos
export const getTransitoFromPostgres = getTransito
export const getRecebidosFromPostgres = getRecebidos
export const testPostgresConnection = testConnection
