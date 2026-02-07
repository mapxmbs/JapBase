import { NextRequest } from 'next/server';
import * as XLSX from 'xlsx';

export interface UploadRow {
  produto?: string;
  medida?: string;
  marca?: string;
  modelo?: string;
  loja?: string;
  estado?: string;
  nossoPreco?: number;
  concorrente1Nome?: string;
  concorrente1Preco?: number;
  concorrente2Nome?: string;
  concorrente2Preco?: number;
  concorrente3Nome?: string;
  concorrente3Preco?: number;
}

/** Mapeia nomes de coluna comuns para campos padronizados */
const COL_MAP: Record<string, string> = {
  produto: 'produto',
  pneu: 'produto',
  descricao: 'produto',
  item: 'produto',
  medida: 'medida',
  dimensao: 'medida',
  marca: 'marca',
  fabricante: 'marca',
  modelo: 'modelo',
  loja: 'loja',
  filial: 'loja',
  unidade: 'loja',
  estado: 'estado',
  uf: 'estado',
  'nosso preço': 'nossoPreco',
  'preco nosso': 'nossoPreco',
  preco: 'nossoPreco',
  valor: 'nossoPreco',
  'concorrente 1': 'concorrente1Nome',
  'concorrente a': 'concorrente1Nome',
  conc1: 'concorrente1Nome',
  'preco conc 1': 'concorrente1Preco',
  'concorrente 2': 'concorrente2Nome',
  'concorrente b': 'concorrente2Nome',
  conc2: 'concorrente2Nome',
  'preco conc 2': 'concorrente2Preco',
  'concorrente 3': 'concorrente3Nome',
  'concorrente c': 'concorrente3Nome',
  conc3: 'concorrente3Nome',
  'preco conc 3': 'concorrente3Preco',
  'preço concorrente 1': 'concorrente1Preco',
  'preco concorrente 1': 'concorrente1Preco',
  'preço concorrente 2': 'concorrente2Preco',
  'preco concorrente 2': 'concorrente2Preco',
  'preço concorrente 3': 'concorrente3Preco',
  'preco concorrente 3': 'concorrente3Preco',
  'preço a': 'concorrente1Preco',
  'preco a': 'concorrente1Preco',
  'preço b': 'concorrente2Preco',
  'preco b': 'concorrente2Preco',
  'preço c': 'concorrente3Preco',
  'preco c': 'concorrente3Preco',
};

function normalizeColName(name: string): string {
  return (name || '').toString().toLowerCase().trim().replace(/\s+/g, ' ');
}

