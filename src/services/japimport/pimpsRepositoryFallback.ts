/**
 * Fallback via PostgREST quando PostgreSQL direto falha (firewall/timeout).
 * Usa Supabase client com retry robusto para PGRST002.
 */
import { getSupabaseServer } from '@/lib/db/supabase'
import type { Pimp, ProdutoPimp, PimpTransito, PimpRecebido } from './types'

const SCHEMA = 'japbase'
const TABLE_GRIPMASTER = 'pimp_pedidos_gripmaster'
const TABLE_TRANSITO = 'pimp_transito_geral'
const TABLE_RECEBIDOS = 'pimp_recebidos_geral'

async function retryOnPGRST002<T>(
  fn: () => Promise<{ data: T | null; error: any }>,
  maxRetries = 5
): Promise<{ data: T | null; error: any }> {
  let lastError: any = null
  for (let i = 0; i <= maxRetries; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, 1500 * i))
    const result = await fn()
    if (!result.error) return result
    const code = (result.error as any).code || ''
    const msg = (result.error?.message || '').toLowerCase()
    if (code === 'PGRST002' || msg.includes('schema cache') || msg.includes('pgrst')) {
      lastError = result.error
      continue
    }
    return result
  }
  return { data: null, error: lastError }
}

export async function getPimpsFromSupabase(filters?: {
  status?: string
  search?: string
}): Promise<Pimp[]> {
  try {
    const supabase = getSupabaseServer()
    
    // Tenta primeiro com schema explícito
    let { data: gripRows, error: gripError } = await retryOnPGRST002(() =>
      supabase.schema(SCHEMA).from(TABLE_GRIPMASTER).select('*')
    )

    // Se falhar com PGRST002, tenta sem especificar schema (usa o padrão do cliente)
    if (gripError) {
      const code = (gripError as any).code || ''
      const msg = (gripError?.message || '').toLowerCase()
      if (code === 'PGRST002' || msg.includes('schema cache') || msg.includes('pgrst')) {
        console.warn('PGRST002 com schema explícito, tentando sem schema...')
        const retry = await retryOnPGRST002(() =>
          supabase.from(TABLE_GRIPMASTER).select('*')
        )
        gripRows = retry.data
        gripError = retry.error
      }
    }

    if (gripError || !Array.isArray(gripRows) || gripRows.length === 0) {
      if (gripError) {
        const code = (gripError as any).code || ''
        console.error(`getPimpsFromSupabase (gripmaster):`, {
          code,
          message: gripError.message,
          details: gripError,
        })
      }
      return []
    }

    const pimpNums = new Set<number>()
    for (const r of gripRows as any[]) {
      if (typeof r.estimated_pimp === 'number') pimpNums.add(r.estimated_pimp)
    }
    if (pimpNums.size === 0) return []

    const { data: transitoRows } = await retryOnPGRST002(() =>
      supabase
        .schema(SCHEMA)
        .from(TABLE_TRANSITO)
        .select('*')
        .in('pimp', Array.from(pimpNums))
    )

    const gripByPimp = new Map<number, any[]>()
    for (const r of gripRows as any[]) {
      const n = typeof r.estimated_pimp === 'number' ? r.estimated_pimp : null
      if (n != null) {
        const list = gripByPimp.get(n) ?? []
        list.push(r)
        gripByPimp.set(n, list)
      }
    }

    const transitoByPimp = new Map<number, any>()
    if (Array.isArray(transitoRows)) {
      for (const r of transitoRows as any[]) {
        const n = typeof r.pimp === 'number' ? r.pimp : null
        if (n != null && !transitoByPimp.has(n)) {
          transitoByPimp.set(n, r)
        }
      }
    }

    const result: Pimp[] = []
    for (const num of Array.from(pimpNums)) {
      const gripList = gripByPimp.get(num) ?? []
      const transito = transitoByPimp.get(num)

      let exporter = ''
      let proforma: string | null = null
      let status = ''
      let order_date: string | null = null
      let eta: string | null = null
      let valor_total_usd: number | null = null
      let valor_freight_usd: number | null = null
      let arrival_date: string | null = null

      if (gripList.length > 0) {
        const last = gripList[gripList.length - 1]
        exporter = last.exporter || ''
        proforma = last.proforma_pedido || null
        status = last.status || ''
        order_date = last.order_date ? String(last.order_date) : null
        eta = last.eta ? String(last.eta) : null
        valor_total_usd = gripList.reduce((sum, r) => sum + (r.usd_total || 0), 0) || null
        valor_freight_usd = gripList.reduce((sum, r) => sum + (r.usd_freight || 0), 0) || null
      }

      if (transito) {
        if (transito.status) status = transito.status
        if (transito.eta) eta = String(transito.eta)
        if (transito.arrival_date) arrival_date = String(transito.arrival_date)
      }

      if (filters?.status && status !== filters.status) continue
      if (filters?.search?.trim()) {
        const s = filters.search.toLowerCase()
        if (
          !String(num).includes(s) &&
          !exporter.toLowerCase().includes(s) &&
          !(proforma || '').toLowerCase().includes(s) &&
          !status.toLowerCase().includes(s)
        ) {
          continue
        }
      }

      result.push({
        id: String(num),
        pimp_numero: String(num),
        exporter,
        proforma,
        status,
        order_date,
        eta,
        arrival_date,
        valor_total_usd,
        valor_freight_usd,
        origem: 'gripmaster/transito',
        created_at: gripList[0]?.created_at ? String(gripList[0].created_at) : undefined,
      })
    }

    return result.sort((a, b) => parseInt(b.pimp_numero) - parseInt(a.pimp_numero))
  } catch (err) {
    console.error('getPimpsFromSupabase:', err)
    return []
  }
}

