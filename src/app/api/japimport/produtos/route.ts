import { NextRequest } from 'next/server'
import { getAllProdutos } from '@/services/japimport'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pimp_id = searchParams.get('pimp_id') || undefined
    const search = searchParams.get('search') || undefined

    const produtos = await getAllProdutos({ pimp_id, search })
    return Response.json(produtos)
  } catch (err: any) {
    console.error('Erro API /api/japimport/produtos:', err)
    return Response.json({ error: err?.message || 'Erro' }, { status: 500 })
  }
}
