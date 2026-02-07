import { NextRequest } from 'next/server'
import {
  getPimps,
  getProdutosByPimp,
} from '@/services/japimport'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined

    const pimps = await getPimps({ status, search })

    const withProdutos = searchParams.get('produtos') === 'true'
    if (withProdutos && pimps.length > 0) {
      const pimpsComProdutos = await Promise.all(
        pimps.map(async (p) => {
          const produtos = await getProdutosByPimp(p.id)
          return { ...p, produtos }
        })
      )
      return Response.json(pimpsComProdutos)
    }

    return Response.json(pimps)
  } catch (err: any) {
    console.error('Erro API /api/japimport/pimps:', err)
    return Response.json(
      { error: err?.message || 'Erro ao buscar PIMPs' },
      { status: 500 }
    )
  }
}
