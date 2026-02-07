'use client';

import { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Package,
  MapPin,
  TrendingUp,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Filter,
  BarChart3,
  TrendingDown,
  Clock,
  Truck
} from 'lucide-react';

interface SugestaoDistribuicao {
  id: string;
  produto: string;
  sku: string;
  filialOrigem: string;
  filialDestino: string;
  quantidade: number;
  estoqueAtual: number;
  vendasMedias: number;
  justificativa: string;
  prioridade: 'alta' | 'media' | 'baixa';
  economiaEstimada: number;
  tempoTransito: number;
  categoria: string;
}

interface EstoqueFilial {
  filial: string;
  estoqueTotal: number;
  produtosCriticos: number;
  produtosExcedentes: number;
}

export default function JapDistribution() {
  const [selectedFilial, setSelectedFilial] = useState('todas');
  const [selectedPrioridade, setSelectedPrioridade] = useState('todas');
  const [aprovadas, setAprovadas] = useState<Set<string>>(new Set());

  // Gerar dados extensos de sugestões
  const generateSugestoes = (): SugestaoDistribuicao[] => {
    const produtos = [
      { nome: 'Pneu 205/55R16 91V', sku: 'MIC-205-55-16', categoria: 'Passeio' },
      { nome: 'Pneu 185/65R15 88H', sku: 'CON-185-65-15', categoria: 'Passeio' },
      { nome: 'Pneu 225/50R17 94W', sku: 'BRID-225-50-17', categoria: 'Esportivo' },
      { nome: 'Pneu 195/60R15 88T', sku: 'GOOD-195-60-15', categoria: 'Passeio' },
      { nome: 'Pneu 215/60R16 95H', sku: 'PIRE-215-60-16', categoria: 'SUV' },
      { nome: 'Pneu 235/75R15 105S', sku: 'MIC-235-75-15', categoria: 'Agro' },
      { nome: 'Pneu 265/70R16 112T', sku: 'BRID-265-70-16', categoria: 'SUV' },
      { nome: 'Pneu 175/70R14 84T', sku: 'CON-175-70-14', categoria: 'Passeio' },
    ];

    const filiais = [
      'Manaus - Centro', 'Manaus - Cidade Nova', 'São Paulo - SP', 'Rio de Janeiro - RJ',
      'Belo Horizonte - MG', 'Curitiba - PR', 'Porto Alegre - RS', 'Recife - PE',
      'Salvador - BA', 'Fortaleza - CE', 'Brasília - DF', 'Goiânia - GO'
    ];

    const justificativas = [
      'Estoque alto na origem, demanda crescente no destino',
      'Otimização de estoque regional',
      'Ruptura iminente no destino',
      'Sazonalidade: demanda prevista alta',
      'Evento externo: mineração aumentando demanda',
      'Ciclo agrícola: necessidade sazonal',
      'Estoque excedente na origem, baixa rotatividade',
      'Nova filial com demanda inicial alta',
    ];

    const sugestoes: SugestaoDistribuicao[] = [];
    
    for (let i = 0; i < 15; i++) {
      const produto = produtos[i % produtos.length];
      const origem = filiais[Math.floor(Math.random() * filiais.length)];
      let destino = filiais[Math.floor(Math.random() * filiais.length)];
      while (destino === origem) {
        destino = filiais[Math.floor(Math.random() * filiais.length)];
      }
      
      const quantidade = Math.floor(Math.random() * 800) + 100;
      const estoqueAtual = Math.floor(Math.random() * 2000) + 500;
      const vendasMedias = Math.floor(Math.random() * 600) + 200;
      const prioridades: ('alta' | 'media' | 'baixa')[] = ['alta', 'media', 'baixa'];
      const prioridade = prioridades[Math.floor(Math.random() * 3)];
      
      sugestoes.push({
        id: `sug-${i + 1}`,
        produto: produto.nome,
        sku: produto.sku,
        filialOrigem: origem,
        filialDestino: destino,
        quantidade,
        estoqueAtual,
        vendasMedias,
        justificativa: justificativas[i % justificativas.length],
        prioridade,
        economiaEstimada: Math.floor(Math.random() * 50000) + 10000,
        tempoTransito: Math.floor(Math.random() * 10) + 3,
        categoria: produto.categoria,
      });
    }
    
    return sugestoes;
  };

  const [sugestoes] = useState<SugestaoDistribuicao[]>(generateSugestoes());

  // Filtrar sugestões
  const sugestoesFiltradas = useMemo(() => {
    return sugestoes.filter(s => {
      const matchFilial = selectedFilial === 'todas' || 
        s.filialOrigem.toLowerCase().includes(selectedFilial.toLowerCase()) ||
        s.filialDestino.toLowerCase().includes(selectedFilial.toLowerCase());
      const matchPrioridade = selectedPrioridade === 'todas' || s.prioridade === selectedPrioridade;
      return matchFilial && matchPrioridade;
    });
  }, [sugestoes, selectedFilial, selectedPrioridade]);

  // Calcular KPIs dinâmicos
  const kpis = useMemo(() => {
    const total = sugestoesFiltradas.length;
    const aprovadasCount = sugestoesFiltradas.filter(s => aprovadas.has(s.id)).length;
    const economiaTotal = sugestoesFiltradas.reduce((sum, s) => sum + s.economiaEstimada, 0);
    const altaPrioridade = sugestoesFiltradas.filter(s => s.prioridade === 'alta').length;
    
    return {
      total,
      aprovadas: aprovadasCount,
      economia: economiaTotal,
      altaPrioridade,
    };
  }, [sugestoesFiltradas, aprovadas]);

  // Dados para gráfico de estoque por filial
  const estoquePorFilial = useMemo(() => {
    const filiais = Array.from(new Set([
      ...sugestoesFiltradas.map(s => s.filialOrigem),
      ...sugestoesFiltradas.map(s => s.filialDestino)
    ]));
    
    return filiais.map(filial => {
      const estoqueTotal = sugestoesFiltradas
        .filter(s => s.filialOrigem === filial)
        .reduce((sum, s) => sum + s.estoqueAtual, 0);
      const produtosCriticos = sugestoesFiltradas
        .filter(s => s.filialDestino === filial && s.prioridade === 'alta')
        .length;
      
      return {
        filial,
        estoqueTotal,
        produtosCriticos,
      };
    }).sort((a, b) => b.estoqueTotal - a.estoqueTotal).slice(0, 8);
  }, [sugestoesFiltradas]);

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-japura-bg text-japura-dark border-gray-400';
      case 'media':
        return 'bg-gray-100 text-japura-dark border-gray-400';
      case 'baixa':
        return 'bg-gray-100 text-japura-black border-gray-400';
      default:
        return 'bg-gray-100 text-japura-grey border-gray-300';
    }
  };

  const handleAprovar = (id: string) => {
    setAprovadas(prev => new Set([...prev, id]));
  };

  const maxEstoque = Math.max(...estoquePorFilial.map(e => e.estoqueTotal), 1);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-end pb-3 border-b border-gray-400">
        <div>
          <h1 className="text-lg font-semibold text-japura-black mb-1">Distribuição Inteligente</h1>
          <p className="text-xs text-japura-grey">Sistema preditivo de distribuição de produtos por filial</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-gray-400 rounded hover:bg-japura-bg flex items-center gap-2 text-sm">
            <RefreshCw size={14} />
            <span>Recalcular</span>
          </button>
          <button className="px-3 py-1.5 bg-japura-dark text-white rounded hover:bg-japura-black flex items-center gap-2 text-sm">
            <Download size={14} />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-japura-white rounded border border-gray-400 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={14} className="text-japura-grey" />
          <h3 className="text-xs font-semibold text-japura-dark uppercase">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium text-japura-grey mb-1">Filial</label>
            <select
              value={selectedFilial}
              onChange={(e) => setSelectedFilial(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-400 rounded text-sm focus:outline-none focus:ring-1 focus:ring-japura-dark"
            >
              <option value="todas">Todas as Filiais</option>
              <option value="manaus">Manaus</option>
              <option value="são paulo">São Paulo</option>
              <option value="rio de janeiro">Rio de Janeiro</option>
              <option value="belo horizonte">Belo Horizonte</option>
              <option value="curitiba">Curitiba</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-japura-grey mb-1">Prioridade</label>
            <select 
              value={selectedPrioridade}
              onChange={(e) => setSelectedPrioridade(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-400 rounded text-sm focus:outline-none focus:ring-1 focus:ring-japura-dark"
            >
              <option value="todas">Todas</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-3 py-1.5 bg-japura-dark text-white rounded hover:bg-japura-black text-sm">
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="bg-japura-white p-2 rounded border border-gray-400 flex items-center gap-2">
          <div className="p-1.5 bg-japura-bg rounded border border-gray-200 shrink-0">
            <Package size={14} className="text-japura-dark" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-japura-grey uppercase">Sugestões Geradas</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">{kpis.total}</p>
            <p className="text-[11px] text-japura-grey">Filtradas</p>
          </div>
        </div>
        <div className="bg-japura-white p-2 rounded border border-gray-400 flex items-center gap-2">
          <div className="p-1.5 bg-gray-100 rounded border border-gray-200 shrink-0">
            <CheckCircle2 size={14} className="text-japura-dark" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-japura-grey uppercase">Aprovadas</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">{kpis.aprovadas}</p>
            <p className="text-[11px] text-japura-grey">{kpis.total > 0 ? Math.round((kpis.aprovadas / kpis.total) * 100) : 0}% do total</p>
          </div>
        </div>
        <div className="bg-japura-white p-2 rounded border border-gray-400 flex items-center gap-2">
          <div className="p-1.5 bg-japura-bg rounded border border-gray-200 shrink-0">
            <TrendingUp size={14} className="text-japura-dark" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-japura-grey uppercase">Economia Estimada</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">R$ {(kpis.economia / 1000).toFixed(0)}K</p>
            <p className="text-[11px] text-japura-grey">Com otimização</p>
          </div>
        </div>
        <div className="bg-japura-white p-2 rounded border border-gray-400 flex items-center gap-2">
          <div className="p-1.5 bg-japura-bg rounded border border-gray-200 shrink-0">
            <AlertCircle size={14} className="text-japura-dark" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-japura-grey uppercase">Alta Prioridade</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">{kpis.altaPrioridade}</p>
            <p className="text-[11px] text-japura-grey">Requerem atenção</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Estoque por Filial */}
      <div className="bg-japura-white rounded border border-gray-400 p-3">
        <h3 className="text-base font-semibold text-japura-black mb-2 flex items-center gap-2">
          <BarChart3 size={16} />
          Estoque por Filial
        </h3>
        <div className="space-y-2">
          {estoquePorFilial.map((item) => (
            <div key={item.filial} className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-japura-dark">{item.filial}</span>
                <span className="text-japura-grey tabular-nums">
                  {item.estoqueTotal.toLocaleString('pt-BR')} un.</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                <div
                  className="bg-japura-dark h-full rounded transition-all"
                  style={{ width: `${(item.estoqueTotal / maxEstoque) * 100}%` }}
                />
              </div>
              {item.produtosCriticos > 0 && (
                <p className="text-[11px] text-japura-dark flex items-center gap-1">
                  <AlertCircle size={10} />
                  {item.produtosCriticos} produto(s) com risco de ruptura
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Sugestões */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-japura-black">Sugestões de Distribuição</h3>
          <span className="text-xs text-japura-grey">
            {sugestoesFiltradas.length} de {sugestoes.length} sugestões
          </span>
        </div>
        {sugestoesFiltradas.map((sugestao) => {
          const isAprovada = aprovadas.has(sugestao.id);
          return (
            <div
              key={sugestao.id}
              className={`bg-japura-white rounded border p-3 transition-colors ${
                isAprovada ? 'border-gray-400 bg-gray-50' : 'border-gray-400'
              } hover:bg-japura-bg`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-japura-black">{sugestao.produto}</h3>
                    <span className="text-xs text-japura-grey">({sugestao.sku})</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPrioridadeColor(sugestao.prioridade)}`}>
                      {sugestao.prioridade}
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-100 text-japura-grey rounded text-xs">
                      {sugestao.categoria}
                    </span>
                    {isAprovada && (
                      <span className="px-2 py-0.5 bg-japura-dark text-white rounded text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Aprovada
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-japura-grey">Origem: </span>
                      <span className="text-japura-dark">{sugestao.filialOrigem}</span>
                    </div>
                    <div>
                      <span className="text-japura-grey">Destino: </span>
                      <span className="text-japura-dark">{sugestao.filialDestino}</span>
                    </div>
                    <div>
                      <span className="text-japura-grey">Qtd: </span>
                      <span className="text-japura-black font-medium">{sugestao.quantidade.toLocaleString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="text-japura-grey">Economia: </span>
                      <span className="text-japura-dark">R$ {(sugestao.economiaEstimada / 1000).toFixed(1)}K</span>
                    </div>
                  </div>
                  <p className="text-xs text-japura-grey mt-1.5 border-l-2 border-gray-300 pl-2">{sugestao.justificativa}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {!isAprovada ? (
                    <>
                      <button 
                        onClick={() => handleAprovar(sugestao.id)}
                        className="px-3 py-1.5 bg-japura-dark text-white rounded hover:bg-japura-black flex items-center gap-1 text-sm"
                      >
                        <CheckCircle2 size={14} />
                        <span>Aprovar</span>
                      </button>
                      <button className="px-3 py-1.5 border border-gray-400 rounded hover:bg-japura-bg flex items-center gap-1 text-sm">
                        <AlertCircle size={14} />
                        <span>Revisar</span>
                      </button>
                    </>
                  ) : (
                    <button className="px-3 py-1.5 bg-gray-200 text-japura-grey rounded flex items-center gap-1 text-sm cursor-default">
                      <CheckCircle2 size={14} />
                      <span>Aprovada</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mapa de Distribuição Placeholder */}
      <div className="bg-japura-white rounded border border-gray-400 p-3">
        <h3 className="text-base font-semibold text-japura-black mb-2 flex items-center gap-2">
          <MapPin size={16} />
          Mapa de Distribuição
        </h3>
        <div className="h-48 flex items-center justify-center bg-japura-bg rounded border border-dashed border-gray-400">
          <div className="text-center">
            <MapPin size={32} className="mx-auto text-japura-grey mb-1" />
            <p className="text-xs text-japura-grey font-medium">Mapa interativo será implementado aqui</p>
            <p className="text-[11px] text-japura-grey mt-0.5">Visualização geográfica das rotas de distribuição</p>
          </div>
        </div>
      </div>
    </div>
  );
}
