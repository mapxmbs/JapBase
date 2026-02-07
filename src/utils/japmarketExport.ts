import * as XLSX from 'xlsx';
import type { ComparacaoPreco } from '@/services/japmarket/types';

export function exportJapMarketToExcel(registros: ComparacaoPreco[], filename = 'japmarket-comparacao-precos.xlsx') {
  const rows = registros.map((r) => ({
    Produto: r.produto,
    Medida: r.medida,
    Marca: r.marca || '-',
    Modelo: r.modelo || '-',
    Loja: r.loja || '-',
    Estado: r.estado,
    'Nosso Preço': r.nossoPreco,
    'Concorrente A': r.concorrente1.nome,
    'Preço A': r.concorrente1.preco,
    'Concorrente B': r.concorrente2.nome,
    'Preço B': r.concorrente2.preco,
    'Concorrente C': r.concorrente3.nome,
    'Preço C': r.concorrente3.preco,
    Economia: r.economia,
    Variação: `${r.variacao.toFixed(2)}%`,
    'Data Análise': r.dataAnalise,
    Fonte: r.fonte,
    Legenda: r.legendaCor || '-',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Comparação');
  XLSX.writeFile(wb, filename);
}
