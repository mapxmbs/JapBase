/**
 * Configuração central do Supabase para o JapImport.
 * Ajuste via .env: NEXT_PUBLIC_SUPABASE_SCHEMA e NEXT_PUBLIC_SUPABASE_TABLE_FLAVOR.
 */

/** Schema onde estão as tabelas do JapImport. No Supabase, exponha em Settings > API > Schemas. */
export const SUPABASE_SCHEMA =
  (process.env.NEXT_PUBLIC_SUPABASE_SCHEMA as string) || 'import'

/** "doc" = numero, fornecedor, produto, data_inicio, data_prevista, valor_usd, valor_brl. "japimport" = pimp_numero, exporter, proforma, order_date, eta, valor_total_usd. */
export type TableFlavor = 'japimport' | 'doc'
export const SUPABASE_TABLE_FLAVOR: TableFlavor =
  (process.env.NEXT_PUBLIC_SUPABASE_TABLE_FLAVOR as TableFlavor) || 'japimport'

export const SUPABASE_TABLES = {
  pimps: 'pimps',
  pimpsProdutos: 'pimps_produtos',
  pimpsTransito: 'pimps_transito',
} as const
