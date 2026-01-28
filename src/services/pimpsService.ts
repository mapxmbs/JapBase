/**
 * pimpsService – JapImport
 *
 * Adaptado para o schema real `japbase` informado:
 *
 *   - japbase.pimps                   → Tabela mestre de PIMPs (id, pimp)
 *   - japbase.pimp_pedidos_gripmaster → Itens GRIPMASTER (pedido / proforma)
 *   - japbase.pimp_transito_geral     → Trânsito consolidado por PIMP
 *   - japbase.pimp_transito           → Detalhes de trânsito por item (não usado aqui ainda)
 *   - japbase.pimp_recebidos_geral    → Recebidos consolidados por PIMP (futuro)
 *   - japbase.pimp_recebidos          → Detalhes de recebidos (futuro)
 *
 * Objetivo deste serviço:
 *   - Fornecer dados agregados por número de PIMP para o grid do JapImport,
 *     sem depender de views como `vw_pimp_historico`.
 *   - Separar claramente:
 *     - Cabeçalho de PIMPs        → japbase.pimps + pimp_pedidos_gripmaster (+ trânsito geral)
 *     - Aba GRIPMASTER (produtos) → japbase.pimp_pedidos_gripmaster
 *     - Aba TRÂNSITO              → japbase.pimp_transito_geral
 *   - Preparar base para futura aba de RECEBIDOS.
 */

import { supabase } from '@/lib/supabaseClient'

const SCHEMA = 'japbase'
const TABLE_PEDIDOS_GRIPMASTER = 'pimp_pedidos_gripmaster'
const TABLE_TRANSITO_GERAL = 'pimp_transito_geral'
const TABLE_RECEBIDOS_GERAL = 'pimp_recebidos_geral'

export interface Pimp {
  id: string
  pimp_numero: string
  exporter: string
  proforma: string | null
  status: string
  order_date: string | null
  eta: string | null
  arrival_date: string | null
  valor_total_usd: number | null
  valor_frete_usd: number | null
  origem: string
  created_at?: string
}

export interface ProdutoPimp {
  id: string
  pimp_id: string
  codigo_produto: string | null
  descricao: string | null
  quantidade: number | null
  valor_unitario_usd: number | null
  valor_unitario_brl: number | null
  valor_total_usd: number | null
  created_at?: string
}

export interface PimpTransito {
  id: string
  pimp_id: string | null
  carrier: string | null
  agent: string | null
  container: string | null
  invoice_numero: string | null
  status_averbacao: string | null
  arrival_port_date: string | null
  created_at?: string
}

export interface PimpRecebido {
  id: string
  pimp: string
  exporter: string
  qtd: number | null
  cod: string | null
  description: string | null
  usd_total: number | null
  usd_freight: number | null
  received_date: string | null
  reference: string | null
  created_at?: string
}
/**
 * Normaliza uma linha de japbase.pimp_pedidos_gripmaster para ProdutoPimp.
 *
 * Tabela real:
 *   - estimated_pimp  (int)    → número do PIMP estimado
 *   - cod             (text)   → código do produto
 *   - description     (text)   → descrição
 *   - qtd             (int)    → quantidade
 *   - usd_unity       (numeric)→ valor unitário em USD
 *   - brl_unity       (numeric)→ valor unitário em BRL
 *   - usd_total       (numeric)→ valor total em USD
 *   - usd_freight     (numeric)→ valor de frete em USD
 */

function normalizeProduto(row: Record<string, unknown> | null, pimpId: string): ProdutoPimp | null {
  if (!row || typeof row !== 'object') return null
  const r = row as Record<string, unknown>
  return {
    id: String(r.id ?? Math.random().toString(36).slice(2)),
    pimp_id: pimpId,
    codigo_produto: r.cod != null ? String(r.cod) : null,
    descricao: r.description != null ? String(r.description) : null,
    quantidade: typeof r.qtd === 'number' ? r.qtd : null,
    valor_unitario_usd: typeof r.usd_unity === 'number' ? r.usd_unity : null,
    valor_unitario_brl: typeof r.brl_unity === 'number' ? r.brl_unity : null,
    valor_total_usd: typeof r.usd_total === 'number' ? r.usd_total : null,
    created_at: r.created_at != null ? String(r.created_at) : undefined,
  }
}

