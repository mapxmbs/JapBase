/**
 * Cliente de API para JapImport.
 * Busca dados via API routes (server-side com service_role) em vez de Supabase direto.
 */

const BASE = '/api/japimport'

async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  const text = await res.text()
  if (!res.ok) {
    let errMsg = text
    try {
      const json = JSON.parse(text)
      if (json?.error) errMsg = json.error
    } catch {
      // ignore
    }
    throw new Error(errMsg || `Erro ${res.status}`)
  }
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error('Resposta inválida da API')
  }
}

export async function getPimps(filters?: {
  status?: string
  exporter?: string
  search?: string
}): Promise<any[]> {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.search) params.set('search', filters.search || '')
  const q = params.toString()
  return fetchApi(`${BASE}/pimps${q ? '?' + q : ''}`)
}

export async function getPimpsWithProdutos(filters?: {
  status?: string
  search?: string
}): Promise<any[]> {
  const params = new URLSearchParams({ produtos: 'true' })
  if (filters?.status) params.set('status', filters.status)
  if (filters?.search) params.set('search', filters.search || '')
  return fetchApi(`${BASE}/pimps?${params}`)
}

export async function getProdutosByPimpId(pimpId: string): Promise<any[]> {
  return fetchApi(`${BASE}/produtos-by-pimp/${encodeURIComponent(pimpId)}`)
}

export async function getAllProdutos(filters?: {
  pimp_id?: string
  codigo_produto?: string
  search?: string
}): Promise<any[]> {
  const params = new URLSearchParams()
  if (filters?.pimp_id) params.set('pimp_id', filters.pimp_id)
  if (filters?.search) params.set('search', filters.search || '')
  const q = params.toString()
  return fetchApi(`${BASE}/produtos${q ? '?' + q : ''}`)
}

export async function getPimpsTransito(filters?: {
  pimp_id?: string
  carrier?: string
  search?: string
}): Promise<any[]> {
  const params = new URLSearchParams()
  if (filters?.pimp_id) params.set('pimp_id', filters.pimp_id)
  if (filters?.search) params.set('search', filters.search || '')
  const q = params.toString()
  return fetchApi(`${BASE}/transito${q ? '?' + q : ''}`)
}

export async function getPimpsRecebidos(filters?: {
  pimp_id?: string
  search?: string
}): Promise<any[]> {
  const params = new URLSearchParams()
  if (filters?.pimp_id) params.set('pimp_id', filters.pimp_id)
  if (filters?.search) params.set('search', filters.search || '')
  const q = params.toString()
  return fetchApi(`${BASE}/recebidos${q ? '?' + q : ''}`)
}

export async function getPimpsCountByStatus(): Promise<{
  ativos: number
  finalizados: number
  total: number
}> {
  return fetchApi(`${BASE}/counts`)
}

export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  return fetchApi(`${BASE}/test`)
}

export async function updatePimp(_id: string, _updates: Record<string, unknown>): Promise<any | null> {
  return null
}
