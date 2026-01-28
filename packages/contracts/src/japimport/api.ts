/**
 * @package @japbase/contracts
 * @module japimport/api
 * 
 * Contratos de API REST do sistema JapImport.
 * 
 * Estes tipos definem os contratos de comunicação entre sistemas.
 * Sistemas consumidores devem usar apenas estes tipos, nunca importar
 * código de negócio diretamente do JapImport.
 * 
 * @example
 * ```typescript
 * import { GetPimpsResponse } from '@japbase/contracts/japimport';
 * 
 * async function loadPimps(): Promise<GetPimpsResponse> {
 *   const response = await fetch('/api/japimport/v1/pimps');
 *   return response.json();
 * }
 * ```
 */

/**
 * Filtros para consulta de PIMPs
 */
export interface GetPimpsFilters {
  /** Filtrar por fornecedor/exporter */
  exporter?: string;
  /** Filtrar por status */
  status?: string;
  /** Busca textual em múltiplos campos */
  search?: string;
  /** Paginação: página atual (1-indexed) */
  page?: number;
  /** Paginação: itens por página */
  perPage?: number;
}

/**
 * Metadados de paginação
 */
export interface PaginationMeta {
  /** Total de registros */
  total: number;
  /** Página atual */
  page: number;
  /** Itens por página */
  perPage: number;
  /** Total de páginas */
  totalPages: number;
}

/**
 * Resposta da API GET /api/v1/pimps
 */
export interface GetPimpsResponse {
  /** Lista de PIMPs */
  data: Pimp[];
  /** Metadados de paginação */
  meta: PaginationMeta;
}

/**
 * Resposta da API GET /api/v1/pimps/:id
 */
export interface GetPimpByIdResponse {
  /** Dados do PIMP */
  data: Pimp | null;
}

/**
 * Resposta da API GET /api/v1/pimps/:id/produtos
 */
export interface GetProdutosByPimpIdResponse {
  /** Lista de produtos do PIMP */
  data: ProdutoPimp[];
}

/**
 * Resposta da API GET /api/v1/pimps/transito
 */
export interface GetPimpsTransitoResponse {
  /** Lista de PIMPs em trânsito */
  data: PimpTransito[];
}

/**
 * Resposta da API GET /api/v1/pimps/count-by-status
 */
export interface GetPimpsCountByStatusResponse {
  /** Contagem de PIMPs ativos */
  ativos: number;
  /** Contagem de PIMPs finalizados */
  finalizados: number;
  /** Total de PIMPs */
  total: number;
}

/**
 * Payload para criação de PIMP (POST /api/v1/pimps)
 */
export interface CreatePimpRequest {
  pimp_numero: string;
  exporter: string;
  proforma?: string | null;
  status: string;
  order_date?: string | null;
  eta?: string | null;
  arrival_date?: string | null;
  valor_total_usd?: number | null;
  valor_frete_usd?: number | null;
  origem?: string;
}

/**
 * Payload para atualização de PIMP (PATCH /api/v1/pimps/:id)
 */
export interface UpdatePimpRequest {
  exporter?: string;
  proforma?: string | null;
  status?: string;
  order_date?: string | null;
  eta?: string | null;
  arrival_date?: string | null;
  valor_total_usd?: number | null;
  valor_frete_usd?: number | null;
}

/**
 * Entidade PIMP (Processo de Importação)
 */
export interface Pimp {
  id: string;
  pimp_numero: string;
  exporter: string;
  proforma: string | null;
  status: string;
  order_date: string | null;
  eta: string | null;
  arrival_date: string | null;
  valor_total_usd: number | null;
  valor_frete_usd: number | null;
  origem: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Entidade Produto de PIMP
 */
export interface ProdutoPimp {
  id: string;
  pimp_id: string;
  codigo_produto: string | null;
  descricao: string | null;
  quantidade: number | null;
  valor_unitario_usd: number | null;
  valor_unitario_brl: number | null;
  valor_total_usd: number | null;
  created_at?: string;
}

/**
 * Entidade PIMP em Trânsito
 */
export interface PimpTransito {
  id: string;
  pimp_id: string | null;
  carrier: string | null;
  agent: string | null;
  container: string | null;
  invoice_numero: string | null;
  status_averbacao: string | null;
  arrival_port_date: string | null;
  created_at?: string;
}
