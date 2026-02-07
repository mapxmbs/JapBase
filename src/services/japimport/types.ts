/**
 * Tipos do Bounded Context JapImport
 */

export interface Pimp {
  id: string
  pimp_numero: string
  exporter: string
  proforma: string | null
  status: string
  order_date: string | null
  eta: string | null
  arrival_date: string | null
  valor_total_usd: number | null
  valor_freight_usd: number | null
  origem: string
  created_at?: string
}

export interface ProdutoPimp {
  id: string
  pimp_id: string
  codigo_produto: string | null
  descricao: string | null
  quantidade: number | null
  valor_unitario_usd: number | null
  valor_unitario_brl: number | null
  valor_total_usd: number | null
  created_at?: string
}

export interface PimpTransito {
  id: string
  pimp_id: string | null
  carrier: string | null
  agent: string | null
  container: string | null
  invoice_numero: string | null
  status_averbacao: string | null
  arrival_port_date: string | null
  pimp_numero?: string
  created_at?: string
}

export interface PimpRecebido {
  id: string
  pimp: string
  exporter: string
  qtd: number | null
  cod: string | null
  description: string | null
  usd_total: number | null
  usd_freight: number | null
  received_date: string | null
  reference: string | null
  created_at?: string
}