function parseNumber(val: unknown): number {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const n = parseFloat(val.replace(/[^\d,.-]/g, '').replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function parseExcelToRows(buffer: ArrayBuffer): UploadRow[] {
  const wb = XLSX.read(buffer, { type: 'array' });
  const firstSheet = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { header: 1, defval: '' });

  if (!data || data.length < 2) return [];

  const headers = (data[0] as unknown[]) as string[];
  const colIndex: Record<string, number> = {};
  headers.forEach((h, i) => {
    const norm = normalizeColName(h);
    const mapped = COL_MAP[norm] ?? COL_MAP[norm.replace(/\s/g, '')];
    const key = mapped ?? norm.replace(/\s/g, '');
    if (key) colIndex[key] = i;
  });

  // Fallback: procurar por padrões numéricos nas colunas
  const rows: UploadRow[] = [];
  for (let r = 1; r < data.length; r++) {
    const row = data[r] as unknown[];
    if (!row || row.length === 0) continue;

    const get = (key: string) => {
      const i = colIndex[key];
      return i !== undefined ? row[i] : undefined;
    };

    const produto = (get('produto') ?? get('pneu') ?? get('descricao') ?? row[0])?.toString()?.trim();
    const medida = (get('medida') ?? get('dimensao') ?? row[1])?.toString()?.trim();
    if (!produto && !medida) continue;

    const nossoPreco = parseNumber(get('nossoPreco') ?? get('preco') ?? get('valor') ?? row[2]);
    const conc1Nome = (get('concorrente1Nome') ?? get('concorrente 1') ?? row[3])?.toString()?.trim() || 'Concorrente A';
    const conc1Preco = parseNumber(get('concorrente1Preco') ?? row[4]);
    const conc2Nome = (get('concorrente2Nome') ?? get('concorrente 2') ?? row[5])?.toString()?.trim() || 'Concorrente B';
    const conc2Preco = parseNumber(get('concorrente2Preco') ?? row[6]);
    const conc3Nome = (get('concorrente3Nome') ?? get('concorrente 3') ?? row[7])?.toString()?.trim() || 'Concorrente C';
    const conc3Preco = parseNumber(get('concorrente3Preco') ?? row[8]);

    const concs = [
      { nome: conc1Nome, preco: conc1Preco },
      { nome: conc2Nome, preco: conc2Preco },
      { nome: conc3Nome, preco: conc3Preco },
    ].filter((c) => c.preco > 0);
    const menor = Math.min(...concs.map((c) => c.preco), nossoPreco + 1);
    const economia = Math.max(0, menor - nossoPreco);
    const mediaConc = concs.length ? concs.reduce((s, c) => s + c.preco, 0) / concs.length : nossoPreco;
    const variacao = mediaConc > 0 ? ((nossoPreco - mediaConc) / mediaConc) * 100 : 0;

    rows.push({
      produto: produto || `Pneu ${medida || 'N/A'}`,
      medida: medida || '-',
      marca: (get('marca') ?? row[9])?.toString()?.trim(),
      modelo: (get('modelo') ?? row[10])?.toString()?.trim(),
      loja: (get('loja') ?? get('filial') ?? row[11])?.toString()?.trim(),
      estado: (get('estado') ?? get('uf') ?? row[12])?.toString()?.trim() || 'AM',
      nossoPreco,
      concorrente1Nome: concs[0]?.nome || 'Concorrente A',
      concorrente1Preco: concs[0]?.preco ?? 0,
      concorrente2Nome: concs[1]?.nome || 'Concorrente B',
      concorrente2Preco: concs[1]?.preco ?? 0,
      concorrente3Nome: concs[2]?.nome || 'Concorrente C',
      concorrente3Preco: concs[2]?.preco ?? 0,
    });
  }
  return rows;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const responsavel = (formData.get('responsavel') as string) || 'Usuário';
    const tipoOrigem = (formData.get('tipoOrigem') as string) || 'manual';

    if (!file) {
      return Response.json({ error: 'Arquivo não enviado' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
      const buffer = await file.arrayBuffer();
      const rows = parseExcelToRows(buffer);

      const dataAnalise = new Date().toISOString().split('T')[0];
      const registros = rows.map((r, i) => ({
        id: `upload-${Date.now()}-${i}`,
        produto: r.produto || 'N/A',
        medida: r.medida || '-',
        marca: r.marca,
        modelo: r.modelo,
        loja: r.loja,
        estado: r.estado || 'AM',
        nossoPreco: r.nossoPreco ?? 0,
        concorrente1: { nome: r.concorrente1Nome || 'Concorrente A', preco: r.concorrente1Preco ?? 0 },
        concorrente2: { nome: r.concorrente2Nome || 'Concorrente B', preco: r.concorrente2Preco ?? 0 },
        concorrente3: { nome: r.concorrente3Nome || 'Concorrente C', preco: r.concorrente3Preco ?? 0 },
        economia: Math.max(0, Math.min(r.concorrente1Preco ?? 0, r.concorrente2Preco ?? 0, r.concorrente3Preco ?? 0) - (r.nossoPreco ?? 0)),
        variacao: 0,
        dataAnalise,
        fonte: tipoOrigem === 'manual' ? `Upload manual por ${responsavel}` : `Inserção automática em ${dataAnalise}`,
        responsavel: tipoOrigem === 'manual' ? responsavel : undefined,
        tipoOrigem: tipoOrigem as 'manual' | 'automatico',
      }));

      // Calcular economia e variação
      registros.forEach((r) => {
        const precos = [r.concorrente1.preco, r.concorrente2.preco, r.concorrente3.preco].filter((p) => p > 0);
        const menor = precos.length ? Math.min(...precos) : r.nossoPreco;
        r.economia = Math.max(0, menor - r.nossoPreco);
        const media = precos.length ? precos.reduce((a, b) => a + b, 0) / precos.length : r.nossoPreco;
        r.variacao = media > 0 ? ((r.nossoPreco - media) / media) * 100 : 0;
      });

      return Response.json({ ok: true, registros, total: registros.length });
    }

    if (ext === 'pdf') {
      // Placeholder: PDF com IA/OCR - em desenvolvimento
      return Response.json({
        ok: false,
        message: 'Upload de PDF em desenvolvimento. Será integrado com IA/OCR para extração automática de preços, pneus, loja e responsável. Use Excel (.xlsx) por enquanto.',
      }, { status: 501 });
    }

    return Response.json({ error: 'Formato não suportado. Use .xlsx, .xls ou .csv' }, { status: 400 });
  } catch (err) {
    console.error('Erro upload JapMarket:', err);
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
