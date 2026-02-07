import { NextRequest } from 'next/server'
import { getProdutosByPimp } from '@/services/japimport'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pimpId: string }> }
) {
  try {
    const { pimpId } = await params
    const produtos = await getProdutosByPimp(pimpId)
    return Response.json(produtos)
  } catch (err: any) {
    console.error('Erro API produtos-by-pimp:', err)
    return Response.json({ error: err?.message }, { status: 500 })
  }
}
