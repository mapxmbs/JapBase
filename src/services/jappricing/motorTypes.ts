/** Registro de pricing no Motor de Preços — protótipo executivo */
import type { Canal, Categoria, OrigemProduto } from './motorEngine';

export interface MotorPricingRecord {
  id: string;
  codigoProduto: string;
  descricao: string;
  categoria: Categoria;
  ncm: string;
  origem?: OrigemProduto;
  estado: string;
  cidade: string;
  canal: Canal;
  custoManaus: number;
  markup: number;
  precoFinalCalculado: number;
  quantidadeEstoque: number;
  shoppingAtivo: boolean;
  precoMedioConcorrencia?: number;
  statusMercado: 'ok' | 'acima' | 'abaixo';
  temExcecao: boolean;
  regraAplicada: string;
}

export interface ConcorrenteMock {
  nome: string;
  preco: number;
}

export interface DetalheProdutoMotor extends MotorPricingRecord {
  concorrentes: ConcorrenteMock[];
  precoSugeridoIA?: number;
}
