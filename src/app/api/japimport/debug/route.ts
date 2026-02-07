import { getSupabaseServer } from '@/lib/db/supabase'
import { queryPostgres } from '@/lib/db/postgres'

const SCHEMA = 'japbase'
const TABLE = 'pimp_pedidos_gripmaster'

export async function GET() {
  const forcePostgRest =
    process.env.FORCE_POSTGREST === 'true' || process.env.FORCE_POSTGREST === '1'
  const hasDbUrl = !!(process.env.DATABASE_URL?.trim() && process.env.DATABASE_URL.length > 20)

  // Usa PostgREST quando forçado ou quando PostgreSQL não está disponível
  if (forcePostgRest || !hasDbUrl) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .schema(SCHEMA)
        .from(TABLE)
        .select('id, estimated_pimp, exporter, cod')
        .limit(5)

      return Response.json({
        ok: !error,
        method: 'PostgREST',
        error: error ? (error as any).message || String(error) : null,
        rowCount: Array.isArray(data) ? data.length : 0,
        sample: data || null,
        hint: error
          ? 'Supabase → Project Settings → API → Exposed schemas → adicione "japbase"'
          : null,
      })
    } catch (err: any) {
      return Response.json({
        ok: false,
        method: 'PostgREST',
        error: err?.message || 'Erro ao conectar',
        rowCount: 0,
        sample: null,
      })
    }
  }

  // PostgreSQL direto
  const { rows, error } = await queryPostgres(
    `SELECT id, estimated_pimp, exporter, cod FROM ${SCHEMA}.${TABLE} LIMIT 5`
  )

  return Response.json({
    ok: !error,
    method: 'PostgreSQL',
    error: error || null,
    rowCount: Array.isArray(rows) ? rows.length : 0,
    sample: rows || null,
  })
}
