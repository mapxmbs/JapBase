'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Table2,
  FileCheck,
  History,
  Palette,
  Check,
  X,
  Search,
  Calculator,
  Database,
  AlertTriangle,
  Store,
  Settings,
} from 'lucide-react';
import JapMarket from './JapMarket';
import JapPricingMotor from './JapPricingMotor';
import type { FormacaoPreco, DivergenciaFaturamento, HistoricoPreco } from '@/services/jappricing/types';
import { CORES_PRICING } from '@/services/jappricing/types';
import {
  exportFormacaoPrecoToExcel,
  exportAuditoriaToExcel,
  exportHistoricoToExcel,
} from '@/utils/jappricingExport';

const STORAGE_KEY = 'jappricing-formacoes';
const STORAGE_KEY_AUDIT = 'jappricing-divergencias';
const STORAGE_KEY_HIST = 'jappricing-historico';
const STORAGE_KEY_WIDTHS = 'jappricing-column-widths';

const ESTADOS = ['AM', 'SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA'];
const CANAIS = ['Varejo', 'Atacado', 'Marketplace'] as const;
const MARCAS = ['Michelin', 'Continental', 'Bridgestone', 'Goodyear', 'Pirelli'];

function generateFormacoes(): FormacaoPreco[] {
  const medidas = ['205/55R16', '185/65R15', '225/50R17', '195/60R15', '215/60R16'];
  const hoje = new Date().toISOString().split('T')[0];
  return medidas.flatMap((medida, mi) =>
    ESTADOS.slice(0, 4).flatMap((estado, ei) =>
      CANAIS.map((canal, ci) => {
        const custoBase = 180 + Math.random() * 120;
        const custoMedio = custoBase * (1 + Math.random() * 0.1);
        const margem = 0.18 + Math.random() * 0.12;
        const precoSugerido = Math.round(custoMedio * (1 + margem) * 100) / 100;
        const precoAtual = Math.round(precoSugerido * (0.95 + Math.random() * 0.1) * 100) / 100;
        const statuses: FormacaoPreco['statusPreco'][] = ['Novo', 'Aprovado', 'Ajustado', 'Exportado'];
        return {
          id: `fp-${mi}-${ei}-${ci}`,
          produto: `Pneu ${medida}`,
          medida,
          marca: MARCAS[mi % MARCAS.length],
          estado,
          canal,
          custoBaseSispro: Math.round(custoBase * 100) / 100,
          custoMedio: Math.round(custoMedio * 100) / 100,
          estoqueAtual: Math.floor(Math.random() * 200) + 20,
          emTransito: Math.floor(Math.random() * 80),
          precoAtual,
          precoSugerido,
          precoAprovado: null,
          statusPreco: statuses[Math.floor(Math.random() * 4)],
          ultimaAtualizacao: hoje,
          responsavel: 'Sistema',
          fonteSispro: true,
        };
      })
    )
  );
}

function generateDivergencias(): DivergenciaFaturamento[] {
  return [
    { id: 'd1', fabricante: 'Michelin', periodo: '2025-01', valorEsperado: 125000, valorFaturado: 118500, diferenca: -6500, tipoDivergencia: 'Desconto não aplicado', status: 'Pendente', dataIdentificacao: '2025-01-22' },
    { id: 'd2', fabricante: 'Continental', periodo: '2025-01', valorEsperado: 89000, valorFaturado: 89000, diferenca: 0, tipoDivergencia: 'Conforme', status: 'Resolvida', dataIdentificacao: '2025-01-20' },
    { id: 'd3', fabricante: 'Bridgestone', periodo: '2024-12', valorEsperado: 156000, valorFaturado: 162300, diferenca: 6300, tipoDivergencia: 'Faturamento a maior', status: 'Aprovada', dataIdentificacao: '2025-01-15' },
  ];
}

function generateHistorico(): HistoricoPreco[] {
  return [
    { id: 'h1', produtoId: 'fp-0-0-0', produto: 'Pneu 205/55R16', medida: '205/55R16', precoAnterior: 420, novoPreco: 435, data: '2025-01-22 10:30', usuario: 'Michell', motivo: 'Ajuste margem' },
    { id: 'h2', produtoId: 'fp-1-0-0', produto: 'Pneu 185/65R15', medida: '185/65R15', precoAnterior: 380, novoPreco: 380, data: '2025-01-21 14:00', usuario: 'Sistema', motivo: 'Sugestão aceita' },
  ];
}

function loadFormacoes(): FormacaoPreco[] {
  if (typeof window === 'undefined') return generateFormacoes();
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return generateFormacoes();
}

function loadDivergencias(): DivergenciaFaturamento[] {
  if (typeof window === 'undefined') return generateDivergencias();
  try {
    const s = localStorage.getItem(STORAGE_KEY_AUDIT);
    if (s) return JSON.parse(s);
  } catch {}
  return generateDivergencias();
}

