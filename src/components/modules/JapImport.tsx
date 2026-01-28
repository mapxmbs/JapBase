'use client';

import { useState, useMemo, Fragment, useEffect } from 'react';
import { 
  DollarSign, 
  Search,
  Filter,
  Download,
  RefreshCw,
  Edit2,
  Save,
  X,
  Palette,
  FileText,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Table2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIAssistant from '@/components/ui/AIAssistant';
import { 
  getPimps, 
  getProdutosByPimpId, 
  getAllProdutos,
  getPimpsTransito,
  getPimpsRecebidos,
  testSupabaseConnection,
  updatePimp, 
  getPimpsCountByStatus,
  type Pimp as PimpService,
  type ProdutoPimp as ProdutoPimpService,
  type PimpTransito as PimpTransitoService,
  type PimpRecebido as PimpRecebidoService
} from '@/services/pimpsService';

type MainTab = 'pimps' | 'produtos' | 'transito' | 'recebidos';
type PimpStatus = 'ativo' | 'finalizado' | 'historico';
type ViewMode = 'table' | 'dashboard' | 'chart';

interface ProdutoPimp {
  id: string;
  pimp_id: string; // Adicionado para comunicação entre abas
  descricao: string | null;
  codigoProduto: string | null;
  quantidade: number | null;
  valorUnitarioUsd: number | null;
  valorUnitarioBrl: number | null;
  valorTotalUsd: number | null;
  valorTotalBrl?: number | null;
  pimpNumero?: string; // Para exibição
  // Campos que não existem mais na estrutura real
  medida?: string | null;
  modelo?: string | null;
  marca?: string | null;
  transportadora?: string | null;
  eta?: string | null;
  container?: string | null;
  lote?: string | null;
}

interface Pimp {
  id: string;
  numero: string; // mapeado de pimp_numero
  fornecedor: string; // mapeado de exporter
  produto: string | null; // mapeado de proforma (ou pode ser null)
  quantidade: number; // calculado da soma dos produtos
  valorUsd: number; // mapeado de valor_total_usd
  valorBrl: number; // calculado se necessário
  status: string;
  dataInicio: string | null; // mapeado de order_date
  dataPrevista: string | null; // mapeado de eta
  dataFinalizacao?: string | null; // mapeado de arrival_date
  rowColor?: string | null;
  produtos?: ProdutoPimp[];
  // Campos adicionais da estrutura real
  proforma?: string | null;
  valorFreteUsd?: number | null;
  origem?: string;
}

interface PimpTransito {
  id: string;
  pimpId: string | null;
  carrier: string | null;
  agent: string | null;
  container: string | null;
  invoiceNumero: string | null;
  statusAverbacao: string | null;
  arrivalPortDate: string | null;
  pimpNumero?: string; // Para exibição (número do PIMP)
}

interface PimpRecebido {
  id: string;
  pimp: string;
  exporter: string;
  qtd: number | null;
  cod: string | null;
  description: string | null;
  usdTotal: number | null;
  usdFreight: number | null;
  receivedDate: string | null;
  reference: string | null;
}

interface ColorConfig {
  status: string;
  color: string;
  label: string;
}

export default function JapImport() {
  const [mainTab, setMainTab] = useState<MainTab>('pimps');
  const [activeTab, setActiveTab] = useState<PimpStatus>('ativo');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [dolarHoje] = useState(5.42);
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showColorConfig, setShowColorConfig] = useState(false);
  const [selectedPimp, setSelectedPimp] = useState<Pimp | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [showColumnFilter, setShowColumnFilter] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [exportParams, setExportParams] = useState({
    periodoInicio: '',
    periodoFim: '',
    status: 'todos',
    fornecedor: 'todos',
    incluirProdutos: true,
  });

  // Estados para dados do Supabase
  const [pimpsAtivos, setPimpsAtivos] = useState<Pimp[]>([]);
  const [pimpsFinalizados, setPimpsFinalizados] = useState<Pimp[]>([]);
  const [allProdutos, setAllProdutos] = useState<ProdutoPimp[]>([]);
  const [allTransito, setAllTransito] = useState<PimpTransito[]>([]);
  const [allRecebidos, setAllRecebidos] = useState<PimpRecebido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pimpsCounts, setPimpsCounts] = useState({ ativos: 0, finalizados: 0, total: 0 });
  const [selectedPimpId, setSelectedPimpId] = useState<string | null>(null); // Para comunicação entre abas

  const [colorConfigs, setColorConfigs] = useState<ColorConfig[]>([
    { status: 'Em Trânsito', color: '#E3F2FD', label: 'Azul' },
    { status: 'Aguardando Embarque', color: '#FFF9E6', label: 'Amarelo' },
    { status: 'Concluído', color: '#E8F5E9', label: 'Verde' },
    { status: 'Venda Futura Prevista', color: '#F1F8E9', label: 'Verde Claro' },
    { status: 'Em Porto', color: '#F3E5F5', label: 'Roxo' },
    { status: 'Liberado', color: '#FCE4EC', label: 'Rosa' },
  ]);

  // Teste de conexão com banco
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [dbStatusMessage, setDbStatusMessage] = useState<string | null>(null);
  const [dbStatusOk, setDbStatusOk] = useState<boolean | null>(null);

  // Converter dados do Supabase para formato do componente
  const convertPimpFromSupabase = (pimp: PimpService, produtos?: ProdutoPimpService[]): Pimp => {
    // Calcular quantidade total dos produtos se disponível
    const quantidadeTotal = produtos?.reduce((sum, p) => sum + (p.quantidade || 0), 0) || 0
    
    // Calcular valor BRL se necessário (usando dólar do dia)
    const valorBrl = pimp.valor_total_usd ? pimp.valor_total_usd * dolarHoje : 0
    
    return {
      id: pimp.id,
      numero: pimp.pimp_numero,
      fornecedor: pimp.exporter,
      produto: pimp.proforma || null,
      quantidade: quantidadeTotal,
      valorUsd: pimp.valor_total_usd || 0,
      valorBrl: valorBrl,
      status: pimp.status,
      dataInicio: pimp.order_date || null,
      dataPrevista: pimp.eta || null,
      dataFinalizacao: pimp.arrival_date || null,
      rowColor: colorConfigs.find(c => c.status === pimp.status)?.color || '#FFFFFF',
      proforma: pimp.proforma,
      valorFreteUsd: pimp.valor_frete_usd,
      origem: pimp.origem,
    }
  }

  const convertProdutoFromSupabase = (produto: ProdutoPimpService): ProdutoPimp => {
    // Calcular valor total BRL se necessário
    const valorTotalBrl = produto.valor_unitario_brl && produto.quantidade 
      ? produto.valor_unitario_brl * produto.quantidade 
      : (produto.valor_unitario_usd && produto.quantidade ? produto.valor_unitario_usd * produto.quantidade * dolarHoje : null)
    
    return {
      id: produto.id,
      pimp_id: produto.pimp_id,
      descricao: produto.descricao,
      codigoProduto: produto.codigo_produto,
      quantidade: produto.quantidade,
      valorUnitarioUsd: produto.valor_unitario_usd,
      valorUnitarioBrl: produto.valor_unitario_brl,
      valorTotalUsd: produto.valor_total_usd,
      valorTotalBrl: valorTotalBrl,
    }
  }

  const convertTransitoFromSupabase = (transito: PimpTransitoService, pimpNumero?: string): PimpTransito => {
    return {
      id: transito.id,
      pimpId: transito.pimp_id,
      carrier: transito.carrier,
      agent: transito.agent,
      container: transito.container,
      invoiceNumero: transito.invoice_numero,
      statusAverbacao: transito.status_averbacao,
      arrivalPortDate: transito.arrival_port_date,
      // Preferimos o número de PIMP vindo do serviço (quando existir),
      // senão usamos o número opcional passado pelo caller.
      pimpNumero: (transito as any).pimp_numero ?? pimpNumero,
    }
  }

  const convertRecebidoFromSupabase = (r: PimpRecebidoService): PimpRecebido => {
    return {
      id: r.id,
      pimp: r.pimp,
      exporter: r.exporter,
      qtd: r.qtd,
      cod: r.cod,
      description: r.description,
      usdTotal: r.usd_total,
      usdFreight: r.usd_freight,
      receivedDate: r.received_date,
      reference: r.reference,
    }
  }

  // Carregar dados do Supabase
  const loadPimps = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Carregando PIMPs do Supabase...')
      
      // Buscar contagens
      const counts = await getPimpsCountByStatus()
      setPimpsCounts(counts)

      // Buscar PIMPs ativos
      const ativos = await getPimps({ 
        status: undefined,
        search: searchTerm || undefined 
      })
      console.log('PIMPs ativos encontrados:', ativos.length)
      
      const ativosFiltrados = ativos.filter(p => p.status !== 'Concluído')
      
      // Carregar produtos para cada PIMP ativo
      const ativosComProdutos = await Promise.all(
        ativosFiltrados.map(async (pimp) => {
          const produtos = await getProdutosByPimpId(pimp.id)
          return convertPimpFromSupabase(pimp, produtos)
        })
      )
      setPimpsAtivos(ativosComProdutos)

      // Buscar PIMPs finalizados
      const finalizados = await getPimps({ 
        status: 'Concluído',
        search: searchTerm || undefined 
      })
      console.log('PIMPs finalizados encontrados:', finalizados.length)
      
      // Carregar produtos para cada PIMP finalizado
      const finalizadosComProdutos = await Promise.all(
        finalizados.map(async (pimp) => {
          const produtos = await getProdutosByPimpId(pimp.id)
          return convertPimpFromSupabase(pimp, produtos)
        })
      )
      setPimpsFinalizados(finalizadosComProdutos)

    } catch (err: any) {
      console.error('Erro ao carregar PIMPs:', err)
      setError(`Erro ao carregar dados: ${err.message || 'Verifique a conexão com o Supabase'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar todos os produtos
  const loadProdutos = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Carregando produtos do Supabase...')
      const produtos = await getAllProdutos({ 
        pimp_id: selectedPimpId || undefined,
        search: searchTerm || undefined 
      })
      console.log('Produtos encontrados:', produtos.length)
      
      const produtosConvertidos = produtos.map(convertProdutoFromSupabase)
      
      // Buscar números dos PIMPs para exibição
      const pimpsMap = new Map([...pimpsAtivos, ...pimpsFinalizados].map(p => [p.id, p.numero]))
      const produtosComPimpNumero = produtosConvertidos.map(p => ({
        ...p,
        pimpNumero: pimpsMap.get(p.pimp_id) || 'N/A'
      }))
      
      setAllProdutos(produtosComPimpNumero)
    } catch (err: any) {
      console.error('Erro ao carregar produtos:', err)
      setError(`Erro ao carregar produtos: ${err.message || 'Verifique a conexão com o Supabase'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar todos os registros de trânsito
  const loadTransito = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Carregando trânsito do Supabase...')
      const transito = await getPimpsTransito({ 
        pimp_id: selectedPimpId || undefined,
        search: searchTerm || undefined 
      })
      console.log('Registros de trânsito encontrados:', transito.length)
      
      // Não dependemos mais do id do PIMP para descobrir o número;
      // o próprio serviço já traz (quando possível) o número do PIMP.
      const transitoConvertido = transito.map(t => convertTransitoFromSupabase(t))
      setAllTransito(transitoConvertido)
    } catch (err: any) {
      console.error('Erro ao carregar trânsito:', err)
      setError(`Erro ao carregar trânsito: ${err.message || 'Verifique a conexão com o Supabase'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar todos os registros de recebidos (consolidado)
  const loadRecebidos = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Carregando recebidos do Supabase...')
      const recebidos = await getPimpsRecebidos({ 
        pimp_id: selectedPimpId || undefined,
        search: searchTerm || undefined 
      })
      console.log('Registros de recebidos encontrados:', recebidos.length)
      
      const recebidosConvertidos = recebidos.map(convertRecebidoFromSupabase)
      setAllRecebidos(recebidosConvertidos)
    } catch (err: any) {
      console.error('Erro ao carregar recebidos:', err)
      setError(`Erro ao carregar recebidos: ${err.message || 'Verifique a conexão com o Supabase'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar produtos de um PIMP quando expandido
  const loadProdutosForPimp = async (pimpId: string) => {
    try {
      const produtos = await getProdutosByPimpId(pimpId)
      const produtosConvertidos = produtos.map(convertProdutoFromSupabase)
      
      // Atualizar o PIMP com os produtos
      setPimpsAtivos(prev => prev.map(p => 
        p.id === pimpId ? { ...p, produtos: produtosConvertidos } : p
      ))
      setPimpsFinalizados(prev => prev.map(p => 
        p.id === pimpId ? { ...p, produtos: produtosConvertidos } : p
      ))
    } catch (err) {
      console.error('Erro ao carregar produtos do PIMP:', err)
    }
  }

  // Carregar dados ao montar componente e quando mudar aba/busca
  useEffect(() => {
    if (mainTab === 'pimps') {
      loadPimps()
    } else if (mainTab === 'produtos') {
      loadProdutos()
    } else if (mainTab === 'transito') {
      loadTransito()
    } else if (mainTab === 'recebidos') {
      loadRecebidos()
    }
  }, [mainTab, searchTerm, selectedPimpId])

  // Quando selecionar um PIMP, filtrar produtos e trânsito relacionados
  useEffect(() => {
    if (selectedPimpId && (mainTab === 'produtos' || mainTab === 'transito' || mainTab === 'recebidos')) {
      if (mainTab === 'produtos') {
        loadProdutos()
      } else if (mainTab === 'transito') {
        loadTransito()
      } else if (mainTab === 'recebidos') {
        loadRecebidos()
      }
    }
  }, [selectedPimpId])

  const tabs = [
    { id: 'ativo' as PimpStatus, label: 'Ativos', count: pimpsCounts.ativos },
    { id: 'finalizado' as PimpStatus, label: 'Finalizados', count: pimpsCounts.finalizados },
    { id: 'historico' as PimpStatus, label: 'Histórico', count: pimpsCounts.total },
  ];

  const allPimps = activeTab === 'ativo' ? pimpsAtivos : activeTab === 'finalizado' ? pimpsFinalizados : [...pimpsAtivos, ...pimpsFinalizados];

  // Filtros e busca
  const filteredPimps = useMemo(() => {
    return allPimps.filter(pimp => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (
          !pimp.numero?.toLowerCase().includes(searchLower) &&
          !pimp.fornecedor?.toLowerCase().includes(searchLower) &&
          !(pimp.produto?.toLowerCase().includes(searchLower)) &&
          !pimp.status?.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      if (columnFilters.fornecedor && pimp.fornecedor !== columnFilters.fornecedor) return false;
      if (columnFilters.status && pimp.status !== columnFilters.status) return false;
      if (columnFilters.produto && pimp.produto && !pimp.produto.toLowerCase().includes(columnFilters.produto.toLowerCase())) return false;

      return true;
    });
  }, [allPimps, searchTerm, columnFilters]);

  const getRowColor = (pimp: Pimp) => {
    return pimp.rowColor || '#FFFFFF';
  };

  const handleColorSelect = async (pimpId: string, color: string) => {
    // Nota: row_color não existe na estrutura atual, mas podemos adicionar depois se necessário
    // Por enquanto, apenas atualizamos o estado local
    if (activeTab === 'ativo') {
      setPimpsAtivos(prev => prev.map(p => p.id === pimpId ? { ...p, rowColor: color } : p))
    } else if (activeTab === 'finalizado') {
      setPimpsFinalizados(prev => prev.map(p => p.id === pimpId ? { ...p, rowColor: color } : p))
    }
  };

  const toggleRowExpansion = (pimpId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pimpId)) {
        newSet.delete(pimpId);
      } else {
        newSet.add(pimpId);
        // Carregar produtos se ainda não foram carregados
        const pimp = [...pimpsAtivos, ...pimpsFinalizados].find(p => p.id === pimpId)
        if (pimp && !pimp.produtos) {
          loadProdutosForPimp(pimpId)
        }
      }
      return newSet;
    });
  };

  const handleCellEdit = (rowId: string, field: string, currentValue: any) => {
    if (field === 'status') return;
    setEditingCell({ rowId, field });
    setEditValue(String(currentValue));
  };

  const handleCancelEdit = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const handleSaveEdit = async () => {
    if (!editingCell) return;

    try {
      const pimpToUpdate = [...pimpsAtivos, ...pimpsFinalizados].find(p => p.id === editingCell.rowId)
      if (!pimpToUpdate) return

      const updates: any = {}
      
      if (editingCell.field === 'valorUsd') {
        updates.valor_total_usd = parseFloat(editValue) || 0
      } else if (editingCell.field === 'fornecedor') {
        updates.exporter = editValue
      } else if (editingCell.field === 'produto') {
        updates.proforma = editValue
      } else if (editingCell.field === 'dataInicio') {
        updates.order_date = editValue
      } else if (editingCell.field === 'dataPrevista') {
        updates.eta = editValue
      } else if (editingCell.field === 'numero') {
        updates.pimp_numero = editValue
      }

      const updatedPimp = await updatePimp(editingCell.rowId, updates)
      
      if (updatedPimp) {
        const convertedPimp = convertPimpFromSupabase(updatedPimp)
        
        // Atualizar estado local
        if (activeTab === 'ativo') {
          setPimpsAtivos(prev => prev.map(p => p.id === editingCell.rowId ? convertedPimp : p))
        } else if (activeTab === 'finalizado') {
          setPimpsFinalizados(prev => prev.map(p => p.id === editingCell.rowId ? convertedPimp : p))
        }
      }

      setEditingCell(null)
      setEditValue('')
    } catch (err) {
      console.error('Erro ao salvar alteração:', err)
      alert('Erro ao salvar alteração. Tente novamente.')
    }
  };

  const handleRefresh = () => {
    if (mainTab === 'pimps') {
      loadPimps()
    } else if (mainTab === 'produtos') {
      loadProdutos()
    } else if (mainTab === 'transito') {
      loadTransito()
    } else if (mainTab === 'recebidos') {
      loadRecebidos()
    }
  }

  const handleSelectPimp = (pimpId: string) => {
    setSelectedPimpId(pimpId)
    // Se não estiver na aba de PIMPs, mudar para mostrar produtos/trânsito relacionados
    if (mainTab === 'produtos' || mainTab === 'transito') {
      // Recarregar dados filtrados
      if (mainTab === 'produtos') {
        loadProdutos()
      } else {
        loadTransito()
      }
    }
  }

  const handleClearPimpSelection = () => {
    setSelectedPimpId(null)
    if (mainTab === 'produtos') {
      loadProdutos()
    } else if (mainTab === 'transito') {
      loadTransito()
    } else if (mainTab === 'recebidos') {
      loadRecebidos()
    }
  }

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    setDbStatusMessage(null)
    setDbStatusOk(null)

    try {
      const result = await testSupabaseConnection()
      setDbStatusOk(result.ok)
      setDbStatusMessage(result.message)
    } catch (err: any) {
      setDbStatusOk(false)
      setDbStatusMessage(err?.message || 'Erro inesperado ao testar conexão.')
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleExport = () => {
    alert(`Exportando relatório Excel:\n\nPeríodo: ${exportParams.periodoInicio || 'Todos'} até ${exportParams.periodoFim || 'Todos'}\nStatus: ${exportParams.status}\nFornecedor: ${exportParams.fornecedor}\nIncluir Produtos: ${exportParams.incluirProdutos ? 'Sim' : 'Não'}\nTotal: ${filteredPimps.length} registros`);
    setShowExportModal(false);
  };

  const uniqueValues = (field: string) => {
    return Array.from(new Set(allPimps.map(p => (p as any)[field]))).filter(Boolean);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Compacto */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-300 mb-2">
        <div>
          <h1 className="text-2xl font-black text-japura-black">JapImport</h1>
        </div>
        <div className="flex items-center gap-4">
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded border border-red-200">
              <AlertCircle size={14} />
              <span>{error}</span>
              <button 
                onClick={() => handleRefresh()}
                className="text-red-700 hover:text-red-900 font-semibold"
              >
                Tentar novamente
              </button>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-japura-grey">
              <RefreshCw size={14} className="animate-spin" />
              <span>Carregando...</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs">
            <DollarSign size={14} className="text-green-600" />
            <span className="text-japura-grey">USD:</span>
            <span className="font-semibold text-japura-black">R$ {dolarHoje.toFixed(2)}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 flex items-center gap-1"
            title="Atualizar dados"
          >
            <RefreshCw size={12} />
            <span>Atualizar</span>
          </button>
          <button
            onClick={handleTestConnection}
            className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 flex items-center gap-1 disabled:opacity-60"
            title="Testar conexão com banco de dados"
            disabled={isTestingConnection}
          >
            <FileText size={12} />
            <span>{isTestingConnection ? 'Testando...' : 'Testar banco'}</span>
          </button>
        </div>
      </div>

      {dbStatusMessage && (
        <div
          className={`mb-2 px-3 py-1.5 rounded text-xs flex items-center gap-2 ${
            dbStatusOk === false
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          <AlertCircle size={14} />
          <span>{dbStatusMessage}</span>
        </div>
      )}

      {/* Abas Principais: PIMPs, Gripmaster, Trânsito, Recebidos */}
      <div className="flex gap-1 border-b border-gray-300 mb-2">
        <button
          onClick={() => {
            setMainTab('pimps')
            setSelectedPimpId(null)
          }}
          className={`
            px-4 py-2 text-sm font-semibold transition-colors relative
            ${mainTab === 'pimps'
              ? 'text-japura-black border-b-2 border-japura-black'
              : 'text-japura-grey hover:text-japura-black'}
          `}
        >
          PIMPs
          <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 rounded text-xs">
            {pimpsCounts.total}
          </span>
        </button>
        <button
          onClick={() => {
            setMainTab('produtos')
            loadProdutos()
          }}
          className={`
            px-4 py-2 text-sm font-semibold transition-colors relative
            ${mainTab === 'produtos'
              ? 'text-japura-black border-b-2 border-japura-black'
              : 'text-japura-grey hover:text-japura-black'}
          `}
          >
          Gripmaster
          <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 rounded text-xs">
            {allProdutos.length}
          </span>
        </button>
        <button
          onClick={() => {
            setMainTab('transito')
            loadTransito()
          }}
          className={`
            px-4 py-2 text-sm font-semibold transition-colors relative
            ${mainTab === 'transito'
              ? 'text-japura-black border-b-2 border-japura-black'
              : 'text-japura-grey hover:text-japura-black'}
          `}
        >
          Trânsito
          <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 rounded text-xs">
            {allTransito.length}
          </span>
        </button>
        <button
          onClick={() => {
            setMainTab('recebidos')
            loadRecebidos()
          }}
          className={`
            px-4 py-2 text-sm font-semibold transition-colors relative
            ${mainTab === 'recebidos'
              ? 'text-japura-black border-b-2 border-japura-black'
              : 'text-japura-grey hover:text-japura-black'}
          `}
        >
          Recebidos
          <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 rounded text-xs">
            {allRecebidos.length}
          </span>
        </button>
      </div>

      {/* Filtro de PIMP selecionado (quando em Produtos ou Trânsito) */}
      {mainTab !== 'pimps' && selectedPimpId && (
        <div className="mb-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-700">Filtrando por PIMP:</span>
            <span className="text-sm font-semibold text-blue-900">
              {[...pimpsAtivos, ...pimpsFinalizados].find(p => p.id === selectedPimpId)?.numero || selectedPimpId}
            </span>
          </div>
          <button
            onClick={handleClearPimpSelection}
            className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
          >
            Limpar filtro
          </button>
        </div>
      )}

      {/* Sub-abas para PIMPs (Ativos, Finalizados, Histórico) */}
      {mainTab === 'pimps' && (
        <div className="flex gap-1 border-b border-gray-300 mb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-3 py-1.5 text-xs font-semibold transition-colors relative
                ${activeTab === tab.id
                  ? 'text-japura-black border-b-2 border-japura-black'
                  : 'text-japura-grey hover:text-japura-black'}
              `}
            >
              {tab.label}
              <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Barra de Ações Compacta - Estilo Excel */}
      <div className="flex items-center justify-between py-1.5 px-2 bg-gray-50 border border-gray-300 rounded mb-2">
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-japura-grey" size={14} />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-2 py-1 border border-gray-300 rounded text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowColorConfig(!showColorConfig)}
            className={`px-2 py-1 border border-gray-300 rounded text-xs flex items-center gap-1 hover:bg-white ${
              showColorConfig ? 'bg-japura-dark text-white' : ''
            }`}
            title="Cores"
          >
            <Palette size={12} />
            <span>Cores</span>
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2 py-1 text-xs flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-japura-dark text-white' : 'bg-white hover:bg-gray-50'
              }`}
              title="Tabela"
            >
              <Table2 size={12} />
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-2 py-1 text-xs flex items-center gap-1 border-l border-gray-300 ${
                viewMode === 'dashboard' ? 'bg-japura-dark text-white' : 'bg-white hover:bg-gray-50'
              }`}
              title="Dashboard"
            >
              <BarChart3 size={12} />
            </button>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-2 py-1 border border-gray-300 rounded text-xs flex items-center gap-1 hover:bg-white"
            title="Exportar"
          >
            <Download size={12} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Configuração de Cores - Compacta */}
      <AnimatePresence>
        {showColorConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-300 rounded p-2 mb-2 overflow-hidden"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-japura-grey">Legenda:</span>
              {colorConfigs.map((config, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-xs text-japura-grey">{config.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Principal - MÁXIMO ESPAÇO */}
      {viewMode === 'table' && mainTab === 'pimps' && (
        <div className="flex-1 bg-white border border-gray-300 rounded overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
              <thead className="sticky top-0 z-20 bg-gray-200">
                <tr className="border-b border-gray-400">
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 w-6">
                  </th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[120px] relative">
                    <div className="flex items-center gap-1">
                      <span>PIMP</span>
                      <button
                        onClick={() => setShowColumnFilter(showColumnFilter === 'numero' ? null : 'numero')}
                        className="p-0.5 hover:bg-gray-300 rounded"
                      >
                        <Filter size={10} />
                      </button>
                    </div>
                    {showColumnFilter === 'numero' && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg p-1.5 z-30">
                        <input
                          type="text"
                          placeholder="Filtrar..."
                          value={columnFilters.numero || ''}
                          onChange={(e) => setColumnFilters({ ...columnFilters, numero: e.target.value })}
                          className="w-32 px-1.5 py-0.5 border border-gray-300 rounded text-xs"
                          autoFocus
                        />
                      </div>
                    )}
                  </th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[150px] relative">
                    <div className="flex items-center gap-1">
                      <span>Fornecedor</span>
                      <button
                        onClick={() => setShowColumnFilter(showColumnFilter === 'fornecedor' ? null : 'fornecedor')}
                        className="p-0.5 hover:bg-gray-300 rounded"
                      >
                        <Filter size={10} />
                      </button>
                    </div>
                    {showColumnFilter === 'fornecedor' && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg p-1.5 z-30 min-w-[180px]">
                        <select
                          value={columnFilters.fornecedor || ''}
                          onChange={(e) => setColumnFilters({ ...columnFilters, fornecedor: e.target.value })}
                          className="w-full px-1.5 py-0.5 border border-gray-300 rounded text-xs"
                        >
                          <option value="">Todos</option>
                          {uniqueValues('fornecedor').map((val) => (
                            <option key={val} value={val}>{val}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[180px]">
                    Produto
                  </th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[90px]">
                    Qtd
                  </th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[110px]">
                    USD
                  </th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[120px]">
                    BRL
                  </th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[130px] relative">
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <button
                        onClick={() => setShowColumnFilter(showColumnFilter === 'status' ? null : 'status')}
                        className="p-0.5 hover:bg-gray-300 rounded"
                      >
                        <Filter size={10} />
                      </button>
                    </div>
                    {showColumnFilter === 'status' && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg p-1.5 z-30 min-w-[160px]">
                        <select
                          value={columnFilters.status || ''}
                          onChange={(e) => setColumnFilters({ ...columnFilters, status: e.target.value })}
                          className="w-full px-1.5 py-0.5 border border-gray-300 rounded text-xs"
                        >
                          <option value="">Todos</option>
                          {uniqueValues('status').map((val) => (
                            <option key={val} value={val}>{val}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[100px]">
                    Início
                  </th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[100px]">
                    Prevista
                  </th>
                  <th className="px-2 py-1.5 text-center text-xs font-bold text-japura-black uppercase bg-gray-200 min-w-[80px]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPimps.map((pimp, index) => {
                  const rowColor = getRowColor(pimp);
                  const isEditing = editingCell?.rowId === pimp.id;
                  const isExpanded = expandedRows.has(pimp.id);
                  
                  return (
                    <Fragment key={pimp.id}>
                      <tr
                        className="border-b border-gray-300 hover:bg-gray-50 transition-colors"
                        style={{ backgroundColor: rowColor }}
                      >
                        <td className="px-2 py-1 text-center border-r border-gray-300">
                          <button
                            onClick={() => toggleRowExpansion(pimp.id)}
                            className="p-0.5 hover:bg-gray-200 rounded"
                            title={isExpanded ? 'Recolher' : 'Expandir'}
                          >
                            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          </button>
                        </td>
                        
                        <td className="px-2 py-1 text-xs font-semibold text-japura-black border-r border-gray-300 tabular-nums">
                          {pimp.numero}
                        </td>
                        
                        <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">
                          {isEditing && editingCell?.field === 'fornecedor' ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveEdit}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                                className="w-full px-1 py-0.5 border border-blue-500 rounded text-xs focus:outline-none"
                                autoFocus
                              />
                              <button onClick={handleSaveEdit} className="text-green-600">
                                <Save size={10} />
                              </button>
                              <button onClick={handleCancelEdit} className="text-red-600">
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer hover:bg-blue-50 px-1 py-0.5 rounded flex items-center gap-1 group"
                              onClick={() => handleCellEdit(pimp.id, 'fornecedor', pimp.fornecedor)}
                            >
                              <span>{pimp.fornecedor}</span>
                              <Edit2 size={10} className="opacity-0 group-hover:opacity-100 text-japura-grey" />
                            </div>
                          )}
                        </td>
                        
                        <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">
                          {isEditing && editingCell?.field === 'produto' ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveEdit}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                                className="w-full px-1 py-0.5 border border-blue-500 rounded text-xs focus:outline-none"
                                autoFocus
                              />
                              <button onClick={handleSaveEdit} className="text-green-600">
                                <Save size={10} />
                              </button>
                              <button onClick={handleCancelEdit} className="text-red-600">
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer hover:bg-blue-50 px-1 py-0.5 rounded flex items-center gap-1 group"
                              onClick={() => handleCellEdit(pimp.id, 'produto', pimp.produto)}
                            >
                              <span>{pimp.produto || '-'}</span>
                              <Edit2 size={10} className="opacity-0 group-hover:opacity-100 text-japura-grey" />
                            </div>
                          )}
                        </td>
                        
                        <td className="px-2 py-1 text-xs text-right text-japura-dark border-r border-gray-300 tabular-nums">
                          {isEditing && editingCell?.field === 'quantidade' ? (
                            <div className="flex items-center gap-1 justify-end">
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveEdit}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                                className="w-20 px-1 py-0.5 border border-blue-500 rounded text-xs text-right focus:outline-none"
                                autoFocus
                              />
                              <button onClick={handleSaveEdit} className="text-green-600">
                                <Save size={10} />
                              </button>
                              <button onClick={handleCancelEdit} className="text-red-600">
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer hover:bg-blue-50 px-1 py-0.5 rounded inline-block group"
                              onClick={() => handleCellEdit(pimp.id, 'quantidade', pimp.quantidade)}
                            >
                              {pimp.quantidade.toLocaleString('pt-BR')}
                              <Edit2 size={10} className="opacity-0 group-hover:opacity-100 text-japura-grey ml-1" />
                            </div>
                          )}
                        </td>
                        
                        <td className="px-2 py-1 text-xs text-right text-japura-dark border-r border-gray-300 tabular-nums">
                          {isEditing && editingCell?.field === 'valorUsd' ? (
                            <div className="flex items-center gap-1 justify-end">
                              <input
                                type="number"
                                step="0.01"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveEdit}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                                className="w-24 px-1 py-0.5 border border-blue-500 rounded text-xs text-right focus:outline-none"
                                autoFocus
                              />
                              <button onClick={handleSaveEdit} className="text-green-600">
                                <Save size={10} />
                              </button>
                              <button onClick={handleCancelEdit} className="text-red-600">
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer hover:bg-blue-50 px-1 py-0.5 rounded inline-block group"
                              onClick={() => handleCellEdit(pimp.id, 'valorUsd', pimp.valorUsd)}
                            >
                              {pimp.valorUsd.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              <Edit2 size={10} className="opacity-0 group-hover:opacity-100 text-japura-grey ml-1" />
                            </div>
                          )}
                        </td>
                        
                        <td className="px-2 py-1 text-xs text-right font-semibold text-japura-black border-r border-gray-300 tabular-nums">
                          R$ {pimp.valorBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        
                        <td className="px-2 py-1 border-r border-gray-300">
                          <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-100 text-japura-dark">
                            {pimp.status}
                          </span>
                        </td>
                        
                        <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">
                          {isEditing && editingCell?.field === 'dataInicio' ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="date"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveEdit}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                                className="w-full px-1 py-0.5 border border-blue-500 rounded text-xs focus:outline-none"
                                autoFocus
                              />
                              <button onClick={handleSaveEdit} className="text-green-600">
                                <Save size={10} />
                              </button>
                              <button onClick={handleCancelEdit} className="text-red-600">
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer hover:bg-blue-50 px-1 py-0.5 rounded flex items-center gap-1 group"
                              onClick={() => handleCellEdit(pimp.id, 'dataInicio', pimp.dataInicio)}
                            >
                              {pimp.dataInicio ? new Date(pimp.dataInicio).toLocaleDateString('pt-BR') : '-'}
                              <Edit2 size={10} className="opacity-0 group-hover:opacity-100 text-japura-grey" />
                            </div>
                          )}
                        </td>
                        
                        <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">
                          {isEditing && editingCell?.field === 'dataPrevista' ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="date"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveEdit}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                                className="w-full px-1 py-0.5 border border-blue-500 rounded text-xs focus:outline-none"
                                autoFocus
                              />
                              <button onClick={handleSaveEdit} className="text-green-600">
                                <Save size={10} />
                              </button>
                              <button onClick={handleCancelEdit} className="text-red-600">
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer hover:bg-blue-50 px-1 py-0.5 rounded flex items-center gap-1 group"
                              onClick={() => handleCellEdit(pimp.id, 'dataPrevista', pimp.dataPrevista)}
                            >
                              {pimp.dataPrevista ? new Date(pimp.dataPrevista).toLocaleDateString('pt-BR') : '-'}
                              <Edit2 size={10} className="opacity-0 group-hover:opacity-100 text-japura-grey" />
                            </div>
                          )}
                        </td>
                        
                        <td className="px-2 py-1 text-center border-r border-gray-300">
                          <div className="flex items-center justify-center gap-1">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowColorPicker(showColorPicker === pimp.id ? null : pimp.id);
                                }}
                                className="p-1 hover:bg-gray-200 rounded flex items-center gap-0.5"
                                title="Cor"
                              >
                                <div
                                  className="w-3 h-3 rounded border border-gray-300"
                                  style={{ backgroundColor: rowColor }}
                                />
                                <Palette size={10} className="text-japura-grey" />
                              </button>
                              {showColorPicker === pimp.id && (
                                <div className="absolute bottom-full right-0 mb-1 bg-white border border-gray-300 rounded shadow-xl p-2 z-50 min-w-[180px]">
                                  <div className="space-y-1">
                                    {colorConfigs.map((config, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() => {
                                          handleColorSelect(pimp.id, config.color);
                                          setShowColorPicker(null);
                                        }}
                                        className="w-full flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded text-left"
                                      >
                                        <div
                                          className="w-5 h-5 rounded border border-gray-300"
                                          style={{ backgroundColor: config.color }}
                                        />
                                        <span className="text-xs text-japura-dark">{config.label}</span>
                                      </button>
                                    ))}
                                    <div className="pt-1 border-t border-gray-200">
                                      <input
                                        type="color"
                                        value={pimp.rowColor || '#FFFFFF'}
                                        onChange={(e) => {
                                          handleColorSelect(pimp.id, e.target.value);
                                          setShowColorPicker(null);
                                        }}
                                        className="w-full h-6 rounded border border-gray-300 cursor-pointer"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <button 
                              className="text-blue-600 hover:text-blue-800" 
                              title="Detalhes"
                              onClick={() => setSelectedPimp(pimp)}
                            >
                              <FileText size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Linha Expandida */}
                      {isExpanded && pimp.produtos && (
                        <tr>
                          <td colSpan={11} className="px-0 py-0 bg-gray-50 border-b border-gray-400">
                            <div className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-black text-japura-black">
                                  Produtos do {pimp.numero} ({pimp.produtos.length} itens)
                                </h4>
                                <button
                                  onClick={() => toggleRowExpansion(pimp.id)}
                                  className="text-xs text-japura-grey hover:text-japura-black"
                                >
                                  Recolher
                                </button>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-xs">
                                  <thead>
                                    <tr className="bg-gray-200 border-b border-gray-400">
                                      <th className="px-2 py-1 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400">Descrição</th>
                                      <th className="px-2 py-1 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400">Medida</th>
                                      <th className="px-2 py-1 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400">Modelo</th>
                                      <th className="px-2 py-1 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400">Marca</th>
                                      <th className="px-2 py-1 text-right text-xs font-bold text-japura-black uppercase border-r border-gray-400">Qtd</th>
                                      <th className="px-2 py-1 text-right text-xs font-bold text-japura-black uppercase border-r border-gray-400">USD</th>
                                      <th className="px-2 py-1 text-right text-xs font-bold text-japura-black uppercase border-r border-gray-400">BRL</th>
                                      <th className="px-2 py-1 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400">Transportadora</th>
                                      <th className="px-2 py-1 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400">ETA</th>
                                      <th className="px-2 py-1 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400">Container</th>
                                      <th className="px-2 py-1 text-left text-xs font-bold text-japura-black uppercase">Lote</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {pimp.produtos.map((produto, prodIndex) => (
                                      <tr
                                        key={produto.id}
                                        className={`border-b border-gray-300 ${prodIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                      >
                                        <td className="px-2 py-1 border-r border-gray-300 font-semibold text-xs">{produto.descricao}</td>
                                        <td className="px-2 py-1 border-r border-gray-300 text-xs">{produto.medida}</td>
                                        <td className="px-2 py-1 border-r border-gray-300 text-xs">{produto.modelo}</td>
                                        <td className="px-2 py-1 border-r border-gray-300 text-xs">{produto.marca}</td>
                                        <td className="px-2 py-1 text-right border-r border-gray-300 tabular-nums text-xs">{produto.quantidade?.toLocaleString('pt-BR') || '0'}</td>
                                        <td className="px-2 py-1 text-right border-r border-gray-300 tabular-nums text-xs">${produto.valorUnitarioUsd?.toFixed(2) || '0.00'}</td>
                                        <td className="px-2 py-1 text-right border-r border-gray-300 tabular-nums font-semibold text-xs">${produto.valorTotalUsd?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</td>
                                        <td className="px-2 py-1 text-right border-r border-gray-300 tabular-nums font-semibold text-xs">R$ {produto.valorTotalBrl?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</td>
                                        <td className="px-2 py-1 border-r border-gray-300 text-xs">{produto.transportadora || '-'}</td>
                                        <td className="px-2 py-1 border-r border-gray-300 text-xs">{produto.eta ? new Date(produto.eta).toLocaleDateString('pt-BR') : '-'}</td>
                                        <td className="px-2 py-1 border-r border-gray-300 font-mono text-xs">{produto.container}</td>
                                        <td className="px-2 py-1 font-mono text-xs">{produto.lote}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot className="bg-gray-200 font-bold">
                                    <tr>
                                      <td colSpan={4} className="px-2 py-1 border-r border-gray-400 text-right text-xs">TOTAL:</td>
                                      <td className="px-2 py-1 text-right border-r border-gray-400 tabular-nums text-xs">
                                        {pimp.produtos.reduce((sum, p) => sum + (p.quantidade || 0), 0).toLocaleString('pt-BR')}
                                      </td>
                                      <td colSpan={2} className="px-2 py-1 text-right border-r border-gray-400 tabular-nums text-xs">
                                        ${pimp.produtos.reduce((sum, p) => sum + (p.valorTotalUsd || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                      </td>
                                      <td className="px-2 py-1 text-right border-r border-gray-400 tabular-nums text-xs">
                                        R$ {pimp.produtos.reduce((sum, p) => sum + (p.valorTotalBrl || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                      </td>
                                      <td colSpan={4} className="px-2 py-1"></td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Footer Compacto */}
          <div className="px-2 py-1 border-t border-gray-400 bg-gray-100 text-xs text-japura-grey flex justify-between">
            <span>{filteredPimps.length} de {allPimps.length} registros</span>
          </div>
        </div>
      )}

      {/* Grid Gripmaster (Produtos) */}
      {viewMode === 'table' && mainTab === 'produtos' && (
        <div className="flex-1 bg-white border border-gray-300 rounded overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
              <thead className="sticky top-0 z-20 bg-gray-200">
                <tr className="border-b border-gray-400">
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[100px]">PIMP</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[120px]">Código</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[250px]">Descrição</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[80px]">Qtd</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[100px]">USD Unit</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[100px]">BRL Unit</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-japura-black uppercase bg-gray-200 min-w-[110px]">USD Total</th>
                </tr>
              </thead>
              <tbody>
                {allProdutos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-japura-grey">
                      {isLoading ? 'Carregando produtos...' : 'Nenhum produto encontrado'}
                    </td>
                  </tr>
                ) : (
                  allProdutos.map((produto, index) => (
                    <tr
                      key={produto.id}
                      className={`border-b border-gray-300 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-2 py-1 text-xs font-semibold text-japura-black border-r border-gray-300">{produto.pimpNumero || 'N/A'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300 font-mono">{produto.codigoProduto || '-'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">{produto.descricao || '-'}</td>
                      <td className="px-2 py-1 text-right text-xs tabular-nums border-r border-gray-300">{produto.quantidade?.toLocaleString('pt-BR') || '0'}</td>
                      <td className="px-2 py-1 text-right text-xs tabular-nums border-r border-gray-300">${produto.valorUnitarioUsd?.toFixed(2) || '0.00'}</td>
                      <td className="px-2 py-1 text-right text-xs tabular-nums border-r border-gray-300">R$ {produto.valorUnitarioBrl?.toFixed(2) || '0.00'}</td>
                      <td className="px-2 py-1 text-right text-xs tabular-nums font-semibold">${produto.valorTotalUsd?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0.00'}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {allProdutos.length > 0 && (
                <tfoot className="bg-gray-200 font-bold">
                  <tr>
                    <td colSpan={3} className="px-2 py-1 text-right text-xs border-r border-gray-400">TOTAL:</td>
                    <td className="px-2 py-1 text-right text-xs tabular-nums border-r border-gray-400">
                      {allProdutos.reduce((sum, p) => sum + (p.quantidade || 0), 0).toLocaleString('pt-BR')}
                    </td>
                    <td colSpan={2} className="px-2 py-1 border-r border-gray-400"></td>
                    <td className="px-2 py-1 text-right text-xs tabular-nums">
                      ${allProdutos.reduce((sum, p) => sum + (p.valorTotalUsd || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          <div className="px-2 py-1 border-t border-gray-400 bg-gray-100 text-xs text-japura-grey flex justify-between">
            <span>{allProdutos.length} produto(s) encontrado(s)</span>
          </div>
        </div>
      )}

      {/* Grid Trânsito */}
      {viewMode === 'table' && mainTab === 'transito' && (
        <div className="flex-1 bg-white border border-gray-300 rounded overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
              <thead className="sticky top-0 z-20 bg-gray-200">
                <tr className="border-b border-gray-400">
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[100px]">PIMP</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[150px]">Carrier</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[150px]">Agent</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[120px]">Container</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[120px]">Invoice</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[130px]">Status</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[100px]">ETA</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase bg-gray-200 min-w-[100px]">Arrival</th>
                </tr>
              </thead>
              <tbody>
                {allTransito.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-xs text-japura-grey">
                      {isLoading ? 'Carregando trânsito...' : 'Nenhum registro de trânsito encontrado'}
                    </td>
                  </tr>
                ) : (
                  allTransito.map((transito, index) => (
                    <tr
                      key={transito.id}
                      className={`border-b border-gray-300 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-2 py-1 text-xs font-semibold text-japura-black border-r border-gray-300">{transito.pimpNumero || 'N/A'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">{transito.carrier || '-'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">{transito.agent || '-'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300 font-mono">{transito.container || '-'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">{transito.invoiceNumero || '-'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">{transito.statusAverbacao || '-'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">{transito.arrivalPortDate ? new Date(transito.arrivalPortDate).toLocaleDateString('pt-BR') : '-'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark">{transito.arrivalPortDate ? new Date(transito.arrivalPortDate).toLocaleDateString('pt-BR') : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-2 py-1 border-t border-gray-400 bg-gray-100 text-xs text-japura-grey flex justify-between">
            <span>{allTransito.length} registro(s) de trânsito encontrado(s)</span>
          </div>
        </div>
      )}

      {/* Grid Recebidos */}
      {viewMode === 'table' && mainTab === 'recebidos' && (
        <div className="flex-1 bg-white border border-gray-300 rounded overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
              <thead className="sticky top-0 z-20 bg-gray-200">
                <tr className="border-b border-gray-400">
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[100px]">PIMP</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[150px]">Exporter</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[80px]">Qtd</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[120px]">Código</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[250px]">Descrição</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[110px]">USD Total</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[110px]">USD Freight</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase border-r border-gray-400 bg-gray-200 min-w-[100px]">Data Recebido</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-japura-black uppercase bg-gray-200 min-w-[150px]">Referência</th>
                </tr>
              </thead>
              <tbody>
                {allRecebidos.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-xs text-japura-grey">
                      {isLoading ? 'Carregando recebidos...' : 'Nenhum registro de recebido encontrado'}
                    </td>
                  </tr>
                ) : (
                  allRecebidos.map((recebido, index) => (
                    <tr
                      key={recebido.id}
                      className={`border-b border-gray-300 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-2 py-1 text-xs font-semibold text-japura-black border-r border-gray-300">{recebido.pimp}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">{recebido.exporter || '-'}</td>
                      <td className="px-2 py-1 text-right text-xs tabular-nums border-r border-gray-300">{recebido.qtd?.toLocaleString('pt-BR') || '0'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300 font-mono">{recebido.cod || '-'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">{recebido.description || '-'}</td>
                      <td className="px-2 py-1 text-right text-xs tabular-nums border-r border-gray-300">${recebido.usdTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0.00'}</td>
                      <td className="px-2 py-1 text-right text-xs tabular-nums border-r border-gray-300">${recebido.usdFreight?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0.00'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">{recebido.receivedDate ? new Date(recebido.receivedDate).toLocaleDateString('pt-BR') : '-'}</td>
                      <td className="px-2 py-1 text-xs text-japura-dark">{recebido.reference || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {allRecebidos.length > 0 && (
                <tfoot className="bg-gray-200 font-bold">
                  <tr>
                    <td colSpan={2} className="px-2 py-1 text-right text-xs border-r border-gray-400">TOTAL:</td>
                    <td className="px-2 py-1 text-right text-xs tabular-nums border-r border-gray-400">
                      {allRecebidos.reduce((sum, r) => sum + (r.qtd || 0), 0).toLocaleString('pt-BR')}
                    </td>
                    <td colSpan={2} className="px-2 py-1 border-r border-gray-400"></td>
                    <td className="px-2 py-1 text-right text-xs tabular-nums border-r border-gray-400">
                      ${allRecebidos.reduce((sum, r) => sum + (r.usdTotal || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-2 py-1 text-right text-xs tabular-nums border-r border-gray-400">
                      ${allRecebidos.reduce((sum, r) => sum + (r.usdFreight || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan={2} className="px-2 py-1"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          <div className="px-2 py-1 border-t border-gray-400 bg-gray-100 text-xs text-japura-grey flex justify-between">
            <span>{allRecebidos.length} registro(s) de recebido encontrado(s)</span>
          </div>
        </div>
      )}

      {/* Visualização Dashboard */}
      {viewMode === 'dashboard' && (
        <div className="flex-1 bg-white border border-gray-300 rounded p-4 overflow-auto">
          <h3 className="text-lg font-black text-japura-black mb-4">Dashboard de PIMPs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-japura-bg p-3 rounded border border-gray-200">
              <p className="text-xs font-semibold text-japura-grey mb-1">Total</p>
              <p className="text-xl font-black text-japura-black">{filteredPimps.length}</p>
            </div>
            <div className="bg-japura-bg p-3 rounded border border-gray-200">
              <p className="text-xs font-semibold text-japura-grey mb-1">USD Total</p>
              <p className="text-xl font-black text-japura-black">
                ${filteredPimps.reduce((sum, p) => sum + (p.valorUsd || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-japura-bg p-3 rounded border border-gray-200">
              <p className="text-xs font-semibold text-japura-grey mb-1">BRL Total</p>
              <p className="text-xl font-black text-japura-black">
                R$ {filteredPimps.reduce((sum, p) => sum + (p.valorBrl || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-japura-bg rounded border-2 border-dashed border-gray-300">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto text-japura-grey mb-2" />
              <p className="text-japura-grey text-sm">Gráficos serão implementados</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exportação */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded shadow-2xl border-2 border-japura-black w-full max-w-2xl"
            >
              <div className="bg-japura-black p-3 flex items-center justify-between">
                <h2 className="text-lg font-black text-white">Exportar Excel</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-japura-grey mb-1">Período Início</label>
                    <input
                      type="date"
                      value={exportParams.periodoInicio}
                      onChange={(e) => setExportParams({ ...exportParams, periodoInicio: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-japura-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-japura-grey mb-1">Período Fim</label>
                    <input
                      type="date"
                      value={exportParams.periodoFim}
                      onChange={(e) => setExportParams({ ...exportParams, periodoFim: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-japura-dark"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-japura-grey mb-1">Status</label>
                  <select
                    value={exportParams.status}
                    onChange={(e) => setExportParams({ ...exportParams, status: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-japura-dark"
                  >
                    <option value="todos">Todos</option>
                    {uniqueValues('status').map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-japura-grey mb-1">Fornecedor</label>
                  <select
                    value={exportParams.fornecedor}
                    onChange={(e) => setExportParams({ ...exportParams, fornecedor: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-japura-dark"
                  >
                    <option value="todos">Todos</option>
                    {uniqueValues('fornecedor').map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={exportParams.incluirProdutos}
                      onChange={(e) => setExportParams({ ...exportParams, incluirProdutos: e.target.checked })}
                      className="rounded"
                    />
                    <span>Incluir produtos detalhados</span>
                  </label>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-3 py-1.5 bg-japura-dark text-white rounded hover:bg-japura-black text-xs font-semibold"
                  >
                    Exportar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {selectedPimp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPimp(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded shadow-2xl border-2 border-japura-black w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="bg-japura-black p-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">{selectedPimp.numero}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedPimp.fornecedor}</p>
                </div>
                <button
                  onClick={() => setSelectedPimp(null)}
                  className="p-1.5 hover:bg-gray-800 rounded"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {selectedPimp.produtos && selectedPimp.produtos.length > 0 && (
                  <div>
                    <h3 className="text-base font-black text-japura-black mb-3">Produtos ({selectedPimp.produtos.length} itens)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-400 text-xs">
                        <thead>
                          <tr className="bg-gray-200 border-b-2 border-gray-500">
                            <th className="px-2 py-1.5 text-left font-bold text-japura-black uppercase border-r border-gray-400">Descrição</th>
                            <th className="px-2 py-1.5 text-left font-bold text-japura-black uppercase border-r border-gray-400">Medida</th>
                            <th className="px-2 py-1.5 text-left font-bold text-japura-black uppercase border-r border-gray-400">Modelo</th>
                            <th className="px-2 py-1.5 text-left font-bold text-japura-black uppercase border-r border-gray-400">Marca</th>
                            <th className="px-2 py-1.5 text-right font-bold text-japura-black uppercase border-r border-gray-400">Qtd</th>
                            <th className="px-2 py-1.5 text-right font-bold text-japura-black uppercase border-r border-gray-400">USD</th>
                            <th className="px-2 py-1.5 text-right font-bold text-japura-black uppercase border-r border-gray-400">BRL</th>
                            <th className="px-2 py-1.5 text-left font-bold text-japura-black uppercase border-r border-gray-400">Transportadora</th>
                            <th className="px-2 py-1.5 text-left font-bold text-japura-black uppercase border-r border-gray-400">ETA</th>
                            <th className="px-2 py-1.5 text-left font-bold text-japura-black uppercase border-r border-gray-400">Container</th>
                            <th className="px-2 py-1.5 text-left font-bold text-japura-black uppercase">Lote</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPimp.produtos.map((produto, index) => (
                            <tr
                              key={produto.id}
                              className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                              <td className="px-2 py-1.5 border-r border-gray-300 font-semibold">{produto.descricao}</td>
                              <td className="px-2 py-1.5 border-r border-gray-300">{produto.medida}</td>
                              <td className="px-2 py-1.5 border-r border-gray-300">{produto.modelo}</td>
                              <td className="px-2 py-1.5 border-r border-gray-300">{produto.marca}</td>
                              <td className="px-2 py-1.5 text-right border-r border-gray-300 tabular-nums">{produto.quantidade?.toLocaleString('pt-BR') || '0'}</td>
                              <td className="px-2 py-1.5 text-right border-r border-gray-300 tabular-nums">${produto.valorUnitarioUsd?.toFixed(2) || '0.00'}</td>
                              <td className="px-2 py-1.5 text-right border-r border-gray-300 tabular-nums font-semibold">${produto.valorTotalUsd?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</td>
                              <td className="px-2 py-1.5 text-right border-r border-gray-300 tabular-nums font-semibold">R$ {produto.valorTotalBrl?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</td>
                              <td className="px-2 py-1.5 border-r border-gray-300">{produto.transportadora || '-'}</td>
                              <td className="px-2 py-1.5 border-r border-gray-300">{produto.eta ? new Date(produto.eta).toLocaleDateString('pt-BR') : '-'}</td>
                              <td className="px-2 py-1.5 border-r border-gray-300 font-mono">{produto.container}</td>
                              <td className="px-2 py-1.5 font-mono">{produto.lote}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-300 bg-gray-50 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedPimp(null)}
                  className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 text-xs"
                >
                  Fechar
                </button>
                <button
                  onClick={() => alert('Exportando...')}
                  className="px-3 py-1.5 bg-japura-dark text-white rounded hover:bg-japura-black text-xs font-semibold"
                >
                  Exportar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assistente de IA */}
      <AIAssistant />
    </div>
  );
}