function normalizeTransito(row: Record<string, unknown> | null, pimpIdOverride: string | null): PimpTransito | null {
  if (!row || typeof row !== 'object') return null
  const r = row as Record<string, unknown>
  // Tabela japbase.pimp_transito_geral:
  // - pimp          (int)
  // - exporter      (text)
  // - carrier       (text)
  // - agent         (text)
  // - container     (text)
  // - invoice       (text)
  // - status        (text)
  // - eta           (date)
  // - arrival_date  (date)
  const arrival =
    r.arrival_date != null
      ? String(r.arrival_date)
      : r.eta != null
      ? String(r.eta)
      : null
  return {
    id: String(r.id ?? ''),
    // No modelo atual não temos a foreign key para a tabela pimps,
    // apenas o número do PIMP. Mantemos pimp_id opcional/nulo por enquanto.
    pimp_id: pimpIdOverride ?? null,
    carrier: r.carrier != null ? String(r.carrier) : null,
    agent: r.agent != null ? String(r.agent) : null,
    container: r.container != null ? String(r.container) : null,
    invoice_numero: r.invoice != null ? String(r.invoice) : null,
    status_averbacao: r.status != null ? String(r.status) : null,
    arrival_port_date: arrival,
    created_at: r.created_at != null ? String(r.created_at) : undefined,
  }
}

/**
 * No modelo atual, usamos o próprio número do PIMP como `id` exposto
 * para o frontend. Ou seja:
 *
 * - JapImport trabalha com `pimp.id === pimp_numero` (string)
 * - As tabelas usam campos inteiros (estimated_pimp / pimp)
 *
 * Esta função apenas valida/normaliza o número recebido.
 */
async function resolvePimpNumberById(id: string): Promise<string | null> {
  if (!id) return null
  // Aceita tanto "123" quanto "00123"; normalizamos para int e voltamos para string.
  const n = Number(id)
  if (!Number.isFinite(n)) return null
  return String(n)
}

// ---------------------------------------------------------------------------
// getPimps – agrega dados de:
//   - japbase.pimp_pedidos_gripmaster (obrigatório)
//   - japbase.pimp_transito_geral     (opcional)
//
// NÃO dependemos de japbase.pimps estar populada.
// Construímos o cabeçalho de PIMPs por número (estimated_pimp/pimp) em memória.
// ---------------------------------------------------------------------------

