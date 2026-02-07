/**
 * Cliente Supabase (PostgREST) – uso em API routes.
 * Pode falhar com PGRST002; use postgres.ts como alternativa.
 */
import { createClient } from '@supabase/supabase-js'

let _client: ReturnType<typeof createClient> | null = null

export function getSupabaseServer() {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios')
  }

  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: {
      schema: 'japbase', // Schema padrão - pode ajudar em alguns casos
    },
  })
  return _client
}
