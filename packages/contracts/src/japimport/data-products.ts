/**
 * @package @japbase/contracts
 * @module japimport/data-products
 * 
 * Contratos de Data Products do sistema JapImport.
 * 
 * Data Products são views SQL documentadas que outros sistemas podem consumir
 * via API ou ETL. Estes tipos correspondem às estruturas de dados dessas views.
 * 
 * @see docs/contratos/data-products.md para documentação completa das views SQL
 */

/**
 * Data Product: vw_pimp_historico
 * 
 * View consolidada que agrega dados de múltiplas tabelas do JapImport
 * para leitura eficiente por outros sistemas (JapView, JapSales, etc.).
 * 
 * Otimizada para consultas analíticas (OLAP).
 */
export interface VwPimpHistorico {
  id: string;
  pimp: string; // Número do PIMP
  exporter: string;
  fornecedor: string;
  proforma: string | null;
  produto: string | null;
  status: string;
  gripmaster_status: string | null;
  transito_status: string | null;
  order_date: string | null;
  eta: string | null;
  arrival: string | null;
  arrival_date: string | null;
  valor_total_usd: number | null;
  valor_frete_usd: number | null;
  origem: string;
  created_at: string;
  updated_at: string | null;
}
