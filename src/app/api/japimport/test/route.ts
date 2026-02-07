import { testConnection } from '@/services/japimport'

export async function GET() {
  try {
    const result = await testConnection()
    return Response.json(result)
  } catch (err: any) {
    return Response.json({
      ok: false,
      message: `❌ Erro: ${err?.message || 'Erro inesperado'}`,
    })
  }
}
