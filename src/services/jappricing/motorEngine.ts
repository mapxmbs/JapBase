/**
 * Motor de Preços — Engine de Cálculo
 * Regras de negócio das reuniões 02-03 e 02-04.
 * Custo base: CISPRO Manaus (único para todos os cálculos).
 */

export type Canal = 'Varejo' | 'Frota' | 'Atacado';
export type OrigemProduto = 'Nacional' | 'Nacionalizado' | 'Importado';

export const CANAIS: Canal[] = ['Varejo', 'Frota', 'Atacado'];

export const CATEGORIAS = [
  'Passeio',
  'Caminhonete',
  'SUV',
  'Carga',
  'Agrícola',
  'OTR',
  'Câmara de Ar',
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

/** Estados e cidades obrigatórias */
export const ESTADOS_CIDADES: Record<string, string[]> = {
  Amazonas: ['Manaus'],
  Roraima: ['Boa Vista'],
  Acre: ['Rio Branco'],
  Amapá: ['Macapá'],
  Rondônia: ['Porto Velho', 'Ariquemes', 'Ji-Paraná', 'Vilhena'],
  Pará: ['Belém', 'Santarém', 'Parauapebas'],
};

export const SIGLAS_ESTADO: Record<string, string> = {
  Amazonas: 'AM',
  Roraima: 'RR',
  Acre: 'AC',
  Amapá: 'AP',
  Rondônia: 'RO',
  Pará: 'PA',
};

/** Origem só é diferenciada no Pará */
export function precisaOrigem(estado: string): boolean {
  return estado === 'Pará' || estado === 'PA';
}

/** Retorna o markup aplicável e a regra explicada */
export interface ResultadoMarkup {
  markup: number;
  regra: string;
}

export function calcularMarkup(
  estado: string,
  cidade: string,
  canal: Canal,
  categoria: Categoria,
  origem?: OrigemProduto
): ResultadoMarkup {
  const est = estado === 'PA' ? 'Pará' : estado;
  const cat = categoria as string;

  // Amazonas - Manaus
  if (est === 'Amazonas' && cidade === 'Manaus') {
    const m = canal === 'Varejo' ? 1.5 : canal === 'Frota' ? 1.4 : 1.3;
    return { markup: m, regra: `Amazonas/Manaus: ${canal} = ${m}` };
  }

  // Roraima, Acre, Amapá
  if (['Roraima', 'Acre', 'Amapá'].includes(est)) {
    const m = canal === 'Varejo' ? 1.57 : canal === 'Frota' ? 1.47 : 1.3;
    return { markup: m, regra: `${est} (${cidade}): ${canal} = ${m}` };
  }

  // Rondônia
  if (est === 'Rondônia') {
    const cidadesInterior = ['Ariquemes', 'Ji-Paraná', 'Vilhena'];
    if (cidade === 'Porto Velho') {
      const m = canal === 'Varejo' ? 1.9 : canal === 'Frota' ? 1.65 : 1.53;
      return { markup: m, regra: `Rondônia/Porto Velho: ${canal} = ${m}` };
    }
    if (cidadesInterior.includes(cidade)) {
      const m = canal === 'Varejo' ? 1.92 : canal === 'Frota' ? 1.67 : 1.55;
      return { markup: m, regra: `Rondônia/${cidade}: ${canal} = ${m}` };
    }
  }

  // Pará
  if (est === 'Pará') {
    const orig = origem ?? 'Nacional';
    const cidadesBelem = ['Belém', 'Santarém'];
    const parauapebas = cidade === 'Parauapebas';
    const catPasseio = ['Passeio', 'Caminhonete', 'SUV'].includes(cat);
    const catCarga = ['Carga', 'Agrícola', 'OTR', 'Câmara de Ar'].includes(cat);

    const aplicarMais4 = (base: number) => Math.round(base * 1.04 * 100) / 100;

    if (catPasseio) {
      if (orig === 'Nacional' || orig === 'Nacionalizado') {
        if (cidadesBelem.includes(cidade)) {
          const m = canal === 'Varejo' ? 1.46 : 1.36;
          return { markup: m, regra: `Pará/${cidade} Passeio Nacional: ${canal} = ${m}` };
        }
        if (parauapebas) {
          const m = canal === 'Varejo' ? 1.5 : 1.4;
          return { markup: m, regra: `Pará/Parauapebas Passeio Nacional: ${canal} = ${m}` };
        }
      }
      if (orig === 'Importado') {
        if (cidadesBelem.includes(cidade)) {
          const m = canal === 'Varejo' ? 1.95 : 1.85;
          return { markup: m, regra: `Pará/${cidade} Passeio Importado: ${canal} = ${m}` };
        }
        if (parauapebas) {
          const base = canal === 'Varejo' ? 1.95 : 1.85;
          const m = aplicarMais4(base);
          return { markup: m, regra: `Pará/Parauapebas Passeio Importado: +4% sobre ${base} = ${m}` };
        }
      }
    }

    if (catCarga) {
      if (orig === 'Nacional' || orig === 'Nacionalizado') {
        if (cidadesBelem.includes(cidade)) {
          const m = canal === 'Varejo' ? 1.78 : 1.39;
          return { markup: m, regra: `Pará/${cidade} Carga Nacional: ${canal} = ${m}` };
        }
        if (parauapebas) {
          const base = canal === 'Varejo' ? 1.78 : 1.39;
          const m = aplicarMais4(base);
          return { markup: m, regra: `Pará/Parauapebas Carga Nacional: +4% = ${m}` };
        }
      }
      if (orig === 'Importado') {
        if (cidadesBelem.includes(cidade)) {
          const m = canal === 'Varejo' ? 1.78 : 1.7;
          return { markup: m, regra: `Pará/${cidade} Carga Importado: ${canal} = ${m}` };
        }
        if (parauapebas) {
          const base = canal === 'Varejo' ? 1.78 : 1.7;
          const m = aplicarMais4(base);
          return { markup: m, regra: `Pará/Parauapebas Carga Importado: +4% = ${m}` };
        }
      }
    }
  }

  // Fallback (não deveria ocorrer com dados válidos)
  return { markup: 1.5, regra: 'Regra padrão' };
}

/** Preço final = Custo Manaus × Markup */
export function calcularPrecoFinal(custoManaus: number, markup: number): number {
  return Math.round(custoManaus * markup * 100) / 100;
}
