/**
 * Dados fictícios do Motor de Preços
 * 50+ linhas realistas conforme especificação
 */
import type { MotorPricingRecord } from './motorTypes';
import type { Canal, Categoria, OrigemProduto } from './motorEngine';
import {
  ESTADOS_CIDADES,
  SIGLAS_ESTADO,
  calcularMarkup,
  calcularPrecoFinal,
} from './motorEngine';

const MARCAS = ['Michelin', 'Bridgestone', 'Goodyear', 'Pirelli', 'Continental'];
const MEDIDAS = [
  '205/55R16',
  '185/65R15',
  '225/50R17',
  '195/60R15',
  '215/60R16',
  '235/55R18',
  '265/70R17',
  '11R22.5',
  '600/65R28',
  '18.4-30',
  '400-8',
];
const NCM_BASE = '4011.20.00';

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMotorData(): MotorPricingRecord[] {
  const records: MotorPricingRecord[] = [];
  let id = 1;

  const categoriasPorMedida: Record<string, Categoria> = {
    '205/55R16': 'Passeio',
    '185/65R15': 'Passeio',
    '225/50R17': 'Passeio',
    '195/60R15': 'Passeio',
    '215/60R16': 'SUV',
    '235/55R18': 'SUV',
    '265/70R17': 'Caminhonete',
    '11R22.5': 'Carga',
    '600/65R28': 'Agrícola',
    '18.4-30': 'OTR',
    '400-8': 'Câmara de Ar',
  };

  const origensPara: OrigemProduto[] = ['Nacional', 'Nacionalizado', 'Importado'];

  for (const [estadoNome, cidades] of Object.entries(ESTADOS_CIDADES)) {
    const sigla = SIGLAS_ESTADO[estadoNome] ?? estadoNome.slice(0, 2);
    for (const cidade of cidades) {
      for (const canal of ['Varejo', 'Frota', 'Atacado'] as Canal[]) {
        const medidasSample = MEDIDAS.slice(0, 6);
        for (const medida of medidasSample) {
          const categoria = categoriasPorMedida[medida] ?? 'Passeio';
          const custoManaus = Math.round(randomBetween(200, 900) * 100) / 100;
          const origem: OrigemProduto | undefined =
            estadoNome === 'Pará' ? pick(origensPara) : undefined;
          const { markup, regra } = calcularMarkup(
            estadoNome,
            cidade,
            canal,
            categoria,
            origem
          );
          const precoFinal = calcularPrecoFinal(custoManaus, markup);
          const variacaoConcorrencia = randomBetween(-0.08, 0.08);
          const precoConcorrencia = precoFinal * (1 + variacaoConcorrencia);
          const shoppingAtivo = Math.random() > 0.4;
          const temExcecao = Math.random() > 0.92;

          let statusMercado: 'ok' | 'acima' | 'abaixo' = 'ok';
          if (shoppingAtivo && precoConcorrencia) {
            const diff = (precoFinal - precoConcorrencia) / precoConcorrencia;
            if (diff > 0.03) statusMercado = 'acima';
            else if (diff < -0.03) statusMercado = 'abaixo';
          }

          const marca = pick(MARCAS);
          const codigo = `PRD-${String(id).padStart(4, '0')}`;
          records.push({
            id: `motor-${id}`,
            codigoProduto: codigo,
            descricao: `Pneu ${medida} ${marca}`,
            categoria,
            ncm: NCM_BASE,
            origem,
            estado: sigla,
            cidade,
            canal,
            custoManaus,
            markup,
            precoFinalCalculado: precoFinal,
            quantidadeEstoque: Math.floor(randomBetween(10, 500)),
            shoppingAtivo,
            precoMedioConcorrencia: shoppingAtivo
              ? Math.round(precoConcorrencia * 100) / 100
              : undefined,
            statusMercado,
            temExcecao,
            regraAplicada: regra,
          });
          id++;
        }
      }
    }
  }

  return records;
}
