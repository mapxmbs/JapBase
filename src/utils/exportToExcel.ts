import * as XLSX from 'xlsx';

/**
 * Exporta um array de dados para um arquivo Excel (.xlsx)
 * @param data - Array de objetos com os dados a serem exportados
 * @param filename - Nome do arquivo (sem extensão)
 * @param sheetName - Nome da planilha (opcional, padrão: 'Sheet1')
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string = 'Sheet1'
): void {
  // Criar uma nova workbook
  const workbook = XLSX.utils.book_new();

  // Converter o array de objetos para uma planilha
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Adicionar a planilha ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Gerar o arquivo Excel e fazer o download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