// Função auxiliar para retry em caso de erro de schema cache (PGRST002)
// Usa delays progressivos para lidar com instabilidade temporária do Supabase
async function retryOnSchemaCacheError<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  maxRetries = 3,
  baseDelayMs = 2000
): Promise<{ data: T | null; error: any }> {
  let lastError: any = null
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      // Delay progressivo: 2s, 4s, 6s...
      const delay = baseDelayMs * attempt
      console.log(`[Retry ${attempt}/${maxRetries}] Aguardando ${delay}ms antes de tentar novamente...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
    
    const result = await queryFn()
    
    if (!result.error) {
      if (attempt > 0) {
        console.log(`✅ Sucesso após ${attempt} tentativa(s)`)
      }
      return result
    }
    
    const errorMsg = result.error.message || String(result.error)
    const errorCode = (result.error as any).code || ''
    
    // PGRST002 ou erro de schema cache - continuar tentando
    if (errorCode === 'PGRST002' || errorMsg.includes('schema cache') || errorMsg.includes('Could not query')) {
      lastError = result.error
      console.warn(`Erro ${errorCode} na tentativa ${attempt + 1}: ${errorMsg}`)
      continue // Tentar novamente
    }
    
    // Se não for erro de schema cache, retornar imediatamente
    return result
  }
  
  console.error(`❌ Falhou após ${maxRetries + 1} tentativas`)
  return { data: null, error: lastError }
}

export async function getPimps(filters?: {
  status?: string
  exporter?: string
  search?: string
}): Promise<Pimp[]> {
  try {
    // 1) Buscar todos os registros de GRIPMASTER (com retry para schema cache)
    const { data: gripRows, error: gripError } = await retryOnSchemaCacheError(() =>
      supabase
        .schema(SCHEMA)
        .from(TABLE_PEDIDOS_GRIPMASTER)
        .select('*')
    )

    if (gripError || !Array.isArray(gripRows) || gripRows.length === 0) {
      if (gripError) {
        console.error('Erro Supabase getPimps (pimp_pedidos_gripmaster):', gripError)
        const errorMsg = gripError.message || String(gripError)
        // Se ainda for erro de schema cache após retries, logar e retornar vazio
        if (errorMsg.includes('schema cache') || errorMsg.includes('Could not query')) {
          console.warn(`Schema '${SCHEMA}' não está acessível após retries. Verifique se está exposto no Supabase Dashboard > Settings > API > Exposed schemas.`)
          return []
        }
        // Outros erros também não devem quebrar - apenas retornar vazio
        return []
      }
      // Sem registros ainda → retorna lista vazia (sem erro)
      return []
    }

    type GripRow = {
      id: string
      estimated_pimp: number
      order_date?: string | null
      exporter?: string | null
      proforma_pedido?: string | null
      status?: string | null
      eta?: string | null
      usd_total?: number | null
      usd_freight?: number | null
      created_at?: string | null
    }

    const grip = gripRows as unknown as GripRow[]

    // Determinar todos os números de PIMP a partir de estimated_pimp
    const pimpNumsSet = new Set<number>()
    for (const row of grip) {
      if (typeof row.estimated_pimp === 'number') {
        pimpNumsSet.add(row.estimated_pimp)
      }
    }
    const pimpNums = Array.from(pimpNumsSet)
    if (!pimpNums.length) return []

    // 2) Buscar dados de TRÂNSITO GERAL relacionados (com retry)
    const { data: transitoGeralRows, error: transitoGeralError } = await retryOnSchemaCacheError(() =>
      supabase
        .schema(SCHEMA)
        .from(TABLE_TRANSITO_GERAL)
        .select('*')
    )
      .in('pimp', pimpNums)

    if (transitoGeralError) {
      console.error('Erro Supabase getPimps (pimp_transito_geral):', transitoGeralError)
      // Não derrubamos a tela por falha em trânsito; apenas seguimos sem trânsito
    }

    // 3) Agrupar GRIPMASTER por número de PIMP
    const gripByPimp = new Map<number, Record<string, unknown>[]>()
    if (Array.isArray(gripRows)) {
      for (const row of gripRows as Record<string, unknown>[]) {
        const n = typeof row.estimated_pimp === 'number' ? row.estimated_pimp : null
        if (n == null) continue
        const list = gripByPimp.get(n) ?? []
        list.push(row)
        gripByPimp.set(n, list)
      }
    }

    // 4) Agrupar TRÂNSITO GERAL por número de PIMP
    const transitoByPimp = new Map<number, Record<string, unknown>[]>()
    if (Array.isArray(transitoGeralRows)) {
      for (const row of transitoGeralRows as Record<string, unknown>[]) {
        const n = typeof row.pimp === 'number' ? row.pimp : null
        if (n == null) continue
        const list = transitoByPimp.get(n) ?? []
        list.push(row)
        transitoByPimp.set(n, list)
      }
    }

    // 5) Montar objetos Pimp agregados (um por número de PIMP)
    const result: Pimp[] = []

    for (const pimpNumeroNum of pimpNums) {
      const pimpNumero = String(pimpNumeroNum)

      const gripList = gripByPimp.get(pimpNumeroNum) ?? []
      const transitoList = transitoByPimp.get(pimpNumeroNum) ?? []

      // Agregar GRIPMASTER
      let exporter = ''
      let proforma: string | null = null
      let status = ''
      let order_date: string | null = null
      let eta: string | null = null
      let valor_total_usd: number | null = null
      let valor_frete_usd: number | null = null

      if (gripList.length > 0) {
        // Usamos a última linha como "linha mais recente"
        const last = gripList[gripList.length - 1]
        exporter = last.exporter != null ? String(last.exporter) : ''
        proforma = last.proforma_pedido != null ? String(last.proforma_pedido) : null
        status = last.status != null ? String(last.status) : ''
        order_date = last.order_date != null ? String(last.order_date) : null
        eta = last.eta != null ? String(last.eta) : null

        let total = 0
        let frete = 0
        for (const r of gripList) {
          if (typeof r.usd_total === 'number') total += r.usd_total
          if (typeof r.usd_freight === 'number') frete += r.usd_freight
        }
        valor_total_usd = total || null
        valor_frete_usd = frete || null
      }

      // Se houver dados em pimp_transito_geral, usamos status/eta/arrival mais atual
      let arrival_date: string | null = null
      if (transitoList.length > 0) {
        const lastT = transitoList[transitoList.length - 1]
        if (lastT.status != null) status = String(lastT.status)
        if (lastT.eta != null) eta = String(lastT.eta)
        if (lastT.arrival_date != null) arrival_date = String(lastT.arrival_date)
      }

      const pimp: Pimp = {
        // id = número do PIMP (string), para simplificar a comunicação com o frontend
        id: pimpNumero,
        pimp_numero: pimpNumero,
        exporter,
        proforma,
        status,
        order_date,
        eta,
        arrival_date,
        valor_total_usd,
        valor_frete_usd,
        origem: 'gripmaster/transito',
        created_at: gripList[0]?.created_at != null ? String(gripList[0].created_at) : undefined,
      }

      result.push(pimp)
    }

    // 7) Aplicar filtros em memória
    let filtered = result

    if (filters?.status) {
      filtered = filtered.filter((p) => p.status === filters.status)
    }

    if (filters?.exporter) {
      const exp = String(filters.exporter).toLowerCase()
      filtered = filtered.filter((p) => p.exporter.toLowerCase() === exp)
    }

    if (filters?.search && String(filters.search).trim()) {
      const s = String(filters.search).toLowerCase().trim()
      filtered = filtered.filter((p) => {
        return (
          p.pimp_numero.toLowerCase().includes(s) ||
          p.exporter.toLowerCase().includes(s) ||
          (p.proforma ?? '').toLowerCase().includes(s) ||
          (p.status ?? '').toLowerCase().includes(s)
        )
      })
    }

    return filtered
  } catch (err) {
    console.error('Erro em getPimps:', err)
    return []
  }
}

// ---------------------------------------------------------------------------
// getProdutosByPimpId – japbase.pimp_pedidos_gripmaster
// ---------------------------------------------------------------------------
export async function getProdutosByPimpId(pimpId: string): Promise<ProdutoPimp[]> {
  try {
    const pimpNum = await resolvePimpNumberById(pimpId)
    if (!pimpNum) return []

    const { data, error } = await retryOnSchemaCacheError(() =>
      supabase
        .schema(SCHEMA)
        .from(TABLE_PEDIDOS_GRIPMASTER)
        .select('*')
        .eq('estimated_pimp', pimpNum)
        .order('created_at', { ascending: true })
    )

    if (error) {
      console.error('Erro Supabase getProdutosByPimpId:', error)
      const errorMsg = error.message || String(error)
      if (errorMsg.includes('schema cache') || errorMsg.includes('Could not query')) {
        console.warn(`Schema '${SCHEMA}' não está acessível em getProdutosByPimpId após retries.`)
        return []
      }
      return []
    }
    const rows = Array.isArray(data) ? data : []
    return rows.map((r) => normalizeProduto(r as Record<string, unknown>, pimpId)).filter((p): p is ProdutoPimp => p != null)
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// getAllProdutos – japbase.pimp_pedidos_gripmaster, filtros cod, description
// ---------------------------------------------------------------------------
export async function getAllProdutos(filters?: {
  pimp_id?: string
  codigo_produto?: string
  search?: string
}): Promise<ProdutoPimp[]> {
  try {
    let query = supabase
      .schema(SCHEMA)
      .from(TABLE_PEDIDOS_GRIPMASTER)
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.pimp_id) {
      const pimpNum = await resolvePimpNumberById(filters.pimp_id)
      if (pimpNum) query = query.eq('estimated_pimp', pimpNum)
    }
    if (filters?.codigo_produto) {
      query = query.eq('cod', filters.codigo_produto)
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase()
      query = query.or(`cod.ilike.%${s}%,description.ilike.%${s}%`)
    }

    const { data, error } = await retryOnSchemaCacheError(() => query)
    if (error) {
      console.error('Erro Supabase getAllProdutos:', error)
      const errorMsg = error.message || String(error)
      if (errorMsg.includes('schema cache') || errorMsg.includes('Could not query')) {
        console.warn(`Schema '${SCHEMA}' não está acessível em getAllProdutos após retries.`)
        return []
      }
      return []
    }
    const rows = Array.isArray(data) ? data : []
    const pimpId = filters?.pimp_id ?? ''
    return rows.map((r) => normalizeProduto(r as Record<string, unknown>, pimpId)).filter((p): p is ProdutoPimp => p != null)
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// getPimpsTransito – japbase.pimp_transito
// ---------------------------------------------------------------------------
export async function getPimpsTransito(filters?: {
  pimp_id?: string
  carrier?: string
  search?: string
}): Promise<PimpTransito[]> {
  try {
    let query = supabase
      .schema(SCHEMA)
      .from(TABLE_TRANSITO_GERAL)
      .select('*')
      .order('created_at', { ascending: false })

    let pimpIdForRows: string | null = null
    if (filters?.pimp_id) {
      pimpIdForRows = filters.pimp_id
      const pimpNum = await resolvePimpNumberById(filters.pimp_id)
      if (pimpNum) query = query.eq('pimp', pimpNum)
    }
    if (filters?.carrier) {
      query = query.eq('carrier', filters.carrier)
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase()
      // Campos disponíveis em pimp_transito_geral: carrier, agent, container, invoice, status
      query = query.or(
        `carrier.ilike.%${s}%,agent.ilike.%${s}%,container.ilike.%${s}%,invoice.ilike.%${s}%,status.ilike.%${s}%`
      )
    }

    const { data, error } = await retryOnSchemaCacheError(() => query)
    if (error) {
      console.error('Erro Supabase getPimpsTransito:', error)
      const errorMsg = error.message || String(error)
      if (errorMsg.includes('schema cache') || errorMsg.includes('Could not query')) {
        console.warn(`Schema '${SCHEMA}' não está acessível em getPimpsTransito após retries.`)
        return []
      }
      return []
    }
    const rows = Array.isArray(data) ? data : []
    return rows.map((r) => normalizeTransito(r as Record<string, unknown>, pimpIdForRows)).filter((t): t is PimpTransito => t != null)
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// getPimpsRecebidos – japbase.pimp_recebidos_geral
// ---------------------------------------------------------------------------
export async function getPimpsRecebidos(filters?: {
  pimp_id?: string
  search?: string
}): Promise<PimpRecebido[]> {
  try {
    let baseQuery = supabase
      .schema(SCHEMA)
      .from(TABLE_RECEBIDOS_GERAL)
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.pimp_id) {
      const pimpNum = await resolvePimpNumberById(filters.pimp_id)
      if (pimpNum) baseQuery = baseQuery.eq('pimp', pimpNum)
    }

    if (filters?.search) {
      const s = filters.search.toLowerCase()
      baseQuery = baseQuery.or(
        [
          'exporter.ilike.%' + s + '%',
          'cod.ilike.%' + s + '%',
          'description.ilike.%' + s + '%',
          'reference.ilike.%' + s + '%',
        ].join(',')
      )
    }

    const { data, error } = await retryOnSchemaCacheError(() => baseQuery)
    
    if (error) {
      console.error('Erro Supabase getPimpsRecebidos:', error)
      const errorMsg = error.message || String(error)
      if (errorMsg.includes('schema cache') || errorMsg.includes('Could not query')) {
        console.warn(`Schema '${SCHEMA}' não está acessível em getPimpsRecebidos após retries.`)
        return []
      }
      return []
    }

    const rows = Array.isArray(data) ? data : []

    return rows.map((r) => {
      const row = r as Record<string, unknown>
      return {
        id: String(row.id ?? Math.random().toString(36).slice(2)),
        pimp: row.pimp != null ? String(row.pimp) : '',
        exporter: row.exporter != null ? String(row.exporter) : '',
        qtd: typeof row.qtd === 'number' ? row.qtd : null,
        cod: row.cod != null ? String(row.cod) : null,
        description: row.description != null ? String(row.description) : null,
        usd_total: typeof row.usd_total === 'number' ? row.usd_total : null,
        usd_freight: typeof row.usd_freight === 'number' ? row.usd_freight : null,
        received_date: row.received_date != null ? String(row.received_date) : null,
        reference: row.reference != null ? String(row.reference) : null,
        created_at: row.created_at != null ? String(row.created_at) : undefined,
      } as PimpRecebido
    })
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// testSupabaseConnection – usado pelo botão de teste no JapImport
// 
// Diagnóstico completo de conexão:
// 1. Testa conexão básica com Supabase
// 2. Tenta consultar schema japbase.pimp_pedidos_gripmaster
// 3. Se falhar, tenta outras tabelas para diagnóstico
// 4. Retorna mensagem clara sobre o problema encontrado
// ---------------------------------------------------------------------------
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    // Teste 0: Verificar se o cliente Supabase está configurado
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return {
        ok: false,
        message: '❌ Credenciais do Supabase não configuradas. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local'
      }
    }

    // Teste 1: Verificar conexão básica (sem schema específico)
    console.log('Testando conexão básica com Supabase...')
    const { data: basicTest, error: basicError } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(0)
      .maybeSingle()

    // Esperamos erro 404 ou similar (tabela não existe), mas não erro de conexão
    if (basicError && !basicError.message.includes('relation') && !basicError.message.includes('does not exist')) {
      console.warn('Erro na conexão básica:', basicError)
    }

    // Teste 2: Tentar consultar a tabela no schema japbase
    console.log(`Testando consulta em ${SCHEMA}.${TABLE_PEDIDOS_GRIPMASTER}...`)
    const { data: testData, error: testError } = await supabase
      .schema(SCHEMA)
      .from(TABLE_PEDIDOS_GRIPMASTER)
      .select('id')
      .limit(1)

    if (testError) {
      console.error('Erro Supabase testSupabaseConnection:', testError)
      const errorMsg = testError.message || String(testError)
      const errorCode = (testError as any).code || ''
      const errorDetails = (testError as any).details || ''

      // Erro PGRST002 ou schema cache - problema temporário do PostgREST
      if (errorCode === 'PGRST002' || errorMsg.includes('schema cache') || errorMsg.includes('Could not query')) {
        console.log(`Erro ${errorCode} (schema cache) detectado. Tentando retry com delays progressivos...`)
        
        // Retry progressivo: 2s, 4s, 6s
        const delays = [2000, 4000, 6000]
        let lastRetryError: any = null
        
        for (let i = 0; i < delays.length; i++) {
          console.log(`Tentativa ${i + 1}/${delays.length} após ${delays[i]}ms...`)
          await new Promise(resolve => setTimeout(resolve, delays[i]))
          
          const { data: retryData, error: retryError } = await supabase
            .schema(SCHEMA)
            .from(TABLE_PEDIDOS_GRIPMASTER)
            .select('id')
            .limit(1)

          if (!retryError) {
            // Sucesso após retry!
            const retryCount = Array.isArray(retryData) ? retryData.length : 0
            return {
              ok: true,
              message: `✅ Conexão OK após ${i + 1} tentativa(s)! Encontrados ${retryCount} registro(s) em ${SCHEMA}.${TABLE_PEDIDOS_GRIPMASTER}.\n\n` +
                `Nota: Este erro (PGRST002) geralmente indica instabilidade temporária do Supabase. Se persistir, verifique o status em status.supabase.com`
            }
          }
          
          lastRetryError = retryError
          
          // Se não for mais erro de schema cache, parar retries
          const retryErrorMsg = retryError.message || String(retryError)
          if (!retryErrorMsg.includes('schema cache') && !retryErrorMsg.includes('Could not query')) {
            break
          }
        }

        // Se falhou após todos os retries
        return {
          ok: false,
          message: `⚠️ Erro PGRST002 - Instabilidade temporária do Supabase\n\n` +
            `O PostgREST não conseguiu construir o cache de schema após ${delays.length} tentativas.\n\n` +
            `Soluções:\n` +
            `1. Aguarde 30-60 segundos e tente novamente\n` +
            `2. Verifique o status do Supabase: status.supabase.com\n` +
            `3. Se persistir, pode ser problema de infraestrutura do Supabase - contate o suporte\n\n` +
            `Erro original: ${errorMsg}\n` +
            `Código: ${errorCode}`
        }
      }

      // Erro de permissão (RLS)
      if (errorCode === 'PGRST301' || errorMsg.includes('permission denied') || errorMsg.includes('RLS')) {
        return {
          ok: false,
          message: `❌ Erro de permissão (RLS). Verifique:\n` +
            `1. Row Level Security está habilitado na tabela ${SCHEMA}.${TABLE_PEDIDOS_GRIPMASTER}?\n` +
            `2. Existe política RLS permitindo SELECT para role 'anon'?\n` +
            `3. Se necessário, desabilite temporariamente RLS para teste\n\n` +
            `Erro: ${errorMsg}`
        }
      }

      // Erro de tabela não encontrada
      if (errorMsg.includes('does not exist') || errorMsg.includes('relation')) {
        return {
          ok: false,
          message: `❌ Tabela não encontrada: ${SCHEMA}.${TABLE_PEDIDOS_GRIPMASTER}\n` +
            `Verifique se a tabela existe no schema '${SCHEMA}' no Supabase.`
        }
      }

      // Outro erro
      return {
        ok: false,
        message: `❌ Erro ao consultar ${SCHEMA}.${TABLE_PEDIDOS_GRIPMASTER}:\n` +
          `Mensagem: ${errorMsg}\n` +
          `Código: ${errorCode || 'N/A'}\n` +
          `Detalhes: ${errorDetails || 'N/A'}`
      }
    }

    // Sucesso!
    const count = Array.isArray(testData) ? testData.length : 0
    if (count === 0) {
      return {
        ok: true,
        message: `✅ Conectado ao Supabase! Schema '${SCHEMA}' acessível, mas ainda não há registros em ${TABLE_PEDIDOS_GRIPMASTER}.`
      }
    }

    return {
      ok: true,
      message: `✅ Conexão OK! Encontrados ${count} registro(s) em ${SCHEMA}.${TABLE_PEDIDOS_GRIPMASTER}.`
    }
  } catch (err: any) {
    console.error('Erro inesperado em testSupabaseConnection:', err)
    return { 
      ok: false, 
      message: `❌ Erro inesperado: ${err?.message || 'Verifique a conexão com o Supabase e as credenciais no .env.local'}` 
    }
  }
}

// ---------------------------------------------------------------------------
// getPimpsCountByStatus – japbase.vw_pimp_historico
// ---------------------------------------------------------------------------
export async function getPimpsCountByStatus(): Promise<{
  ativos: number
  finalizados: number
  total: number
}> {
  try {
    const pimps = await getPimps()
    if (!pimps.length) return { ativos: 0, finalizados: 0, total: 0 }

    const finalizados = pimps.filter((p) => p.status === 'Concluído').length
    const ativos = pimps.length - finalizados

    return { ativos, finalizados, total: pimps.length }
  } catch (err) {
    console.error('Erro em getPimpsCountByStatus:', err)
    return { ativos: 0, finalizados: 0, total: 0 }
  }
}

// ---------------------------------------------------------------------------
// getPimpsProximos – japbase.vw_pimp_historico
// ---------------------------------------------------------------------------
export async function getPimpsProximos(limit: number = 5): Promise<Pimp[]> {
  try {
    const hojeStr = new Date().toISOString().split('T')[0]
    const hoje = new Date(hojeStr)

    const pimps = await getPimps()
    const proximos = pimps
      .filter((p) => {
        if (!p.eta) return false
        const etaDate = new Date(p.eta)
        if (isNaN(etaDate.getTime())) return false
        // Consideramos apenas PIMPs não concluídos e com ETA hoje ou futuro
        return p.status !== 'Concluído' && etaDate >= hoje
      })
      .sort((a, b) => {
        const da = new Date(a.eta ?? hojeStr).getTime()
        const db = new Date(b.eta ?? hojeStr).getTime()
        return da - db
      })
      .slice(0, limit)

    return proximos
  } catch (err) {
    console.error('Erro em getPimpsProximos:', err)
    return []
  }
}

// ---------- Stubs (sem acesso ao banco) ----------
export async function updatePimp(_id: string, _updates: Partial<Pimp>): Promise<Pimp | null> {
  return null
}

export async function getPimpById(_id: string): Promise<Pimp | null> {
  return null
}
