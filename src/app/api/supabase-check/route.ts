import { createClient } from '@supabase/supabase-js'
import { SUPABASE_SCHEMA, SUPABASE_TABLES } from '@/lib/supabaseConfig'

/**
 * GET /api/supabase-check
 * Diagnóstico do Supabase: retorna os campos que cada tabela está devolvendo.
 * Use para conferir se o banco está alinhado com o que o backend espera.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return Response.json(
      {
        ok: false,
        error: 'Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias.',
        schema: SUPABASE_SCHEMA,
      },
      { status: 503 }
    )
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const result: Record<string, unknown> = {
    ok: true,
    schema: SUPABASE_SCHEMA,
    url: url.replace(/\/\/[^/]+@/, '//***@'),
    tables: {} as Record<string, { columns: string[]; sample: unknown; error?: string }>,
  }

  // PIMPs
  try {
    const { data, error } = await supabase
      .schema(SUPABASE_SCHEMA)
      .from(SUPABASE_TABLES.pimps)
      .select('*')
      .limit(1)

    if (error) {
      ;(result.tables as Record<string, unknown>).pimps = {
        columns: [],
        sample: null,
        error: `${error.code}: ${error.message}`,
      }
    } else {
      const row = Array.isArray(data) ? data[0] : data
      ;(result.tables as Record<string, unknown>).pimps = {
        columns: row && typeof row === 'object' ? Object.keys(row) : [],
        sample: row ?? null,
      }
    }
  } catch (e: unknown) {
    ;(result.tables as Record<string, unknown>).pimps = {
      columns: [],
      sample: null,
      error: e instanceof Error ? e.message : String(e),
    }
  }

  // pimps_produtos
  try {
    const { data, error } = await supabase
      .schema(SUPABASE_SCHEMA)
      .from(SUPABASE_TABLES.pimpsProdutos)
      .select('*')
      .limit(1)

    if (error) {
      ;(result.tables as Record<string, unknown>).pimps_produtos = {
        columns: [],
        sample: null,
        error: `${error.code}: ${error.message}`,
      }
    } else {
      const row = Array.isArray(data) ? data[0] : data
      ;(result.tables as Record<string, unknown>).pimps_produtos = {
        columns: row && typeof row === 'object' ? Object.keys(row) : [],
        sample: row ?? null,
      }
    }
  } catch (e: unknown) {
    ;(result.tables as Record<string, unknown>).pimps_produtos = {
      columns: [],
      sample: null,
      error: e instanceof Error ? e.message : String(e),
    }
  }

  // pimps_transito
  try {
    const { data, error } = await supabase
      .schema(SUPABASE_SCHEMA)
      .from(SUPABASE_TABLES.pimpsTransito)
      .select('*')
      .limit(1)

    if (error) {
      ;(result.tables as Record<string, unknown>).pimps_transito = {
        columns: [],
        sample: null,
        error: `${error.code}: ${error.message}`,
      }
    } else {
      const row = Array.isArray(data) ? data[0] : data
      ;(result.tables as Record<string, unknown>).pimps_transito = {
        columns: row && typeof row === 'object' ? Object.keys(row) : [],
        sample: row ?? null,
      }
    }
  } catch (e: unknown) {
    ;(result.tables as Record<string, unknown>).pimps_transito = {
      columns: [],
      sample: null,
      error: e instanceof Error ? e.message : String(e),
    }
  }

  // Se schema import falhou em tudo, tenta public
  const tables = result.tables as Record<string, { columns: string[]; error?: string }>
  const allErrors = [tables.pimps?.error, tables.pimps_produtos?.error, tables.pimps_transito?.error].filter(Boolean)
  if (allErrors.length >= 2 && SUPABASE_SCHEMA === 'import') {
    try {
      const { data, error } = await supabase.from('pimps').select('*').limit(1)
      if (!error && data && data.length > 0) {
        result.fallbackPublic = true
        result.message = 'Tabelas podem estar em schema "public". Defina NEXT_PUBLIC_SUPABASE_SCHEMA=public se for o caso.'
      }
    } catch {
      // ignore
    }
  }

  return Response.json(result)
}
