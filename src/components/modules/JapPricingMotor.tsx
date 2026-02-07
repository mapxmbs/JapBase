'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Package,
  MapPin,
  Layers,
  Tag,
  BarChart2,
  AlertCircle,
  Search,
  ChevronDown,
  Check,
  X,
  Bot,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import type { MotorPricingRecord, DetalheProdutoMotor, ConcorrenteMock } from '@/services/jappricing/motorTypes';
import { generateMotorData } from '@/services/jappricing/motorData';
import { precisaOrigem } from '@/services/jappricing/motorEngine';
import { exportMotorPricingToExcel } from '@/utils/jappricingExport';

const STORAGE_KEY = 'jappricing-motor-data';
const STORAGE_WIDTHS = 'jappricing-motor-widths';

function loadData(): MotorPricingRecord[] {
  if (typeof window === 'undefined') return generateMotorData();
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return generateMotorData();
}

const COL_DEFS = [
  { key: 'codigoProduto', label: 'Código', w: 90, align: 'left' as const },
  { key: 'descricao', label: 'Descrição', w: 140, align: 'left' as const },
  { key: 'categoria', label: 'Categoria', w: 95, align: 'left' as const },
  { key: 'ncm', label: 'NCM', w: 95, align: 'left' as const },
  { key: 'origem', label: 'Origem', w: 85, align: 'left' as const },
  { key: 'estado', label: 'Estado', w: 55, align: 'left' as const },
  { key: 'cidade', label: 'Cidade', w: 95, align: 'left' as const },
  { key: 'canal', label: 'Canal', w: 75, align: 'left' as const },
  { key: 'custoManaus', label: 'Custo Manaus', w: 95, align: 'right' as const },
  { key: 'markup', label: 'Markup', w: 70, align: 'right' as const },
  { key: 'precoFinalCalculado', label: 'Preço Final', w: 95, align: 'right' as const },
  { key: 'quantidadeEstoque', label: 'Estoque', w: 70, align: 'right' as const },
  { key: 'shoppingAtivo', label: 'Shopping', w: 70, align: 'center' as const },
  { key: 'precoMedioConcorrencia', label: 'Média Concorrência', w: 105, align: 'right' as const },
  { key: 'statusMercado', label: 'Status', w: 85, align: 'center' as const },
];

