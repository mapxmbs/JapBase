/** Registro de formação de preço - JapPricing */
export interface FormacaoPreco {
  id: string;
  produto: string;
  medida: string;
  marca: string;
  estado: string;
  canal: 'Varejo' | 'Atacado' | 'Marketplace';
  custoBaseSispro: number;
  custoMedio: number;
  estoqueAtual: number;
  emTransito: number;
  precoAtual: number;
  precoSugerido: number;
  precoAprovado: number | null;
  statusPreco: 'Novo' | 'Aprovado' | 'Ajustado' | 'Exportado';
  ultimaAtualizacao: string;
  responsavel: string;
  /** Fonte SISPRO (mock) */
  fonteSispro?: boolean;
  /** Cor da linha (hex) - marcação estratégica */
  corLinha?: string;
  legendaCor?: string;
  /** Justificativa de ajuste manual */
  justificativaAjuste?: string;
}

/** Divergência de faturamento - Auditoria */
export interface DivergenciaFaturamento {
  id: string;
  fabricante: string;
  periodo: string;
  valorEsperado: number;
  valorFaturado: number;
  diferenca: number;
  tipoDivergencia: string;
  status: 'Pendente' | 'Aprovada' | 'Enviada' | 'Resolvida';
  dataIdentificacao: string;
  observacao?: string;
}

/** Registro de histórico de preço */
export interface HistoricoPreco {
  id: string;
  produtoId: string;
  produto: string;
  medida: string;
  precoAnterior: number;
  novoPreco: number;
  data: string;
  usuario: string;
  motivo?: string;
}

/** Cores disponíveis para marcação */
export const CORES_PRICING: { hex: string; nome: string }[] = [
  { hex: '#ef4444', nome: 'Vermelho' },
  { hex: '#f97316', nome: 'Laranja' },
  { hex: '#eab308', nome: 'Amarelo' },
  { hex: '#22c55e', nome: 'Verde' },
  { hex: '#3b82f6', nome: 'Azul' },
  { hex: '#8b5cf6', nome: 'Violeta' },
  { hex: '#64748b', nome: 'Cinza' },
];
