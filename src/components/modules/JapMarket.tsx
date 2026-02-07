'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Store,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Search,
  Upload,
  MapPin,
  X,
  Trash2,
  Palette,
  BarChart3,
  Table2,
  FileSpreadsheet,
  Bot,
  User,
} from 'lucide-react';
import type { ComparacaoPreco } from '@/services/japmarket/types';
import { CORES_DISPONIVEIS } from '@/services/japmarket/types';
import { exportJapMarketToExcel } from '@/utils/japmarketExport';

const STORAGE_KEY = 'japmarket-comparacoes';
const STORAGE_KEY_WIDTHS = 'japmarket-column-widths';
const ESTADOS = ['AM', 'SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE', 'DF'];
const DIAS_PRECO_ANTIGO = 7;

function isPrecoAntigo(dataAnalise: string): boolean {
  if (!dataAnalise) return true;
  const d = new Date(dataAnalise);
  const hoje = new Date();
  const diff = (hoje.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diff > DIAS_PRECO_ANTIGO;
}

const COL_KEYS = ['cor', 'produto', 'medida', 'marca', 'modelo', 'loja', 'nosso', 'concA', 'concB', 'concC', 'economia', 'estado', 'data', 'origem', 'acoes'] as const;
const DEFAULT_WIDTHS: Record<string, number> = {
  cor: 40, produto: 115, medida: 88, marca: 85, modelo: 85, loja: 105, nosso: 78, concA: 78, concB: 78, concC: 78,
  economia: 78, estado: 44, data: 88, origem: 90, acoes: 48,
};

function loadColumnWidths(): Record<string, number> {
  if (typeof window === 'undefined') return { ...DEFAULT_WIDTHS };
  try {
    const s = localStorage.getItem(STORAGE_KEY_WIDTHS);
    if (s) return { ...DEFAULT_WIDTHS, ...JSON.parse(s) };
  } catch {}
  return { ...DEFAULT_WIDTHS };
}

function generateComparacoes(): ComparacaoPreco[] {
  const produtos = [
    { nome: 'Pneu 205/55R16', medida: '205/55R16', marca: 'Michelin', modelo: 'Pilot' },
    { nome: 'Pneu 185/65R15', medida: '185/65R15', marca: 'Continental', modelo: 'Eco' },
    { nome: 'Pneu 225/50R17', medida: '225/50R17', marca: 'Bridgestone', modelo: 'Turanza' },
    { nome: 'Pneu 195/60R15', medida: '195/60R15', marca: 'Goodyear', modelo: 'Assurance' },
    { nome: 'Pneu 215/60R16', medida: '215/60R16', marca: 'Pirelli', modelo: 'Cinturato' },
  ];
  const lojas = ['Manaus Centro', 'Manaus Cidade Nova', 'São Paulo', 'Rio de Janeiro'];
  const concorrentes = ['Auto Pneus Premium', 'Distribuidora Nacional', 'Pneus Express', 'Mega Pneus'];

  return produtos.flatMap((p, pi) =>
    ESTADOS.slice(0, 5).flatMap((estado, ei) =>
      lojas.slice(0, 2).map((loja, li) => {
        const nossoPreco = Math.random() * 300 + 300;
        const concs = Array.from({ length: 3 }, () => ({
          nome: concorrentes[Math.floor(Math.random() * concorrentes.length)],
          preco: nossoPreco * (1 + (Math.random() * 0.2 - 0.05)),
        }));
        const menor = Math.min(...concs.map((c) => c.preco));
        const media = concs.reduce((s, c) => s + c.preco, 0) / 3;
        return {
          id: `gen-${pi}-${ei}-${li}`,
          produto: p.nome,
          medida: p.medida,
          marca: p.marca,
          modelo: p.modelo,
          loja,
          estado,
          nossoPreco: Math.round(nossoPreco * 100) / 100,
          concorrente1: { nome: concs[0].nome, preco: Math.round(concs[0].preco * 100) / 100 },
          concorrente2: { nome: concs[1].nome, preco: Math.round(concs[1].preco * 100) / 100 },
          concorrente3: { nome: concs[2].nome, preco: Math.round(concs[2].preco * 100) / 100 },
          economia: Math.round(Math.max(0, menor - nossoPreco) * 100) / 100,
          variacao: Math.round(((nossoPreco - media) / media) * 10000) / 100,
          dataAnalise: '2025-01-20',
          fonte: `Inserção automática em 2025-01-20`,
          tipoOrigem: 'automatico' as const,
        };
      })
    )
  );
}

interface JapMarketProps {
  /** Quando true, exibido como aba dentro do JapPricing */
  embedded?: boolean;
}

function loadFromStorage(): ComparacaoPreco[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return generateComparacoes();
}

export default function JapMarket({ embedded }: JapMarketProps = {}) {
  const [comparacoes, setComparacoes] = useState<ComparacaoPreco[]>(loadFromStorage);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(loadColumnWidths);
  const [resizingCol, setResizingCol] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'grid' | 'dashboard'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [colorPickerLegenda, setColorPickerLegenda] = useState('');
  const [colorPickerError, setColorPickerError] = useState('');
  const colorPickerRef = useRef<HTMLDivElement | null>(null);
  const [uploadResponsavel, setUploadResponsavel] = useState('');
  const [uploadTipo, setUploadTipo] = useState<'manual' | 'automatico'>('manual');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  // Filtros
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroLoja, setFiltroLoja] = useState('todos');
  const [filtroMarca, setFiltroMarca] = useState('todos');
  const [filtroModelo, setFiltroModelo] = useState('todos');
  const [filtroMedida, setFiltroMedida] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comparacoes));
    } catch {}
  }, [comparacoes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WIDTHS, JSON.stringify(columnWidths));
    } catch {}
  }, [columnWidths]);

  /** Mapa cor → legenda: uma cor = uma legenda (evita confusão) */
  const corLegendaMap = useMemo(() => {
    const map = new Map<string, string>();
    comparacoes.forEach((c) => {
      if (c.corLinha && c.legendaCor) map.set(c.corLinha, c.legendaCor);
    });
    return map;
  }, [comparacoes]);

  const opcoesLoja = useMemo(() => [...new Set(comparacoes.map((c) => c.loja).filter(Boolean))].sort(), [comparacoes]);
  const opcoesMarca = useMemo(() => [...new Set(comparacoes.map((c) => c.marca).filter(Boolean))].sort(), [comparacoes]);
  const opcoesModelo = useMemo(() => [...new Set(comparacoes.map((c) => c.modelo).filter(Boolean))].sort(), [comparacoes]);
  const opcoesMedida = useMemo(() => [...new Set(comparacoes.map((c) => c.medida))].sort(), [comparacoes]);

  const comparacoesFiltradas = useMemo(() => {
    return comparacoes.filter((c) => {
      if (filtroDataInicio && c.dataAnalise < filtroDataInicio) return false;
      if (filtroDataFim && c.dataAnalise > filtroDataFim) return false;
      if (filtroEstado !== 'todos' && c.estado !== filtroEstado) return false;
      if (filtroLoja !== 'todos' && c.loja !== filtroLoja) return false;
      if (filtroMarca !== 'todos' && c.marca !== filtroMarca) return false;
      if (filtroModelo !== 'todos' && c.modelo !== filtroModelo) return false;
      if (filtroMedida !== 'todos' && c.medida !== filtroMedida) return false;
      if (searchTerm) {
        const t = searchTerm.toLowerCase();
        if (
          !c.produto.toLowerCase().includes(t) &&
          !c.medida.toLowerCase().includes(t) &&
          !(c.marca || '').toLowerCase().includes(t) &&
          !(c.modelo || '').toLowerCase().includes(t) &&
          !(c.loja || '').toLowerCase().includes(t)
        )
          return false;
      }
      return true;
    });
  }, [comparacoes, filtroDataInicio, filtroDataFim, filtroEstado, filtroLoja, filtroMarca, filtroModelo, filtroMedida, searchTerm]);

  const kpis = useMemo(() => {
    const total = comparacoesFiltradas.length;
    const economiaMedia = total ? comparacoesFiltradas.reduce((s, c) => s + c.economia, 0) / total : 0;
    const concorrentes = new Set(comparacoesFiltradas.flatMap((c) => [c.concorrente1.nome, c.concorrente2.nome, c.concorrente3.nome])).size;
    const mediaPrecos = comparacoesFiltradas.map((c) => (c.concorrente1.preco + c.concorrente2.preco + c.concorrente3.preco) / 3);
    const acimaMedia = comparacoesFiltradas.filter((c, i) => c.nossoPreco > mediaPrecos[i]).length;
    const abaixoMedia = comparacoesFiltradas.filter((c, i) => c.nossoPreco < mediaPrecos[i]).length;
    return { economiaMedia, concorrentes, acimaMedia, abaixoMedia, total };
  }, [comparacoesFiltradas]);

  const handleUpload = useCallback(async () => {
    if (!uploadFile) {
      setUploadMessage('Selecione um arquivo');
      setUploadStatus('error');
      return;
    }
    if (uploadTipo === 'manual' && !uploadResponsavel.trim()) {
      setUploadMessage('Informe quem está fazendo o upload');
      setUploadStatus('error');
      return;
    }
    setUploadStatus('loading');
    setUploadMessage('');
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('responsavel', uploadResponsavel.trim() || 'Usuário');
    formData.append('tipoOrigem', uploadTipo);
    try {
      const res = await fetch('/api/japmarket/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) {
        setUploadMessage(json.message || json.error || 'Erro no upload');
        setUploadStatus('error');
        return;
      }
      if (json.ok && json.registros?.length) {
        setComparacoes((prev) => [...json.registros, ...prev]);
        setUploadStatus('ok');
        setUploadMessage(`${json.total} registro(s) importado(s)`);
        setUploadFile(null);
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadStatus('idle');
        }, 1500);
      } else {
        setUploadMessage(json.message || 'Nenhum registro importado');
        setUploadStatus('error');
      }
    } catch (err) {
      setUploadMessage((err as Error).message);
      setUploadStatus('error');
    }
  }, [uploadFile, uploadResponsavel, uploadTipo]);

  const handleDelete = useCallback((id: string) => {
    setComparacoes((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleSetColor = useCallback((id: string, cor: string, legenda: string) => {
    const leg = legenda.trim() || 'Sem legenda';
    const existente = corLegendaMap.get(cor);
    if (existente && existente !== leg) {
      setColorPickerError(`Cor já usada para "${existente}". Use outra cor ou aplique a legenda existente.`);
      return;
    }
    setComparacoes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, corLinha: cor, legendaCor: leg } : c))
    );
    setColorPickerError('');
    setColorPickerLegenda('');
    setShowColorPicker(null);
  }, [corLegendaMap]);

  const handleClearColor = useCallback((id: string) => {
    setComparacoes((prev) => prev.map((c) => (c.id === id ? { ...c, corLinha: undefined, legendaCor: undefined } : c)));
    setColorPickerError('');
    setShowColorPicker(null);
  }, []);

  const handleResizeStart = useCallback((colKey: string) => {
    setResizingCol(colKey);
  }, []);

  useEffect(() => {
    if (!resizingCol) return;
    const onMove = (e: MouseEvent) => {
      setColumnWidths((prev) => {
        const w = prev[resizingCol] ?? DEFAULT_WIDTHS[resizingCol];
        const delta = e.movementX;
        const next = Math.max(40, Math.min(400, w + delta));
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

  const handleExport = useCallback(() => {
    exportJapMarketToExcel(comparacoesFiltradas);
  }, [comparacoesFiltradas]);

  useEffect(() => {
    const onExport = () => handleExport();
    document.addEventListener('japbase-export', onExport);
    return () => document.removeEventListener('japbase-export', onExport);
  }, [handleExport]);

  useEffect(() => {
    if (!showColorPicker) return;
    const close = (e: MouseEvent) => {
      if (colorPickerRef.current?.contains(e.target as Node)) return;
      setShowColorPicker(null);
    };
    const t = setTimeout(() => document.addEventListener('click', close), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('click', close);
    };
  }, [showColorPicker]);

  const legendasUsadas = useMemo(() => {
    const map = new Map<string, { cor: string; count: number }>();
    comparacoes.forEach((c) => {
      if (c.corLinha && c.legendaCor) {
        const k = c.legendaCor;
        const v = map.get(k);
        map.set(k, { cor: c.corLinha, count: (v?.count ?? 0) + 1 });
      }
    });
    return Array.from(map.entries()).map(([legenda, { cor, count }]) => ({ legenda, cor, count }));
  }, [comparacoes]);

  return (
    <div className={embedded ? 'space-y-2' : 'space-y-2'}>
      {/* Header compacto */}
      <div className={`flex justify-between items-center border-gray-400 ${embedded ? 'pb-2 border-b' : 'pb-2 border-b'}`}>
        <div>
          <h2 className={`font-semibold text-japura-black ${embedded ? 'text-base' : 'text-lg'}`}>Shopping de Preços</h2>
          {!embedded && <p className="text-[11px] text-japura-grey">Inteligência de mercado • Decisão tática</p>}
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-3 py-1.5 bg-japura-dark text-white rounded hover:bg-japura-black flex items-center gap-2 text-sm font-medium transition-colors"
          title="Alimentar dados de preços"
        >
          <Upload size={14} />
          <span>Alimentar dados</span>
        </button>
      </div>

      {/* Estado em destaque - CRÍTICO */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-japura-grey uppercase tracking-wide">Estado:</span>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setFiltroEstado('todos')}
            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              filtroEstado === 'todos'
                ? 'bg-japura-dark text-white border-japura-dark'
                : 'bg-japura-white border-gray-400 text-japura-dark hover:bg-japura-bg'
            }`}
          >
            Todos
          </button>
          {ESTADOS.map((uf) => (
            <button
              key={uf}
              onClick={() => setFiltroEstado(uf)}
              className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                filtroEstado === uf
                  ? 'bg-japura-dark text-white border-japura-dark'
                  : 'bg-japura-white border-gray-400 text-japura-dark hover:bg-japura-bg'
              }`}
            >
              {uf}
            </button>
          ))}
        </div>
      </div>

      {/* Abas + Filtros em linha compacta */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex border-b border-gray-400 -mb-px">
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-2 py-1.5 text-xs font-medium border-b-2 -mb-px ${
              activeTab === 'grid' ? 'text-japura-black border-japura-dark' : 'text-japura-grey border-transparent hover:text-japura-dark'
            }`}
          >
            <Table2 size={12} className="inline mr-1" />
            Grid
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2 py-1.5 text-xs font-medium border-b-2 -mb-px ${
              activeTab === 'dashboard' ? 'text-japura-black border-japura-dark' : 'text-japura-grey border-transparent hover:text-japura-dark'
            }`}
          >
            <BarChart3 size={12} className="inline mr-1" />
            Dashboard 360
          </button>
        </div>
        <div className="flex-1 flex flex-wrap items-center gap-1.5">
          <div className="relative w-40">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-japura-grey" size={12} />
            <input
              type="text"
              placeholder="Pneu, marca, loja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-2 py-1 border border-gray-400 rounded text-xs focus:outline-none focus:ring-1 focus:ring-japura-dark"
            />
          </div>
          <input
            type="date"
            value={filtroDataInicio}
            onChange={(e) => setFiltroDataInicio(e.target.value)}
            className="w-32 px-2 py-1 border border-gray-400 rounded text-xs focus:outline-none focus:ring-1 focus:ring-japura-dark"
            title="Data início"
          />
          <input
            type="date"
            value={filtroDataFim}
            onChange={(e) => setFiltroDataFim(e.target.value)}
            className="w-32 px-2 py-1 border border-gray-400 rounded text-xs focus:outline-none focus:ring-1 focus:ring-japura-dark"
            title="Data fim"
          />
          <select
            value={filtroLoja}
            onChange={(e) => setFiltroLoja(e.target.value)}
            className="px-2 py-1 border border-gray-400 rounded text-xs focus:outline-none focus:ring-1 focus:ring-japura-dark min-w-[100px]"
          >
            <option value="todos">Loja</option>
            {opcoesLoja.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <select
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
            className="px-2 py-1 border border-gray-400 rounded text-xs focus:outline-none focus:ring-1 focus:ring-japura-dark min-w-[90px]"
          >
            <option value="todos">Marca</option>
            {opcoesMarca.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={filtroModelo}
            onChange={(e) => setFiltroModelo(e.target.value)}
            className="px-2 py-1 border border-gray-400 rounded text-xs focus:outline-none focus:ring-1 focus:ring-japura-dark min-w-[90px]"
          >
            <option value="todos">Modelo</option>
            {opcoesModelo.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={filtroMedida}
            onChange={(e) => setFiltroMedida(e.target.value)}
            className="px-2 py-1 border border-gray-400 rounded text-xs focus:outline-none focus:ring-1 focus:ring-japura-dark min-w-[90px]"
          >
            <option value="todos">Medida</option>
            {opcoesMedida.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPIs inline compactos */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5">
        <div className="bg-japura-white px-2 py-1.5 rounded border border-gray-300 flex items-center gap-2">
          <TrendingDown size={12} className="text-japura-dark shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-japura-grey uppercase truncate">Economia Média</p>
            <p className="text-sm font-semibold text-japura-black tabular-nums">R$ {kpis.economiaMedia.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-japura-white px-2 py-1.5 rounded border border-gray-300 flex items-center gap-2">
          <Store size={12} className="text-japura-dark shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-japura-grey uppercase truncate">Concorrentes</p>
            <p className="text-sm font-semibold text-japura-black tabular-nums">{kpis.concorrentes}</p>
          </div>
        </div>
        <div className="bg-japura-white px-2 py-1.5 rounded border border-gray-300 flex items-center gap-2">
          <AlertTriangle size={12} className="text-japura-dark shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-japura-grey uppercase truncate">Acima Média</p>
            <p className="text-sm font-semibold text-japura-black tabular-nums">{kpis.acimaMedia}</p>
          </div>
        </div>
        <div className="bg-japura-white px-2 py-1.5 rounded border border-gray-300 flex items-center gap-2">
          <TrendingUp size={12} className="text-japura-dark shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-japura-grey uppercase truncate">Abaixo Média</p>
            <p className="text-sm font-semibold text-japura-black tabular-nums">{kpis.abaixoMedia}</p>
          </div>
        </div>
        <div className="bg-japura-white px-2 py-1.5 rounded border border-gray-300 flex items-center gap-2">
          <MapPin size={12} className="text-japura-dark shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-japura-grey uppercase truncate">Registros</p>
            <p className="text-sm font-semibold text-japura-black tabular-nums">{kpis.total}</p>
          </div>
        </div>
      </div>

      {/* Legenda de cores - sempre visível quando há marcações */}
      {legendasUsadas.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2 py-1.5 bg-japura-dark/5 rounded border border-gray-300">
          <span className="text-[11px] font-semibold text-japura-dark uppercase tracking-wide">Marcações:</span>
          {legendasUsadas.map(({ legenda, cor, count }) => (
            <span key={legenda} className="flex items-center gap-1.5 text-xs">
              <span className="w-3.5 h-3.5 rounded-sm border border-gray-400 shrink-0" style={{ backgroundColor: cor }} />
              <span className="font-medium text-japura-dark">{legenda}</span>
              <span className="text-japura-grey tabular-nums">({count})</span>
            </span>
          ))}
        </div>
      )}

      {/* Conteúdo por aba */}
      {activeTab === 'grid' && (
        <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
          <div className="px-2 py-1.5 border-b border-gray-400 flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-japura-black">Comparação de Preços</h3>
              {filtroEstado !== 'todos' && (
                <span className="px-2 py-0.5 rounded bg-japura-dark text-white text-xs font-semibold">
                  {filtroEstado}
                </span>
              )}
            </div>
            <span className="text-xs text-japura-grey tabular-nums">{comparacoesFiltradas.length} registro(s)</span>
          </div>
          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            {comparacoesFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <Store size={32} className="text-japura-grey mb-2 opacity-60" />
                <p className="text-sm font-medium text-japura-dark">Nenhum registro para o filtro selecionado</p>
                <p className="text-xs text-japura-grey mt-1">Use &quot;Alimentar dados&quot; para importar preços ou ajuste os filtros</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-3 px-3 py-1.5 bg-japura-dark text-white rounded text-sm font-medium hover:bg-japura-black"
                >
                  Alimentar dados
                </button>
              </div>
            ) : (
            <table className="w-full table-fixed" style={{ minWidth: COL_KEYS.reduce((s, k) => s + (columnWidths[k] ?? DEFAULT_WIDTHS[k]), 0) }}>
              <colgroup>
                {COL_KEYS.map((k) => (
                  <col key={k} style={{ width: columnWidths[k] ?? DEFAULT_WIDTHS[k] }} />
                ))}
              </colgroup>
              <thead className="bg-gray-200 border-b border-gray-400 sticky top-0 z-10">
                <tr>
                  {[
                    ['cor', '', 'text-left'],
                    ['produto', 'Produto', 'text-left'],
                    ['medida', 'Medida', 'text-left'],
                    ['marca', 'Marca', 'text-left'],
                    ['modelo', 'Modelo', 'text-left'],
                    ['loja', 'Loja', 'text-left'],
                    ['nosso', 'Nosso', 'text-right'],
                    ['concA', 'Conc. A', 'text-right'],
                    ['concB', 'Conc. B', 'text-right'],
                    ['concC', 'Conc. C', 'text-right'],
                    ['economia', 'Econ.', 'text-right'],
                    ['estado', 'UF', 'text-left'],
                    ['data', 'Data', 'text-left'],
                    ['origem', 'Origem', 'text-left'],
                    ['acoes', '', 'text-center'],
                  ].map(([k, label, alignClass]) => (
                    <th
                      key={k}
                      className={`px-2 py-1 ${alignClass} text-xs font-semibold text-japura-grey uppercase relative select-none`}
                    >
                      {label}
                      <div
                        role="separator"
                        onMouseDown={(e) => { e.preventDefault(); handleResizeStart(k); }}
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-japura-dark/20"
                        title="Arraste para redimensionar"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparacoesFiltradas.map((comp, idx) => {
                  const antigo = isPrecoAntigo(comp.dataAnalise);
                  const zebra = idx % 2 === 1 ? 'bg-gray-50/50' : '';
                  const baseBg = comp.corLinha ? { backgroundColor: `${comp.corLinha}18` } : undefined;
                  return (
                  <tr
                    key={comp.id}
                    className={`hover:bg-japura-bg/80 transition-colors relative ${zebra} ${antigo ? 'opacity-90' : ''}`}
                    style={baseBg}
                  >
                    <td className="px-2 py-1">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setColorPickerError('');
                            setColorPickerLegenda('');
                            setShowColorPicker(showColorPicker === comp.id ? null : comp.id);
                          }}
                          className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                          title="Pintar linha"
                        >
                          <Palette size={14} className="text-japura-dark" />
                        </button>
                        {showColorPicker === comp.id && (
                          <div ref={colorPickerRef} className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-400 rounded p-2 shadow-lg min-w-[220px]">
                            <p className="text-xs font-medium text-japura-grey mb-2">Uma cor = uma legenda. Escolha cor e legenda.</p>
                            <input
                              type="text"
                              placeholder="Nova legenda (para cores não usadas)"
                              value={colorPickerLegenda}
                              onChange={(e) => { setColorPickerLegenda(e.target.value); setColorPickerError(''); }}
                              className="w-full px-2 py-1 border border-gray-400 rounded text-xs mb-2"
                            />
                            {colorPickerError && <p className="text-xs text-red-600 mb-2">{colorPickerError}</p>}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {CORES_DISPONIVEIS.map(({ hex, nome }) => {
                                const legendaExistente = corLegendaMap.get(hex);
                                return (
                                  <button
                                    key={hex}
                                    type="button"
                                    onClick={() => handleSetColor(comp.id, hex, legendaExistente || colorPickerLegenda || nome)}
                                    className="w-6 h-6 rounded border border-gray-400 hover:scale-110 flex-shrink-0"
                                    style={{ backgroundColor: hex }}
                                    title={legendaExistente ? legendaExistente : nome}
                                  />
                                );
                              })}
                            </div>
                            <p className="text-[10px] text-japura-grey mb-1">Uma cor = uma legenda. Cores já usadas aplicam a legenda existente.</p>
                            <button
                              type="button"
                              onClick={() => handleClearColor(comp.id)}
                              className="text-xs text-japura-grey hover:text-japura-dark"
                            >
                              Remover cor
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-xs font-semibold text-japura-black">{comp.produto}</td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{comp.medida}</td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{comp.marca || '-'}</td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{comp.modelo || '-'}</td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{comp.loja || '-'}</td>
                    <td className="px-2 py-1 text-xs text-right font-semibold text-japura-black">R$ {comp.nossoPreco.toFixed(2)}</td>
                    <td className="px-2 py-1 text-xs text-right text-japura-dark">R$ {comp.concorrente1.preco.toFixed(2)}</td>
                    <td className="px-2 py-1 text-xs text-right text-japura-dark">R$ {comp.concorrente2.preco.toFixed(2)}</td>
                    <td className="px-2 py-1 text-xs text-right text-japura-dark">R$ {comp.concorrente3.preco.toFixed(2)}</td>
                    <td className="px-2 py-1 text-xs text-right font-semibold text-japura-dark">R$ {comp.economia.toFixed(2)}</td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{comp.estado}</td>
                    <td className={`px-2 py-1 text-xs tabular-nums ${antigo ? 'text-japura-grey' : 'text-japura-dark'}`} title={antigo ? 'Preço com mais de 7 dias' : ''}>
                      {comp.dataAnalise}
                    </td>
                    <td className="px-2 py-1" title={comp.fonte}>
                      {comp.tipoOrigem === 'manual' ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-japura-bg border border-gray-300 text-[10px] font-medium text-japura-dark">
                          <User size={10} /> Manual
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-100 border border-gray-300 text-[10px] font-medium text-japura-grey">
                          <Bot size={10} /> Auto
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-1 text-center">
                      <button
                        onClick={() => handleDelete(comp.id)}
                        className="p-1 text-japura-grey hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div className="space-y-2 bg-japura-white rounded border border-gray-300 p-2.5">
          <p className="text-[11px] text-japura-grey mb-2">Visão agregada de apoio à decisão</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-2 rounded border border-gray-200 bg-gray-50/50">
              <h4 className="text-[11px] font-semibold text-japura-grey uppercase mb-1.5">Por Estado</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {Array.from(
                  comparacoesFiltradas.reduce((acc, c) => {
                    acc.set(c.estado, (acc.get(c.estado) || 0) + 1);
                    return acc;
                  }, new Map<string, number>())
                )
                  .sort((a, b) => b[1] - a[1])
                  .map(([estado, count]) => (
                    <div key={estado} className="flex justify-between text-xs">
                      <span className="font-medium text-japura-dark">{estado}</span>
                      <span className="text-japura-grey tabular-nums">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="p-2 rounded border border-gray-200 bg-gray-50/50">
              <h4 className="text-[11px] font-semibold text-japura-grey uppercase mb-1.5">Por Loja</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {Array.from(
                  comparacoesFiltradas.reduce((acc, c) => {
                    const l = c.loja || 'Não informada';
                    acc.set(l, (acc.get(l) || 0) + 1);
                    return acc;
                  }, new Map<string, number>())
                )
                  .sort((a, b) => b[1] - a[1])
                  .map(([loja, count]) => (
                    <div key={loja} className="flex justify-between text-xs">
                      <span className="font-medium text-japura-dark truncate max-w-[100px]">{loja}</span>
                      <span className="text-japura-grey tabular-nums">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="p-2 rounded border border-gray-200 bg-gray-50/50">
            <h4 className="text-[11px] font-semibold text-japura-grey uppercase mb-1.5">Top 10 Medidas</h4>
            <div className="space-y-1">
              {Array.from(
                comparacoesFiltradas.reduce((acc, c) => {
                  acc.set(c.medida, (acc.get(c.medida) || 0) + 1);
                  return acc;
                }, new Map<string, number>())
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([medida, count], _, arr) => {
                  const max = arr.length ? Math.max(...arr.map(([, c]) => c)) : 0;
                  const pct = max ? (count / max) * 100 : 0;
                  return (
                    <div key={medida} className="space-y-0.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-japura-dark">{medida}</span>
                        <span className="text-japura-grey tabular-nums">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded h-1">
                        <div className="bg-japura-dark/60 h-1 rounded" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Alimentar Dados */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowUploadModal(false)}>
          <div
            className="bg-japura-white rounded border border-gray-400 w-full max-w-md p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-base font-semibold text-japura-black">Alimentar Inteligência de Mercado</h3>
                <p className="text-[11px] text-japura-grey mt-0.5">Upload de preços por planilha ou cotação manual</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-1.5 hover:bg-gray-100 rounded text-japura-grey hover:text-japura-black">
                <X size={16} />
              </button>
            </div>
            <a
              href="/api/japmarket/template"
              download="japmarket-modelo.xlsx"
              className="inline-flex items-center gap-1.5 px-2 py-1.5 mb-3 text-xs font-medium text-japura-dark bg-japura-bg rounded border border-gray-300 hover:border-gray-400"
            >
              <FileSpreadsheet size={14} />
              Baixar planilha modelo
            </a>
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-japura-grey uppercase mb-1">Arquivo</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv,.pdf"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="text-xs flex-1"
                  />
                  {uploadFile && (
                    <span className="text-xs text-japura-dark truncate max-w-[140px]">{uploadFile.name}</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-japura-grey uppercase mb-1">Origem dos dados</label>
                <select
                  value={uploadTipo}
                  onChange={(e) => setUploadTipo(e.target.value as 'manual' | 'automatico')}
                  className="w-full px-2 py-1.5 border border-gray-400 rounded text-sm focus:outline-none focus:ring-1 focus:ring-japura-dark"
                >
                  <option value="manual">Manual — cotação da ponta (responsável)</option>
                  <option value="automatico">Automático — robô/site</option>
                </select>
              </div>
              {uploadTipo === 'manual' && (
                <div>
                  <label className="block text-[11px] font-medium text-japura-grey uppercase mb-1">Responsável</label>
                  <input
                    type="text"
                    value={uploadResponsavel}
                    onChange={(e) => setUploadResponsavel(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full px-2 py-1.5 border border-gray-400 rounded text-sm focus:outline-none focus:ring-1 focus:ring-japura-dark"
                  />
                </div>
              )}
              {uploadStatus === 'error' && <p className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">{uploadMessage}</p>}
              {uploadStatus === 'ok' && <p className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">{uploadMessage}</p>}
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
              <button
                onClick={handleUpload}
                disabled={uploadStatus === 'loading'}
                className="px-3 py-1.5 bg-japura-dark text-white rounded hover:bg-japura-black text-sm font-medium disabled:opacity-50"
              >
                {uploadStatus === 'loading' ? 'Processando...' : 'Importar'}
              </button>
              <button onClick={() => setShowUploadModal(false)} className="px-3 py-1.5 border border-gray-400 rounded hover:bg-japura-bg text-sm">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sugestões */}
      <div className="bg-japura-white rounded border border-gray-300 p-2.5">
        <h3 className="text-xs font-semibold text-japura-dark uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <AlertTriangle size={12} className="text-japura-grey" />
          Sugestões de Ajuste
        </h3>
        <div className="space-y-1.5">
          {[
            { produto: 'Pneu 225/50R17', sugestao: 'Reduzir 5% para competir', base: 'Diferença média: R$ 12,40 vs concorrentes', impacto: 'Alto' },
            { produto: 'Pneu 195/60R15', sugestao: 'Manter preço atual', base: 'Variação: -2,3% vs média de mercado', impacto: 'Baixo' },
          ].map((item, i) => (
            <div key={i} className="p-2 bg-japura-bg rounded border-l-2 border-japura-dark">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-japura-black">{item.produto}</p>
                  <p className="text-xs text-japura-dark mt-0.5">{item.sugestao}</p>
                  <p className="text-[10px] text-japura-grey mt-0.5">{item.base}</p>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${item.impacto === 'Alto' ? 'bg-japura-dark/10 text-japura-dark border border-gray-300' : 'bg-gray-100 text-japura-grey border border-gray-200'}`}>
                  {item.impacto}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
