/**
 * Conexão direta PostgreSQL – contorna PostgREST (PGRST002).
 *
 * Use DATABASE_URL no .env.local:
 * Supabase Dashboard → Project Settings → Database → Connection string
 * Escolha "URI" e use a connection string (Session mode, port 5432).
 *
 * Exemplo: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
 */
import { Pool } from 'pg'

let pool: Pool | null = null

export function getPostgresPool(): Pool | null {
  if (pool) return pool

  const url = process.env.DATABASE_URL?.trim()
  if (!url || url.length < 20) {
    console.warn('DATABASE_URL não configurada – conexão direta PostgreSQL indisponível')
    return null
  }

  try {
    pool = new Pool({
      connectionString: url,
      ssl: url.includes('supabase') ? { rejectUnauthorized: false } : undefined,
      max: 5,
      idleTimeoutMillis: 30000,
    })
    return pool
  } catch (err) {
    console.error('Erro ao criar pool PostgreSQL:', err)
    return null
  }
}

export async function queryPostgres<T = any>(
  sql: string,
  params?: any[]
): Promise<{ rows: T[]; error?: string }> {
  const p = getPostgresPool()
  if (!p) {
    return { rows: [], error: 'DATABASE_URL não configurada' }
  }

  try {
    const result = await p.query(sql, params)
    return { rows: result.rows || [] }
  } catch (err: any) {
    console.error('Erro queryPostgres:', err)
    return { rows: [], error: err?.message || String(err) }
  }
}