export async function getProdutosByPimpFromSupabase(pimpId: string): Promise<ProdutoPimp[]> {
  try {
    const pimpNum = parseInt(pimpId, 10)
    if (isNaN(pimpNum)) return []

    const supabase = getSupabaseServer()
    const { data, error } = await retryOnPGRST002(() =>
      supabase
        .schema(SCHEMA)
        .from(TABLE_GRIPMASTER)
        .select('*')
        .eq('estimated_pimp', pimpNum)
        .order('created_at', { ascending: true })
    )

    if (error) {
      console.error('getProdutosByPimpFromSupabase:', error)
      return []
    }

    const rows = Array.isArray(data) ? data : []
    return rows.map((r: any) => ({
      id: String(r.id),
      pimp_id: pimpId,
      codigo_produto: r.cod || null,
      descricao: r.description || null,
      quantidade: r.qtd || null,
      valor_unitario_usd: r.usd_unity || null,
      valor_unitario_brl: r.brl_unity || null,
      valor_total_usd: r.usd_total || null,
      created_at: r.created_at ? String(r.created_at) : undefined,
    }))
  } catch {
    return []
  }
}

export async function getAllProdutosFromSupabase(filters?: {
  pimp_id?: string
  search?: string
}): Promise<ProdutoPimp[]> {
  try {
    const supabase = getSupabaseServer()
    let query = supabase.schema(SCHEMA).from(TABLE_GRIPMASTER).select('*').order('created_at', { ascending: false })

    if (filters?.pimp_id) {
      const n = parseInt(filters.pimp_id, 10)
      if (!isNaN(n)) query = query.eq('estimated_pimp', n)
    }
    if (filters?.search?.trim()) {
      query = query.or(`cod.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await retryOnPGRST002(() => query)
    if (error) {
      console.error('getAllProdutosFromSupabase:', error)
      return []
    }

    const rows = Array.isArray(data) ? data : []
    return rows.map((r: any) => ({
      id: String(r.id),
      pimp_id: filters?.pimp_id || String(r.estimated_pimp),
      codigo_produto: r.cod || null,
      descricao: r.description || null,
      quantidade: r.qtd || null,
      valor_unitario_usd: r.usd_unity || null,
      valor_unitario_brl: r.brl_unity || null,
      valor_total_usd: r.usd_total || null,
      created_at: r.created_at ? String(r.created_at) : undefined,
    }))
  } catch {
    return []
  }
}

export async function getTransitoFromSupabase(filters?: {
  pimp_id?: string
  search?: string
}): Promise<Array<PimpTransito & { pimp_numero?: string }>> {
  try {
    const supabase = getSupabaseServer()
    let query = supabase.schema(SCHEMA).from(TABLE_TRANSITO).select('*').order('created_at', { ascending: false })

    if (filters?.pimp_id) {
      const n = parseInt(filters.pimp_id, 10)
      if (!isNaN(n)) query = query.eq('pimp', n)
    }
    if (filters?.search?.trim()) {
      query = query.or(
        `carrier.ilike.%${filters.search}%,agent.ilike.%${filters.search}%,container.ilike.%${filters.search}%,invoice.ilike.%${filters.search}%,status.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await retryOnPGRST002(() => query)
    if (error) {
      console.error('getTransitoFromSupabase:', error)
      return []
    }

    const rows = Array.isArray(data) ? data : []
    return rows.map((r: any) => ({
      id: String(r.id),
      pimp_id: r.pimp ? String(r.pimp) : null,
      pimp_numero: r.pimp ? String(r.pimp) : undefined,
      carrier: r.carrier || null,
      agent: r.agent || null,
      container: r.container || null,
      invoice_numero: r.invoice || null,
      status_averbacao: r.status || null,
      arrival_port_date: r.arrival_date ? String(r.arrival_date) : r.eta ? String(r.eta) : null,
      created_at: r.created_at ? String(r.created_at) : undefined,
    }))
  } catch {
    return []
  }
}

export async function getRecebidosFromSupabase(filters?: {
  pimp_id?: string
  search?: string
}): Promise<PimpRecebido[]> {
  try {
    const supabase = getSupabaseServer()
    let query = supabase.schema(SCHEMA).from(TABLE_RECEBIDOS).select('*').order('created_at', { ascending: false })

    if (filters?.pimp_id) {
      const n = parseInt(filters.pimp_id, 10)
      if (!isNaN(n)) query = query.eq('pimp', n)
    }
    if (filters?.search?.trim()) {
      query = query.or(
        `exporter.ilike.%${filters.search}%,cod.ilike.%${filters.search}%,description.ilike.%${filters.search}%,reference.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await retryOnPGRST002(() => query)
    if (error) {
      console.error('getRecebidosFromSupabase:', error)
      return []
    }

    const rows = Array.isArray(data) ? data : []
    return rows.map((r: any) => ({
      id: String(r.id),
      pimp: r.pimp ? String(r.pimp) : '',
      exporter: r.exporter || '',
      qtd: r.qtd || null,
      cod: r.cod || null,
      description: r.description || null,
      usd_total: r.usd_total || null,
      usd_freight: r.usd_freight || null,
      received_date: r.received_date ? String(r.received_date) : null,
      reference: r.reference || null,
      created_at: r.created_at ? String(r.created_at) : undefined,
    }))
  } catch {
    return []
  }
}