export default function JapPricingMotor() {
  const [records, setRecords] = useState<MotorPricingRecord[]>(loadData);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const s = localStorage.getItem(STORAGE_WIDTHS);
      if (s) return JSON.parse(s);
    } catch {}
    return {};
  });
  const [resizingCol, setResizingCol] = useState<string | null>(null);
  const [detalheId, setDetalheId] = useState<string | null>(null);

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroCidade, setFiltroCidade] = useState('todos');
  const [filtroCanal, setFiltroCanal] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroOrigem, setFiltroOrigem] = useState('todos');
  const [filtroShopping, setFiltroShopping] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [filtroExcecao, setFiltroExcecao] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {}
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WIDTHS, JSON.stringify(columnWidths));
    } catch {}
  }, [columnWidths]);

  const opcoesEstado = useMemo(() => {
    const ufs = [...new Set(records.map((r) => r.estado))].sort();
    return ufs;
  }, [records]);

  const opcoesCidade = useMemo(() => {
    if (filtroEstado === 'todos') return [...new Set(records.map((r) => r.cidade))].sort();
    return [...new Set(records.filter((r) => r.estado === filtroEstado).map((r) => r.cidade))].sort();
  }, [records, filtroEstado]);

  const recordsFiltrados = useMemo(() => {
    return records.filter((r) => {
      if (filtroEstado !== 'todos' && r.estado !== filtroEstado) return false;
      if (filtroCidade !== 'todos' && r.cidade !== filtroCidade) return false;
      if (filtroCanal !== 'todos' && r.canal !== filtroCanal) return false;
      if (filtroCategoria !== 'todos' && r.categoria !== filtroCategoria) return false;
      if (filtroOrigem !== 'todos' && r.origem !== filtroOrigem) return false;
      if (filtroShopping === 'ativo' && !r.shoppingAtivo) return false;
      if (filtroShopping === 'inativo' && r.shoppingAtivo) return false;
      if (filtroExcecao && !r.temExcecao) return false;
      if (searchTerm) {
        const t = searchTerm.toLowerCase();
        if (
          !r.codigoProduto.toLowerCase().includes(t) &&
          !r.descricao.toLowerCase().includes(t) &&
          !r.ncm.includes(t)
        )
          return false;
      }
      return true;
    });
  }, [
    records,
    filtroEstado,
    filtroCidade,
    filtroCanal,
    filtroCategoria,
    filtroOrigem,
    filtroShopping,
    filtroExcecao,
    searchTerm,
  ]);

  useEffect(() => {
    const onExport = () => exportMotorPricingToExcel(recordsFiltrados);
    document.addEventListener('japbase-export', onExport);
    return () => document.removeEventListener('japbase-export', onExport);
  }, [recordsFiltrados]);

  // Dashboard KPIs
  const kpis = useMemo(() => {
    const totalProdutos = records.length;
    const estadosCobertos = new Set(records.map((r) => r.estado)).size;
    const canaisAtivos = new Set(records.map((r) => r.canal)).size;
    const categorias = new Set(records.map((r) => r.categoria)).size;
    const comShopping = records.filter((r) => r.shoppingAtivo).length;
    const pctShopping = totalProdutos ? Math.round((comShopping / totalProdutos) * 100) : 0;
    const totalExcecoes = records.filter((r) => r.temExcecao).length;
    return {
      totalProdutos,
      estadosCobertos,
      canaisAtivos,
      categorias,
      pctShopping,
      totalExcecoes,
    };
  }, [records]);

  const detalhe = useMemo((): DetalheProdutoMotor | null => {
    if (!detalheId) return null;
    const r = records.find((x) => x.id === detalheId);
    if (!r) return null;
    const concorrentes: ConcorrenteMock[] = r.shoppingAtivo
      ? [
          { nome: 'Concorrente A', preco: (r.precoMedioConcorrencia ?? r.precoFinalCalculado) * 0.97 },
          { nome: 'Concorrente B', preco: r.precoMedioConcorrencia ?? r.precoFinalCalculado },
          { nome: 'Concorrente C', preco: (r.precoMedioConcorrencia ?? r.precoFinalCalculado) * 1.04 },
        ]
      : [];
    const precoSugeridoIA = r.precoMedioConcorrencia
      ? Math.round((r.precoFinalCalculado + r.precoMedioConcorrencia) / 2 * 100) / 100
      : r.precoFinalCalculado * (0.98 + Math.random() * 0.04);
    return {
      ...r,
      concorrentes,
      precoSugeridoIA: Math.round(precoSugeridoIA * 100) / 100,
    };
  }, [detalheId, records]);

  const handleResizeStart = useCallback((key: string) => setResizingCol(key), []);

  useEffect(() => {
    if (!resizingCol) return;
    const onMove = (e: MouseEvent) => {
      setColumnWidths((prev) => {
        const def = COL_DEFS.find((c) => c.key === resizingCol);
        const w = prev[resizingCol] ?? def?.w ?? 80;
        const next = Math.max(40, Math.min(300, w + e.movementX));
        return { ...prev, [resizingCol]: next };
      });
    };
    const onEnd = () => setResizingCol(null);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [resizingCol]);

  const toggleShopping = useCallback((id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, shoppingAtivo: !r.shoppingAtivo } : r))
    );
  }, []);

  const w = (key: string) => columnWidths[key] ?? COL_DEFS.find((c) => c.key === key)?.w ?? 80;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-400">
        <div>
          <h1 className="text-lg font-semibold text-japura-black">JapPricing | Motor de Preços</h1>
          <p className="text-[11px] text-japura-grey">
            Formação • Validação com mercado • Auditoria • Governança
          </p>
        </div>
      </div>

      {/* Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <div className="bg-japura-white rounded border border-gray-300 p-2.5">
          <div className="flex items-center gap-1.5 text-japura-grey mb-1">
            <Package size={12} />
            <span className="text-[10px] font-semibold uppercase">Total Produtos</span>
          </div>
          <div className="text-lg font-bold text-japura-black tabular-nums">{kpis.totalProdutos}</div>
        </div>
        <div className="bg-japura-white rounded border border-gray-300 p-2.5">
          <div className="flex items-center gap-1.5 text-japura-grey mb-1">
            <MapPin size={12} />
            <span className="text-[10px] font-semibold uppercase">Estados</span>
          </div>
          <div className="text-lg font-bold text-japura-black tabular-nums">{kpis.estadosCobertos}</div>
        </div>
        <div className="bg-japura-white rounded border border-gray-300 p-2.5">
          <div className="flex items-center gap-1.5 text-japura-grey mb-1">
            <Layers size={12} />
            <span className="text-[10px] font-semibold uppercase">Canais</span>
          </div>
          <div className="text-lg font-bold text-japura-black tabular-nums">{kpis.canaisAtivos}</div>
        </div>
        <div className="bg-japura-white rounded border border-gray-300 p-2.5">
          <div className="flex items-center gap-1.5 text-japura-grey mb-1">
            <Tag size={12} />
            <span className="text-[10px] font-semibold uppercase">Categorias</span>
          </div>
          <div className="text-lg font-bold text-japura-black tabular-nums">{kpis.categorias}</div>
        </div>
        <div className="bg-japura-white rounded border border-gray-300 p-2.5">
          <div className="flex items-center gap-1.5 text-japura-grey mb-1">
            <BarChart2 size={12} />
            <span className="text-[10px] font-semibold uppercase">% Shopping Ativo</span>
          </div>
          <div className="text-lg font-bold text-japura-black tabular-nums">{kpis.pctShopping}%</div>
        </div>
        <div className="bg-japura-white rounded border border-gray-300 p-2.5">
          <div className="flex items-center gap-1.5 text-japura-grey mb-1">
            <AlertCircle size={12} />
            <span className="text-[10px] font-semibold uppercase">Exceções</span>
          </div>
          <div className="text-lg font-bold text-japura-black tabular-nums">{kpis.totalExcecoes}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-44">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-japura-grey" size={12} />
          <input
            type="text"
            placeholder="Código, descrição, NCM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 border border-gray-400 rounded text-xs"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => {
            setFiltroEstado(e.target.value);
            setFiltroCidade('todos');
          }}
          className="px-2 py-1.5 border border-gray-400 rounded text-xs min-w-[85px]"
        >
          <option value="todos">Estado</option>
          {opcoesEstado.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <select
          value={filtroCidade}
          onChange={(e) => setFiltroCidade(e.target.value)}
          className="px-2 py-1.5 border border-gray-400 rounded text-xs min-w-[100px]"
        >
          <option value="todos">Cidade</option>
          {opcoesCidade.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filtroCanal}
          onChange={(e) => setFiltroCanal(e.target.value)}
          className="px-2 py-1.5 border border-gray-400 rounded text-xs min-w-[85px]"
        >
          <option value="todos">Canal</option>
          <option value="Varejo">Varejo</option>
          <option value="Frota">Frota</option>
          <option value="Atacado">Atacado</option>
        </select>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="px-2 py-1.5 border border-gray-400 rounded text-xs min-w-[95px]"
        >
          <option value="todos">Categoria</option>
          {['Passeio', 'Caminhonete', 'SUV', 'Carga', 'Agrícola', 'OTR', 'Câmara de Ar'].map(
            (c) => (
              <option key={c} value={c}>
                {c}
              </option>
            )
          )}
        </select>
        {filtroEstado === 'PA' && (
          <select
            value={filtroOrigem}
            onChange={(e) => setFiltroOrigem(e.target.value)}
            className="px-2 py-1.5 border border-gray-400 rounded text-xs min-w-[95px]"
          >
            <option value="todos">Origem</option>
            <option value="Nacional">Nacional</option>
            <option value="Nacionalizado">Nacionalizado</option>
            <option value="Importado">Importado</option>
          </select>
        )}
        <select
          value={filtroShopping}
          onChange={(e) => setFiltroShopping(e.target.value as typeof filtroShopping)}
          className="px-2 py-1.5 border border-gray-400 rounded text-xs min-w-[100px]"
        >
          <option value="todos">Shopping</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={filtroExcecao}
            onChange={(e) => setFiltroExcecao(e.target.checked)}
            className="rounded border-gray-400"
          />
          Apenas exceções
        </label>
      </div>

      {/* Grid */}
      <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
        <div className="px-2 py-1.5 border-b border-gray-400 flex justify-between items-center bg-gray-50">
          <h3 className="text-sm font-semibold text-japura-black">Grid Principal de Pricing</h3>
          <span className="text-xs text-japura-grey tabular-nums">
            {recordsFiltrados.length} registro(s)
          </span>
        </div>
        <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
          <table
            className="w-full table-fixed"
            style={{ minWidth: COL_DEFS.reduce((s, c) => s + w(c.key), 0) }}
          >
            <colgroup>
              {COL_DEFS.map((c) => (
                <col key={c.key} style={{ width: w(c.key) }} />
              ))}
            </colgroup>
            <thead className="bg-gray-200 border-b border-gray-400 sticky top-0 z-10">
              <tr>
                {COL_DEFS.map(({ key, label, align }) => (
                  <th
                    key={key}
                    className={`px-2 py-1 text-xs font-semibold text-japura-grey uppercase relative ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {label}
                    <div
                      role="separator"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleResizeStart(key);
                      }}
                      className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-japura-dark/20"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recordsFiltrados.map((r, idx) => {
                const zebra = idx % 2 === 1 ? 'bg-gray-50/50' : '';
                const excecaoBg = r.temExcecao ? 'bg-amber-50' : '';
                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-japura-bg/80 cursor-pointer ${zebra} ${excecaoBg}`}
                    onClick={() => setDetalheId(r.id)}
                  >
                    <td className="px-2 py-1 text-xs font-medium text-japura-dark">{r.codigoProduto}</td>
                    <td className="px-2 py-1 text-xs text-japura-black">{r.descricao}</td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{r.categoria}</td>
                    <td className="px-2 py-1 text-xs text-japura-grey">{r.ncm}</td>
                    <td className="px-2 py-1 text-xs text-japura-grey">
                      {precisaOrigem(r.estado) ? r.origem ?? '-' : '-'}
                    </td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{r.estado}</td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{r.cidade}</td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{r.canal}</td>
                    <td className="px-2 py-1 text-xs text-right tabular-nums text-japura-dark">
                      R$ {r.custoManaus.toFixed(2)}
                    </td>
                    <td className="px-2 py-1 text-xs text-right tabular-nums font-medium text-japura-dark">
                      {r.markup}
                    </td>
                    <td className="px-2 py-1 text-xs text-right tabular-nums font-bold text-japura-black">
                      R$ {r.precoFinalCalculado.toFixed(2)}
                    </td>
                    <td className="px-2 py-1 text-xs text-right tabular-nums">{r.quantidadeEstoque}</td>
                    <td className="px-2 py-1 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleShopping(r.id);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          r.shoppingAtivo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-japura-grey'
                        }`}
                      >
                        {r.shoppingAtivo ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-2 py-1 text-xs text-right tabular-nums">
                      {r.precoMedioConcorrencia != null
                        ? `R$ ${r.precoMedioConcorrencia.toFixed(2)}`
                        : '-'}
                    </td>
                    <td className="px-2 py-1 text-center">
                      {r.statusMercado === 'ok' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-green-700">
                          <Minus size={10} /> OK
                        </span>
                      )}
                      {r.statusMercado === 'acima' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700">
                          <TrendingUp size={10} /> Acima
                        </span>
                      )}
                      {r.statusMercado === 'abaixo' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-700">
                          <TrendingDown size={10} /> Abaixo
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalhe + IA Mock */}
      {detalhe && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setDetalheId(null)}
        >
          <div
            className="bg-japura-white rounded border border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-gray-400 flex justify-between items-start">
              <div>
                <h2 className="text-base font-semibold text-japura-black">{detalhe.descricao}</h2>
                <p className="text-xs text-japura-grey">
                  {detalhe.codigoProduto} • {detalhe.categoria} • {detalhe.estado}/{detalhe.cidade} •{' '}
                  {detalhe.canal}
                </p>
              </div>
              <button
                onClick={() => setDetalheId(null)}
                className="p-1 text-japura-grey hover:text-japura-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Formação passo a passo */}
              <div className="rounded border border-gray-300 p-3">
                <h3 className="text-xs font-semibold text-japura-dark uppercase mb-2">
                  Formação de preço
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-japura-grey">Custo base CISPRO Manaus</span>
                    <span className="tabular-nums font-medium">R$ {detalhe.custoManaus.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-japura-grey">Fator aplicado (markup)</span>
                    <span className="tabular-nums font-medium">{detalhe.markup}</span>
                  </div>
                  <p className="text-[11px] text-japura-grey italic">{detalhe.regraAplicada}</p>
                  <div className="flex justify-between pt-1 border-t border-gray-200">
                    <span className="font-semibold text-japura-black">Preço final calculado</span>
                    <span className="tabular-nums font-bold text-japura-black">
                      R$ {detalhe.precoFinalCalculado.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shopping de preços */}
              <div className="rounded border border-gray-300 p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-semibold text-japura-dark uppercase">
                    Shopping de preços
                  </h3>
                  <button
                    onClick={() => {
                      toggleShopping(detalhe.id);
                      setDetalheId(null);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      detalhe.shoppingAtivo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-japura-grey'
                    }`}
                  >
                    {detalhe.shoppingAtivo ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
                {detalhe.shoppingAtivo && detalhe.concorrentes.length > 0 ? (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-1 font-semibold text-japura-grey">Concorrente</th>
                        <th className="text-right py-1 font-semibold text-japura-grey">Preço</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-1 font-medium text-japura-black">Nosso preço</td>
                        <td className="py-1 text-right tabular-nums font-bold">
                          R$ {detalhe.precoFinalCalculado.toFixed(2)}
                        </td>
                      </tr>
                      {detalhe.concorrentes.map((c, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-1 text-japura-dark">{c.nome}</td>
                          <td className="py-1 text-right tabular-nums">R$ {c.preco.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-xs text-japura-grey">Ative o shopping para comparar com concorrentes.</p>
                )}
              </div>

              {/* Exceções (mock) */}
              {detalhe.temExcecao && (
                <div className="rounded border border-amber-300 bg-amber-50 p-3">
                  <h3 className="text-xs font-semibold text-amber-800 uppercase mb-1">Exceção registrada</h3>
                  <p className="text-xs text-amber-900">Produto com exceção de preço aprovada pela diretoria.</p>
                </div>
              )}

              {/* Mock IA */}
              <div className="rounded border border-japura-dark/30 bg-gray-50 p-3">
                <h3 className="text-xs font-semibold text-japura-dark uppercase mb-2 flex items-center gap-1.5">
                  <Bot size={12} />
                  Sugestão IA (simulado)
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-japura-grey">Preço atual</span>
                    <span className="tabular-nums">R$ {detalhe.precoFinalCalculado.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-japura-grey">Preço de mercado (média)</span>
                    <span className="tabular-nums">
                      {detalhe.precoMedioConcorrencia != null
                        ? `R$ ${detalhe.precoMedioConcorrencia.toFixed(2)}`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-japura-dark">Preço sugerido pela IA</span>
                    <span className="tabular-nums text-japura-black">
                      R$ {detalhe.precoSugeridoIA?.toFixed(2) ?? '-'}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700">
                      Manter
                    </button>
                    <button className="px-2 py-1 bg-japura-dark text-white rounded text-xs font-medium hover:bg-japura-black">
                      Ajustar
                    </button>
                    <button className="px-2 py-1 border border-gray-400 rounded text-xs font-medium hover:bg-gray-100">
                      Registrar exceção
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