function loadHistorico(): HistoricoPreco[] {
  if (typeof window === 'undefined') return generateHistorico();
  try {
    const s = localStorage.getItem(STORAGE_KEY_HIST);
    if (s) return JSON.parse(s);
  } catch {}
  return generateHistorico();
}

type JapPricingTab = 'motor' | 'formacao' | 'market' | 'auditoria' | 'parametros' | 'historico';

interface JapPricingProps {
  initialTab?: JapPricingTab;
  onTabChange?: (tab: JapPricingTab) => void;
}

const COL_KEYS = ['cor', 'produto', 'medida', 'marca', 'estado', 'canal', 'custoBase', 'custoMedio', 'estoque', 'transito', 'precoAtual', 'precoSugerido', 'precoAprovado', 'status', 'atualizacao', 'responsavel', 'acoes'] as const;
const DEFAULT_WIDTHS: Record<string, number> = {
  cor: 36, produto: 110, medida: 88, marca: 85, estado: 44, canal: 90, custoBase: 78, custoMedio: 78,
  estoque: 60, transito: 58, precoAtual: 82, precoSugerido: 82, precoAprovado: 82, status: 78,
  atualizacao: 88, responsavel: 90, acoes: 44,
};

export default function JapPricing({ initialTab = 'motor', onTabChange }: JapPricingProps) {
  const [formacoes, setFormacoes] = useState<FormacaoPreco[]>(loadFormacoes);
  const [divergencias, setDivergencias] = useState<DivergenciaFaturamento[]>(loadDivergencias);
  const [historico, setHistorico] = useState<HistoricoPreco[]>(loadHistorico);
  const [activeTab, setActiveTab] = useState<JapPricingTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    if (typeof window === 'undefined') return { ...DEFAULT_WIDTHS };
    try {
      const s = localStorage.getItem(STORAGE_KEY_WIDTHS);
      if (s) return { ...DEFAULT_WIDTHS, ...JSON.parse(s) };
    } catch {}
    return { ...DEFAULT_WIDTHS };
  });
  const [resizingCol, setResizingCol] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [colorPickerLegenda, setColorPickerLegenda] = useState('');
  const [colorPickerError, setColorPickerError] = useState('');
  const colorPickerRef = useRef<HTMLDivElement | null>(null);
  const [showSugestaoModal, setShowSugestaoModal] = useState<string | null>(null);
  const [showJustificativaModal, setShowJustificativaModal] = useState<string | null>(null);
  const [justificativaText, setJustificativaText] = useState('');
  const [showNovaDivergencia, setShowNovaDivergencia] = useState(false);

  // Filtros Formação
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroCanal, setFiltroCanal] = useState('todos');
  const [filtroMarca, setFiltroMarca] = useState('todos');
  const [filtroMedida, setFiltroMedida] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formacoes));
    } catch {}
  }, [formacoes]);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(divergencias));
    } catch {}
  }, [divergencias]);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HIST, JSON.stringify(historico));
    } catch {}
  }, [historico]);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WIDTHS, JSON.stringify(columnWidths));
    } catch {}
  }, [columnWidths]);

  const corLegendaMap = useMemo(() => {
    const map = new Map<string, string>();
    formacoes.forEach((f) => {
      if (f.corLinha && f.legendaCor) map.set(f.corLinha, f.legendaCor);
    });
    return map;
  }, [formacoes]);

  const formacoesFiltradas = useMemo(() => {
    return formacoes.filter((f) => {
      if (filtroEstado !== 'todos' && f.estado !== filtroEstado) return false;
      if (filtroCanal !== 'todos' && f.canal !== filtroCanal) return false;
      if (filtroMarca !== 'todos' && f.marca !== filtroMarca) return false;
      if (filtroMedida !== 'todos' && f.medida !== filtroMedida) return false;
      if (searchTerm) {
        const t = searchTerm.toLowerCase();
        if (!f.produto.toLowerCase().includes(t) && !f.medida.toLowerCase().includes(t) && !f.marca.toLowerCase().includes(t))
          return false;
      }
      return true;
    });
  }, [formacoes, filtroEstado, filtroCanal, filtroMarca, filtroMedida, searchTerm]);

  const opcoesMarca = useMemo(() => [...new Set(formacoes.map((f) => f.marca))].sort(), [formacoes]);
  const opcoesMedida = useMemo(() => [...new Set(formacoes.map((f) => f.medida))].sort(), [formacoes]);

  const legendasUsadas = useMemo(() => {
    const map = new Map<string, { cor: string; count: number }>();
    formacoes.forEach((f) => {
      if (f.corLinha && f.legendaCor) {
        const v = map.get(f.legendaCor);
        map.set(f.legendaCor, { cor: f.corLinha, count: (v?.count ?? 0) + 1 });
      }
    });
    return Array.from(map.entries()).map(([legenda, { cor, count }]) => ({ legenda, cor, count }));
  }, [formacoes]);

  const handleGerarSugestao = useCallback((id: string) => {
    setFormacoes((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const margem = 0.22 + Math.random() * 0.06;
        const sugerido = Math.round(f.custoMedio * (1 + margem) * 100) / 100;
        return { ...f, precoSugerido: sugerido };
      })
    );
    setShowSugestaoModal(id);
  }, []);

  const handleGerarSugestaoTodos = useCallback(() => {
    setFormacoes((prev) =>
      prev.map((f) => {
        const margem = 0.22 + Math.random() * 0.06;
        const sugerido = Math.round(f.custoMedio * (1 + margem) * 100) / 100;
        return { ...f, precoSugerido: sugerido };
      })
    );
  }, []);

  const handleAceitarSugestao = useCallback((id: string) => {
    setFormacoes((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const precoAnt = f.precoAtual;
        const novo = f.precoSugerido;
        setHistorico((h) => [
          ...h,
          { id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`, produtoId: id, produto: f.produto, medida: f.medida, precoAnterior: precoAnt, novoPreco: novo, data: new Date().toISOString().replace('T', ' ').slice(0, 16), usuario: 'Usuário', motivo: 'Sugestão aceita' },
        ]);
        return { ...f, precoAtual: novo, precoAprovado: novo, statusPreco: 'Aprovado' as const, ultimaAtualizacao: new Date().toISOString().split('T')[0], responsavel: 'Usuário' };
      })
    );
    setShowSugestaoModal(null);
  }, []);

  const handleAjustarPreco = useCallback((id: string, valor: number, justificativa?: string) => {
    setFormacoes((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        setHistorico((h) => [
          ...h,
          { id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`, produtoId: id, produto: f.produto, medida: f.medida, precoAnterior: f.precoAtual, novoPreco: valor, data: new Date().toISOString().replace('T', ' ').slice(0, 16), usuario: 'Usuário', motivo: justificativa || 'Ajuste manual' },
        ]);
        return { ...f, precoAtual: valor, precoAprovado: valor, precoSugerido: valor, statusPreco: 'Ajustado' as const, ultimaAtualizacao: new Date().toISOString().split('T')[0], responsavel: 'Usuário', justificativaAjuste: justificativa };
      })
    );
    setShowJustificativaModal(null);
    setJustificativaText('');
  }, []);

  const handleAprovarPrecos = useCallback((ids: string[]) => {
    const dataStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const novosHist: HistoricoPreco[] = [];
    setFormacoes((prev) =>
      prev.map((f) => {
        if (!ids.includes(f.id)) return f;
        const novoPreco = f.precoSugerido;
        novosHist.push({ id: `h-${Date.now()}-${f.id}-${Math.random().toString(36).slice(2, 9)}`, produtoId: f.id, produto: f.produto, medida: f.medida, precoAnterior: f.precoAtual, novoPreco, data: dataStr, usuario: 'Usuário', motivo: 'Aprovação em lote' });
        return { ...f, precoAtual: novoPreco, precoAprovado: novoPreco, statusPreco: 'Aprovado' as const, ultimaAtualizacao: new Date().toISOString().split('T')[0], responsavel: 'Usuário' };
      })
    );
    setHistorico((h) => [...h, ...novosHist]);
  }, []);

  const handleSetColor = useCallback((id: string, cor: string, legenda: string) => {
    const leg = legenda.trim() || 'Sem legenda';
    const existente = corLegendaMap.get(cor);
    if (existente && existente !== leg) {
      setColorPickerError(`Cor já usada para "${existente}". Use outra cor ou aplique a legenda existente.`);
      return;
    }
    setFormacoes((prev) => prev.map((f) => (f.id === id ? { ...f, corLinha: cor, legendaCor: leg } : f)));
    setColorPickerError('');
    setShowColorPicker(null);
  }, [corLegendaMap]);

  const handleClearColor = useCallback((id: string) => {
    setFormacoes((prev) => prev.map((f) => (f.id === id ? { ...f, corLinha: undefined, legendaCor: undefined } : f)));
    setShowColorPicker(null);
  }, []);

  const handleResizeStart = useCallback((colKey: string) => setResizingCol(colKey), []);

  useEffect(() => {
    if (!resizingCol) return;
    const onMove = (e: MouseEvent) => {
      setColumnWidths((prev) => {
        const w = prev[resizingCol] ?? DEFAULT_WIDTHS[resizingCol];
        const next = Math.max(36, Math.min(350, w + e.movementX));
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

  const handleExport = useCallback(() => {
    if (activeTab === 'motor') return; // JapPricingMotor escuta japbase-export
    if (activeTab === 'formacao') exportFormacaoPrecoToExcel(formacoesFiltradas);
    else if (activeTab === 'market') return; // JapMarket escuta japbase-export e exporta
    else if (activeTab === 'auditoria') exportAuditoriaToExcel(divergencias);
    else if (activeTab === 'parametros') return; // Parâmetros: export em evolução
    else exportHistoricoToExcel(historico);
  }, [activeTab, formacoesFiltradas, divergencias, historico]);

  const handleExportarParaOperacao = useCallback(() => {
    const aprovados = formacoes.filter((f) => f.statusPreco === 'Aprovado');
    exportFormacaoPrecoToExcel(aprovados, 'jappricing-precos-aprovados-operacao.xlsx');
    setFormacoes((prev) => prev.map((f) => (f.statusPreco === 'Aprovado' ? { ...f, statusPreco: 'Exportado' as const } : f)));
  }, [formacoes]);

  useEffect(() => {
    const onExport = () => handleExport();
    document.addEventListener('japbase-export', onExport);
    return () => document.removeEventListener('japbase-export', onExport);
  }, [handleExport]);

  const handleAprovarDivergencia = useCallback((id: string) => {
    setDivergencias((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'Aprovada' as const } : d)));
  }, []);

  const handleReprovarDivergencia = useCallback((id: string) => {
    setDivergencias((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'Pendente' as const } : d)));
  }, []);

  const handleMarcarDivergencia = useCallback((fabricante: string, periodo: string, valorEsperado: number, valorFaturado: number, tipo: string) => {
    setDivergencias((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        fabricante,
        periodo,
        valorEsperado,
        valorFaturado,
        diferenca: valorFaturado - valorEsperado,
        tipoDivergencia: tipo,
        status: 'Pendente' as const,
        dataIdentificacao: new Date().toISOString().split('T')[0],
      },
    ]);
    setShowNovaDivergencia(false);
  }, []);

  const tabs: { id: JapPricingTab; label: string; icon: React.ReactNode }[] = [
    { id: 'motor', label: 'Motor', icon: <Calculator size={12} /> },
    { id: 'formacao', label: 'Formação', icon: <Table2 size={12} /> },
    { id: 'market', label: 'Shopping', icon: <Store size={12} /> },
    { id: 'auditoria', label: 'Auditoria', icon: <FileCheck size={12} /> },
    { id: 'parametros', label: 'Parâmetros', icon: <Settings size={12} /> },
    { id: 'historico', label: 'Histórico', icon: <History size={12} /> },
  ];

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-400">
        <div>
          <h1 className="text-lg font-semibold text-japura-black">JapPricing | Motor de Preços</h1>
          <p className="text-[11px] text-japura-grey">Formação • Validação com mercado • Auditoria • Governança</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-400 flex-wrap">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); onTabChange?.(id); }}
            className={`px-2 py-1.5 text-xs font-medium border-b-2 -mb-px flex items-center gap-1 ${
              activeTab === id ? 'text-japura-black border-japura-dark' : 'text-japura-grey border-transparent hover:text-japura-dark'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Aba 1 — Motor de Preços (protótipo executivo) */}
      {activeTab === 'motor' && (
        <div className="mt-0">
          <JapPricingMotor />
        </div>
      )}

      {/* Aba 2 — Shopping de Preços (JapMarket integrado) */}
      {activeTab === 'market' && (
        <div className="mt-0">
          <JapMarket embedded />
        </div>
      )}

      {/* Formação de Preço */}
      {activeTab === 'formacao' && (
        <>
          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-40">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-japura-grey" size={12} />
              <input
                type="text"
                placeholder="Produto, medida, marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 pr-2 py-1 border border-gray-400 rounded text-xs"
              />
            </div>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="px-2 py-1 border border-gray-400 rounded text-xs min-w-[80px]">
              <option value="todos">Estado</option>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <select value={filtroCanal} onChange={(e) => setFiltroCanal(e.target.value)} className="px-2 py-1 border border-gray-400 rounded text-xs min-w-[100px]">
              <option value="todos">Canal</option>
              {CANAIS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)} className="px-2 py-1 border border-gray-400 rounded text-xs min-w-[100px]">
              <option value="todos">Marca</option>
              {opcoesMarca.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select value={filtroMedida} onChange={(e) => setFiltroMedida(e.target.value)} className="px-2 py-1 border border-gray-400 rounded text-xs min-w-[90px]">
              <option value="todos">Medida</option>
              {opcoesMedida.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Legenda */}
          {legendasUsadas.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2 py-1.5 bg-japura-dark/5 rounded border border-gray-300">
              <span className="text-[11px] font-semibold text-japura-dark uppercase">Marcações:</span>
              {legendasUsadas.map(({ legenda, cor, count }) => (
                <span key={legenda} className="flex items-center gap-1.5 text-xs">
                  <span className="w-3.5 h-3.5 rounded-sm border border-gray-400 shrink-0" style={{ backgroundColor: cor }} />
                  <span className="font-medium text-japura-dark">{legenda}</span>
                  <span className="text-japura-grey">({count})</span>
                </span>
              ))}
            </div>
          )}

          {/* Motor de Sugestão */}
          <div className="bg-japura-white rounded border border-gray-300 p-2.5">
            <h3 className="text-xs font-semibold text-japura-dark uppercase mb-2 flex items-center gap-1.5">
              <Calculator size={12} />
              Motor de Sugestão de Preço
            </h3>
            <p className="text-[11px] text-japura-grey mb-2">
              Cálculo: (Custo médio SISPRO) × (1 + margem alvo). Margem considera histórico de vendas, estoque e PIMPs em trânsito. Transparência total — nada de caixa preta.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleGerarSugestaoTodos}
                className="px-2 py-1 bg-japura-dark text-white rounded text-xs font-medium hover:bg-japura-black"
              >
                Gerar sugestão de preço
              </button>
              <button
                onClick={() => handleAprovarPrecos(formacoesFiltradas.filter((f) => f.statusPreco === 'Novo').map((f) => f.id))}
                className="px-2 py-1 border border-gray-400 rounded text-xs font-medium hover:bg-japura-bg text-japura-dark"
              >
                Aprovar preços (Novos)
              </button>
              <button
                onClick={handleExportarParaOperacao}
                className="px-2 py-1 border border-gray-400 rounded text-xs font-medium hover:bg-japura-bg text-japura-dark"
              >
                Exportar para operação
              </button>
            </div>
          </div>

          {/* Grid Formação */}
          <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
            <div className="px-2 py-1.5 border-b border-gray-400 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-japura-black">Formação de Preço</h3>
                <span className="text-[10px] text-japura-grey bg-japura-bg px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Database size={10} /> SISPRO
                </span>
                <button onClick={() => setActiveTab('historico')} className="text-[11px] text-japura-dark hover:text-japura-black flex items-center gap-0.5">
                  <History size={10} /> Ver histórico
                </button>
              </div>
              <span className="text-xs text-japura-grey tabular-nums">{formacoesFiltradas.length} registro(s)</span>
            </div>
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
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
                      ['estado', 'UF', 'text-left'],
                      ['canal', 'Canal', 'text-left'],
                      ['custoBase', 'Custo Base', 'text-right'],
                      ['custoMedio', 'Custo Médio', 'text-right'],
                      ['estoque', 'Estoque', 'text-right'],
                      ['transito', 'Em Trânsito', 'text-right'],
                      ['precoAtual', 'Preço Atual', 'text-right'],
                      ['precoSugerido', 'Sugerido', 'text-right'],
                      ['precoAprovado', 'Aprovado', 'text-right'],
                      ['status', 'Status', 'text-left'],
                      ['atualizacao', 'Atualização', 'text-left'],
                      ['responsavel', 'Responsável', 'text-left'],
                      ['acoes', '', 'text-center'],
                    ].map(([k, label, align]) => (
                      <th key={k} className={`px-2 py-1 ${align} text-xs font-semibold text-japura-grey uppercase relative`}>
                        {label}
                        <div role="separator" onMouseDown={(e) => { e.preventDefault(); handleResizeStart(k); }} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-japura-dark/20" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formacoesFiltradas.map((f, idx) => {
                    const zebra = idx % 2 === 1 ? 'bg-gray-50/50' : '';
                    const baseBg = f.corLinha ? { backgroundColor: `${f.corLinha}18` } : undefined;
                    return (
                      <tr key={f.id} className={`hover:bg-japura-bg/80 ${zebra}`} style={baseBg}>
                        <td className="px-2 py-1">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowColorPicker(showColorPicker === f.id ? null : f.id)}
                              className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                              title="Pintar linha"
                            >
                              <Palette size={12} className="text-japura-dark" />
                            </button>
                            {showColorPicker === f.id && (
                              <div ref={colorPickerRef} className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-400 rounded p-2 shadow-lg min-w-[200px]">
                                <input
                                  type="text"
                                  placeholder="Legenda"
                                  value={colorPickerLegenda}
                                  onChange={(e) => { setColorPickerLegenda(e.target.value); setColorPickerError(''); }}
                                  className="w-full px-2 py-1 border border-gray-400 rounded text-xs mb-2"
                                />
                                {colorPickerError && <p className="text-xs text-red-600 mb-2">{colorPickerError}</p>}
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {CORES_PRICING.map(({ hex, nome }) => {
                                    const leg = corLegendaMap.get(hex);
                                    return (
                                      <button key={hex} type="button" onClick={() => handleSetColor(f.id, hex, leg || colorPickerLegenda || nome)} className="w-5 h-5 rounded border border-gray-400 hover:scale-110" style={{ backgroundColor: hex }} title={leg || nome} />
                                    );
                                  })}
                                </div>
                                <button type="button" onClick={() => handleClearColor(f.id)} className="text-xs text-japura-grey hover:text-japura-dark">Remover</button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-1 text-xs font-semibold text-japura-black">{f.produto}</td>
                        <td className="px-2 py-1 text-xs text-japura-dark">{f.medida}</td>
                        <td className="px-2 py-1 text-xs text-japura-dark">{f.marca}</td>
                        <td className="px-2 py-1 text-xs text-japura-dark">{f.estado}</td>
                        <td className="px-2 py-1 text-xs text-japura-dark">{f.canal}</td>
                        <td className="px-2 py-1 text-xs text-right tabular-nums text-japura-dark">R$ {f.custoBaseSispro.toFixed(2)}</td>
                        <td className="px-2 py-1 text-xs text-right tabular-nums text-japura-dark">R$ {f.custoMedio.toFixed(2)}</td>
                        <td className="px-2 py-1 text-xs text-right tabular-nums">{f.estoqueAtual}</td>
                        <td className="px-2 py-1 text-xs text-right tabular-nums">{f.emTransito}</td>
                        <td className="px-2 py-1 text-xs text-right font-semibold tabular-nums text-japura-black">R$ {f.precoAtual.toFixed(2)}</td>
                        <td className="px-2 py-1 text-xs text-right tabular-nums text-japura-dark">R$ {f.precoSugerido.toFixed(2)}</td>
                        <td className="px-2 py-1 text-xs text-right tabular-nums">{f.precoAprovado != null ? `R$ ${f.precoAprovado.toFixed(2)}` : '-'}</td>
                        <td className="px-2 py-1 text-xs">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${f.statusPreco === 'Aprovado' ? 'bg-green-100 text-green-800' : f.statusPreco === 'Exportado' ? 'bg-gray-100 text-japura-grey' : f.statusPreco === 'Ajustado' ? 'bg-amber-100 text-amber-800' : 'bg-japura-bg text-japura-dark'}`}>
                            {f.statusPreco}
                          </span>
                        </td>
                        <td className="px-2 py-1 text-xs text-japura-grey">{f.ultimaAtualizacao}</td>
                        <td className="px-2 py-1 text-xs text-japura-grey">{f.responsavel}</td>
                        <td className="px-2 py-1 text-center">
                          <div className="flex items-center justify-center gap-0.5">
                            <button onClick={() => handleGerarSugestao(f.id)} className="p-1 text-japura-grey hover:text-japura-dark" title="Gerar sugestão"><Calculator size={12} /></button>
                            <button onClick={() => setShowSugestaoModal(f.id)} className="p-1 text-japura-grey hover:text-green-600" title="Aceitar sugestão"><Check size={12} /></button>
                            <button onClick={() => setShowJustificativaModal(f.id)} className="p-1 text-japura-grey hover:text-amber-600" title="Ajustar preço"><AlertTriangle size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Aceitar Sugestão */}
          {showSugestaoModal && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowSugestaoModal(null)}>
              <div className="bg-japura-white rounded border border-gray-400 p-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-sm font-semibold text-japura-black mb-2">Aceitar sugestão de preço?</h3>
                <p className="text-xs text-japura-grey mb-3">O preço sugerido será aplicado e o status alterado para Aprovado.</p>
                <div className="flex gap-2">
                  <button onClick={() => showSugestaoModal && handleAceitarSugestao(showSugestaoModal)} className="px-3 py-1.5 bg-japura-dark text-white rounded text-sm">Aceitar</button>
                  <button onClick={() => setShowSugestaoModal(null)} className="px-3 py-1.5 border border-gray-400 rounded text-sm">Cancelar</button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Ajustar com Justificativa */}
          {showJustificativaModal && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowJustificativaModal(null)}>
              <div className="bg-japura-white rounded border border-gray-400 p-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-sm font-semibold text-japura-black mb-2">Ajustar preço manualmente</h3>
                <p className="text-xs text-japura-grey mb-2">Informe o novo valor e, opcionalmente, a justificativa.</p>
                <input type="number" step="0.01" placeholder="Novo preço" className="w-full px-2 py-1.5 border border-gray-400 rounded text-sm mb-2" id="novoPrecoInput" />
                <input type="text" placeholder="Justificativa (opcional)" value={justificativaText} onChange={(e) => setJustificativaText(e.target.value)} className="w-full px-2 py-1.5 border border-gray-400 rounded text-sm mb-3" />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const inp = document.getElementById('novoPrecoInput') as HTMLInputElement;
                      const v = parseFloat(inp?.value || '0');
                      if (v > 0 && showJustificativaModal) handleAjustarPreco(showJustificativaModal, v, justificativaText || undefined);
                    }}
                    className="px-3 py-1.5 bg-japura-dark text-white rounded text-sm"
                  >
                    Aplicar
                  </button>
                  <button onClick={() => setShowJustificativaModal(null)} className="px-3 py-1.5 border border-gray-400 rounded text-sm">Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Auditoria de Faturamento */}
      {activeTab === 'auditoria' && (
        <div className="space-y-2">
          <div className="flex justify-end">
            <button
              onClick={() => setShowNovaDivergencia(true)}
              className="px-2 py-1 border border-gray-400 rounded text-xs font-medium hover:bg-japura-bg text-japura-dark"
            >
              Marcar divergência
            </button>
          </div>
        <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
          <div className="px-2 py-1.5 border-b border-gray-400 bg-gray-50">
            <h3 className="text-sm font-semibold text-japura-black">Auditoria de Faturamento</h3>
            <p className="text-[11px] text-japura-grey">Comparação: valor esperado vs faturado</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-200 border-b border-gray-400">
                  <th className="px-2 py-1 text-left font-semibold text-japura-grey">Fabricante</th>
                  <th className="px-2 py-1 text-left font-semibold text-japura-grey">Período</th>
                  <th className="px-2 py-1 text-right font-semibold text-japura-grey">Esperado</th>
                  <th className="px-2 py-1 text-right font-semibold text-japura-grey">Faturado</th>
                  <th className="px-2 py-1 text-right font-semibold text-japura-grey">Diferença</th>
                  <th className="px-2 py-1 text-left font-semibold text-japura-grey">Tipo</th>
                  <th className="px-2 py-1 text-left font-semibold text-japura-grey">Status</th>
                  <th className="px-2 py-1 text-center font-semibold text-japura-grey">Ações</th>
                </tr>
              </thead>
              <tbody>
                {divergencias.map((d, i) => (
                  <tr key={`${d.id}-${i}`} className={`hover:bg-japura-bg/80 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-2 py-1 font-medium text-japura-dark">{d.fabricante}</td>
                    <td className="px-2 py-1 text-japura-grey">{d.periodo}</td>
                    <td className="px-2 py-1 text-right tabular-nums">R$ {d.valorEsperado.toLocaleString('pt-BR')}</td>
                    <td className="px-2 py-1 text-right tabular-nums">R$ {d.valorFaturado.toLocaleString('pt-BR')}</td>
                    <td className={`px-2 py-1 text-right tabular-nums font-semibold ${d.diferenca < 0 ? 'text-red-600' : d.diferenca > 0 ? 'text-green-600' : 'text-japura-grey'}`}>
                      R$ {d.diferenca.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-2 py-1 text-japura-dark">{d.tipoDivergencia}</td>
                    <td className="px-2 py-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${d.status === 'Pendente' ? 'bg-amber-100' : d.status === 'Aprovada' ? 'bg-green-100' : d.status === 'Resolvida' ? 'bg-gray-100' : 'bg-blue-100'}`}>{d.status}</span>
                    </td>
                    <td className="px-2 py-1 text-center">
                      {d.status === 'Pendente' && (
                        <>
                          <button onClick={() => handleAprovarDivergencia(d.id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Aprovar"><Check size={12} /></button>
                          <button onClick={() => handleReprovarDivergencia(d.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Manter pendente"><X size={12} /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

          {/* Modal Nova Divergência */}
          {showNovaDivergencia && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowNovaDivergencia(false)}>
              <div className="bg-japura-white rounded border border-gray-400 p-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-sm font-semibold text-japura-black mb-2">Marcar divergência</h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-japura-grey mb-0.5">Fabricante</label>
                    <input type="text" id="divFabricante" placeholder="Ex: Michelin" className="w-full px-2 py-1 border border-gray-400 rounded" />
                  </div>
                  <div>
                    <label className="block text-japura-grey mb-0.5">Período</label>
                    <input type="text" id="divPeriodo" placeholder="Ex: 2025-01" className="w-full px-2 py-1 border border-gray-400 rounded" />
                  </div>
                  <div>
                    <label className="block text-japura-grey mb-0.5">Valor esperado</label>
                    <input type="number" id="divEsperado" placeholder="0" className="w-full px-2 py-1 border border-gray-400 rounded" />
                  </div>
                  <div>
                    <label className="block text-japura-grey mb-0.5">Valor faturado</label>
                    <input type="number" id="divFaturado" placeholder="0" className="w-full px-2 py-1 border border-gray-400 rounded" />
                  </div>
                  <div>
                    <label className="block text-japura-grey mb-0.5">Tipo</label>
                    <input type="text" id="divTipo" placeholder="Ex: Desconto não aplicado" className="w-full px-2 py-1 border border-gray-400 rounded" />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      const fab = (document.getElementById('divFabricante') as HTMLInputElement)?.value || 'N/A';
                      const per = (document.getElementById('divPeriodo') as HTMLInputElement)?.value || 'N/A';
                      const esp = parseFloat((document.getElementById('divEsperado') as HTMLInputElement)?.value || '0');
                      const fat = parseFloat((document.getElementById('divFaturado') as HTMLInputElement)?.value || '0');
                      const tipo = (document.getElementById('divTipo') as HTMLInputElement)?.value || 'Divergência';
                      handleMarcarDivergencia(fab, per, esp, fat, tipo);
                    }}
                    className="px-3 py-1.5 bg-japura-dark text-white rounded text-sm"
                  >
                    Adicionar
                  </button>
                  <button onClick={() => setShowNovaDivergencia(false)} className="px-3 py-1.5 border border-gray-400 rounded text-sm">Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Aba 4 — Parâmetros & Regras */}
      {activeTab === 'parametros' && (
        <div className="space-y-2">
          <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
            <div className="px-2 py-1.5 border-b border-gray-400 bg-gray-50">
              <h3 className="text-sm font-semibold text-japura-black">Parâmetros & Regras</h3>
              <p className="text-[11px] text-japura-grey">Fatores regionais • Impostos por NCM • Categorias • Regras de cálculo</p>
            </div>
            <div className="p-3 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-2 rounded border border-gray-300">
                  <h4 className="text-xs font-semibold text-japura-dark mb-2">Fatores regionais</h4>
                  <p className="text-[11px] text-japura-grey mb-2">Multiplicador por estado (ex: AM 1,02; SP 1,00)</p>
                  <div className="space-y-1 text-xs">
                    {['AM', 'SP', 'RJ', 'MG'].map((uf, i) => (
                      <div key={uf} className="flex justify-between">
                        <span>{uf}</span>
                        <input type="number" step="0.01" defaultValue={1 + i * 0.01} className="w-16 px-1 py-0.5 border border-gray-300 rounded text-right" />
                      </div>
                    ))}
                  </div>
                  <button className="mt-2 px-2 py-1 bg-japura-dark text-white rounded text-xs">Salvar</button>
                </div>
                <div className="p-2 rounded border border-gray-300">
                  <h4 className="text-xs font-semibold text-japura-dark mb-2">Impostos por NCM</h4>
                  <p className="text-[11px] text-japura-grey mb-2">Alíquotas por categoria fiscal</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span>4011.20.00 (Pneus)</span><input type="number" step="0.01" defaultValue={18} className="w-14 px-1 py-0.5 border rounded text-right" />%</div>
                    <div className="flex justify-between"><span>Outros</span><input type="number" step="0.01" defaultValue={18} className="w-14 px-1 py-0.5 border rounded text-right" />%</div>
                  </div>
                  <button className="mt-2 px-2 py-1 bg-japura-dark text-white rounded text-xs">Salvar</button>
                </div>
              </div>
              <div className="p-2 rounded border border-gray-300">
                <h4 className="text-xs font-semibold text-japura-dark mb-2">Categorias de produto</h4>
                <p className="text-[11px] text-japura-grey mb-2">Margem alvo por categoria</p>
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-gray-300"><th className="text-left py-1">Categoria</th><th className="text-right py-1">Margem %</th></tr></thead>
                  <tbody>
                    {['Premium', 'Standard', 'Econômico'].map((cat, i) => (
                      <tr key={cat} className="border-b border-gray-200">
                        <td className="py-1">{cat}</td>
                        <td className="py-1 text-right"><input type="number" step="0.1" defaultValue={22 + i * 2} className="w-14 px-1 py-0.5 border rounded text-right" />%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="mt-2 px-2 py-1 bg-japura-dark text-white rounded text-xs">Salvar</button>
              </div>
              <p className="text-[10px] text-japura-grey">V1: parâmetros em memória. Persistência em Supabase/Postgres em evolução.</p>
            </div>
          </div>
        </div>
      )}

      {/* Histórico de Preços */}
      {activeTab === 'historico' && (
        <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
          <div className="px-2 py-1.5 border-b border-gray-400 bg-gray-50">
            <h3 className="text-sm font-semibold text-japura-black">Histórico e Versionamento</h3>
            <p className="text-[11px] text-japura-grey">Log técnico de alterações</p>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-200 z-10">
                <tr className="border-b border-gray-400">
                  <th className="px-2 py-1 text-left font-semibold text-japura-grey">Produto</th>
                  <th className="px-2 py-1 text-left font-semibold text-japura-grey">Medida</th>
                  <th className="px-2 py-1 text-right font-semibold text-japura-grey">Anterior</th>
                  <th className="px-2 py-1 text-right font-semibold text-japura-grey">Novo</th>
                  <th className="px-2 py-1 text-left font-semibold text-japura-grey">Data</th>
                  <th className="px-2 py-1 text-left font-semibold text-japura-grey">Usuário</th>
                  <th className="px-2 py-1 text-left font-semibold text-japura-grey">Motivo</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((h, i) => (
                  <tr key={`${h.id}-${i}`} className={`hover:bg-japura-bg/80 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-2 py-1 font-medium text-japura-dark">{h.produto}</td>
                    <td className="px-2 py-1 text-japura-grey">{h.medida}</td>
                    <td className="px-2 py-1 text-right tabular-nums">R$ {h.precoAnterior.toFixed(2)}</td>
                    <td className="px-2 py-1 text-right tabular-nums font-semibold">R$ {h.novoPreco.toFixed(2)}</td>
                    <td className="px-2 py-1 text-japura-grey">{h.data}</td>
                    <td className="px-2 py-1 text-japura-dark">{h.usuario}</td>
                    <td className="px-2 py-1 text-japura-grey">{h.motivo || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
