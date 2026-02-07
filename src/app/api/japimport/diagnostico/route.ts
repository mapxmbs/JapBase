import { getSupabaseServer } from '@/lib/db/supabase'

const SCHEMA = 'japbase'
const TABLE = 'pimp_pedidos_gripmaster'

export async function GET() {
  const supabase = getSupabaseServer()
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: '',
  }

  // Teste 1: Verificar se consegue acessar sem schema (public)
  try {
    const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(1)
    results.tests.push({
      name: 'Teste 1: Acesso ao schema public',
      success: !error,
      error: error ? (error as any).message : null,
      note: 'Teste básico de conectividade',
    })
  } catch (err: any) {
    results.tests.push({
      name: 'Teste 1: Acesso ao schema public',
      success: false,
      error: err?.message,
    })
  }

  // Teste 2: Tentar acessar japbase sem especificar schema explicitamente
  try {
    const { data, error } = await supabase.from(`${SCHEMA}.${TABLE}`).select('id').limit(1)
    results.tests.push({
      name: 'Teste 2: Acesso direto com schema.tabela',
      success: !error,
      error: error ? (error as any).message : null,
      code: error ? (error as any).code : null,
      note: 'Tentativa sem .schema()',
    })
  } catch (err: any) {
    results.tests.push({
      name: 'Teste 2: Acesso direto com schema.tabela',
      success: false,
      error: err?.message,
    })
  }

  // Teste 3: Usar .schema() explicitamente
  try {
    const { data, error } = await supabase.schema(SCHEMA).from(TABLE).select('id').limit(1)
    results.tests.push({
      name: 'Teste 3: Acesso com .schema()',
      success: !error,
      error: error ? (error as any).message : null,
      code: error ? (error as any).code : null,
      dataCount: Array.isArray(data) ? data.length : 0,
      note: 'Método padrão usado no código',
    })
  } catch (err: any) {
    results.tests.push({
      name: 'Teste 3: Acesso com .schema()',
      success: false,
      error: err?.message,
    })
  }

  // Teste 4: Verificar se a tabela existe via RPC (se disponível)
  try {
    const { data, error } = await supabase.rpc('pg_tables', {
      schemaname: SCHEMA,
      tablename: TABLE,
    })
    results.tests.push({
      name: 'Teste 4: Verificar tabela via RPC',
      success: !error,
      error: error ? (error as any).message : null,
      note: 'Pode não estar disponível',
    })
  } catch (err: any) {
    results.tests.push({
      name: 'Teste 4: Verificar tabela via RPC',
      success: false,
      error: err?.message,
      note: 'RPC pode não estar disponível - ignorar se falhar',
    })
  }

  // Teste 5: Tentar com retry (simular o que fazemos no código)
  let retrySuccess = false
  let retryError: any = null
  for (let i = 0; i < 3; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, 2000))
    try {
      const { data, error } = await supabase.schema(SCHEMA).from(TABLE).select('id').limit(1)
      if (!error) {
        retrySuccess = true
        break
      }
      retryError = error
      const code = (error as any).code || ''
      if (code !== 'PGRST002') break
    } catch (err: any) {
      retryError = err
      break
    }
  }
  results.tests.push({
    name: 'Teste 5: Retry (3 tentativas)',
    success: retrySuccess,
    error: retryError ? (retryError as any).message : null,
    code: retryError ? (retryError as any).code : null,
    note: 'Simula o comportamento do código real',
  })

  // Resumo
  const successCount = results.tests.filter((t: any) => t.success).length
  const totalTests = results.tests.length
  results.summary = `${successCount}/${totalTests} testes passaram`

  // Diagnóstico
  const pgrst002Count = results.tests.filter(
    (t: any) => t.code === 'PGRST002' || (t.error || '').includes('schema cache')
  ).length

  if (pgrst002Count > 0) {
    results.diagnosis = `PGRST002 detectado em ${pgrst002Count} teste(s). O schema 'japbase' pode não estar exposto ou o cache não foi recarregado.`
    results.recommendations = [
      'Verifique: Project Settings → API → Exposed schemas → deve conter "japbase"',
      'Execute: NOTIFY pgrst, "reload schema"; no SQL Editor',
      'Aguarde 5-10 minutos após expor o schema',
      'Tente reiniciar o projeto Supabase (se possível)',
    ]
  } else if (successCount === 0) {
    results.diagnosis = 'Todos os testes falharam. Verifique credenciais e conectividade.'
  } else {
    results.diagnosis = 'Alguns testes passaram. O problema pode ser específico do método de acesso.'
  }

  return Response.json(results, {
    headers: { 'Content-Type': 'application/json' },
  })
}
