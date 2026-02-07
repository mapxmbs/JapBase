/**
 * JapImport – Bounded Context de Importações (PIMPs)
 *
 * Serviço de dados: usa PostgreSQL direto (primário) ou PostgREST (fallback se firewall bloquear).
 * Detecta automaticamente qual método funciona.
 */

export {
  getPimps,
  getProdutosByPimp,
  getAllProdutos,
  getTransito,
  getRecebidos,
  testConnection,
  // Compatibilidade com nomes antigos
  getPimpsFromPostgres,
  getProdutosByPimpFromPostgres,
  getAllProdutosFromPostgres,
  getTransitoFromPostgres,
  getRecebidosFromPostgres,
  testPostgresConnection,
} from './pimpsRepository'
export * from './types'
