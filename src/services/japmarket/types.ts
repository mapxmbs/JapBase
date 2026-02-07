/** Registro de comparação de preços - Shopping de Preços JapMarket */
export interface ComparacaoPreco {
  id: string;
  produto: string;
  medida: string;
  marca?: string;
  modelo?: string;
  loja?: string;
  estado: string;
  nossoPreco: number;
  concorrente1: { nome: string; preco: number };
  concorrente2: { nome: string; preco: number };
  concorrente3: { nome: string; preco: number };
  economia: number;
  variacao: number;
  dataAnalise: string;
  /** Fonte: manual (upload por fulano) ou automatico (data) */
  fonte: string;
  /** Quem fez o orçamento / upload (para manual) */
  responsavel?: string;
  /** Tipo de origem dos dados */
  tipoOrigem: 'manual' | 'automatico';
  /** Cor da linha (hex) - para marcação visual */
  corLinha?: string;
  /** Legenda da cor escolhida */
  legendaCor?: string;
}

/** Cores disponíveis para marcação (primárias + arco-íris) */
export const CORES_DISPONIVEIS: { hex: string; nome: string }[] = [
  { hex: '#ef4444', nome: 'Vermelho' },
  { hex: '#f97316', nome: 'Laranja' },
  { hex: '#eab308', nome: 'Amarelo' },
  { hex: '#22c55e', nome: 'Verde' },
  { hex: '#06b6d4', nome: 'Ciano' },
  { hex: '#3b82f6', nome: 'Azul' },
  { hex: '#8b5cf6', nome: 'Violeta' },
  { hex: '#ec4899', nome: 'Rosa' },
  { hex: '#64748b', nome: 'Cinza' },
];
