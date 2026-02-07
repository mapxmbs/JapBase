import * as XLSX from 'xlsx';
import type { FormacaoPreco, DivergenciaFaturamento, HistoricoPreco } from '@/services/jappricing/types';
import type { MotorPricingRecord } from '@/services/jappricing/motorTypes';

export function exportMotorPricingToExcel(registros: MotorPricingRecord[], filename = 'jappricing-motor-precos.xlsx') {
  const rows = registros.map((r) => ({
    Código: r.codigoProduto,
    Descrição: r.descricao,
    Categoria: r.categoria,
    NCM: r.ncm,
    Origem: r.origem ?? '-',
    Estado: r.estado,
    Cidade: r.cidade,
    Canal: r.canal,
    'Custo Manaus': r.custoManaus,
    Markup: r.markup,
    'Preço Final': r.precoFinalCalculado,
    Estoque: r.quantidadeEstoque,
    'Shopping Ativo': r.shoppingAtivo ? 'Sim' : 'Não',
    'Média Concorrência': r.precoMedioConcorrencia ?? '-',
    Status: r.statusMercado,
    Exceção: r.temExcecao ? 'Sim' : 'Não',
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Motor');
  XLSX.writeFile(wb, filename);
}

export function exportFormacaoPrecoToExcel(registros: FormacaoPreco[], filename = 'jappricing-formacao-precos.xlsx') {
  const rows = registros.map((r) => ({
    Produto: r.produto,
    Medida: r.medida,
    Marca: r.marca,
    Estado: r.estado,
    Canal: r.canal,
    'Custo Base (SISPRO)': r.custoBaseSispro,
    'Custo Médio': r.custoMedio,
    'Estoque Atual': r.estoqueAtual,
    'Em Trânsito': r.emTransito,
    'Preço Atual': r.precoAtual,
    'Preço Sugerido': r.precoSugerido,
    'Preço Aprovado': r.precoAprovado ?? '-',
    'Status': r.statusPreco,
    'Última Atualização': r.ultimaAtualizacao,
    Responsável: r.responsavel,
    Legenda: r.legendaCor || '-',
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Formação');
  XLSX.writeFile(wb, filename);
}

export function exportAuditoriaToExcel(registros: DivergenciaFaturamento[], filename = 'jappricing-auditoria-faturamento.xlsx') {
  const rows = registros.map((r) => ({
    Fabricante: r.fabricante,
    Período: r.periodo,
    'Valor Esperado': r.valorEsperado,
    'Valor Faturado': r.valorFaturado,
    Diferença: r.diferenca,
    'Tipo Divergência': r.tipoDivergencia,
    Status: r.status,
    'Data Identificação': r.dataIdentificacao,
    Observação: r.observacao || '-',
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Auditoria');
  XLSX.writeFile(wb, filename);
}

export function exportHistoricoToExcel(registros: HistoricoPreco[], filename = 'jappricing-historico-precos.xlsx') {
  const rows = registros.map((r) => ({
    Produto: r.produto,
    Medida: r.medida,
    'Preço Anterior': r.precoAnterior,
    'Novo Preço': r.novoPreco,
    Data: r.data,
    Usuário: r.usuario,
    Motivo: r.motivo || '-',
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Histórico');
  XLSX.writeFile(wb, filename);
}
