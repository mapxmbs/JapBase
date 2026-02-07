import * as XLSX from 'xlsx';

/** Gera planilha modelo para upload no JapMarket */
export async function GET() {
  const rows = [
    {
      Produto: 'Pneu 205/55R16',
      Medida: '205/55R16',
      Marca: 'Michelin',
      Modelo: 'Pilot',
      Loja: 'Manaus Centro',
      Estado: 'AM',
      'Nosso Preço': 450.0,
      'Concorrente A': 'Auto Pneus',
      'Preço A': 465.0,
      'Concorrente B': 'Mega Pneus',
      'Preço B': 458.0,
      'Concorrente C': 'Pneus Express',
      'Preço C': 472.0,
    },
    {
      Produto: 'Pneu 185/65R15',
      Medida: '185/65R15',
      Marca: 'Continental',
      Modelo: 'Eco',
      Loja: 'Manaus Centro',
      Estado: 'AM',
      'Nosso Preço': 380.0,
      'Concorrente A': 'Auto Pneus',
      'Preço A': 395.0,
      'Concorrente B': 'Mega Pneus',
      'Preço B': 388.0,
      'Concorrente C': 'Pneus Express',
      'Preço C': 400.0,
    },
  ];
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Modelo');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return new Response(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="japmarket-modelo.xlsx"',
    },
  });
}
