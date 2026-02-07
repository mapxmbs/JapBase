import { getPimps } from '@/services/japimport'

export async function GET() {
  try {
    const pimps = await getPimps()
    const finalizados = pimps.filter((p) => p.status === 'Concluído').length
    const ativos = pimps.length - finalizados
    return Response.json({ ativos, finalizados, total: pimps.length })
  } catch (err: any) {
    console.error('Erro API /api/japimport/counts:', err)
    return Response.json({ ativos: 0, finalizados: 0, total: 0 })
  }
}
