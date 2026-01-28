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
        return 'bg-red-100 text-red-700 border-red-300';
      case 'media':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'baixa':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAprovar = (id: string) => {
    setAprovadas(prev => new Set([...prev, id]));
  };

  const maxEstoque = Math.max(...estoquePorFilial.map(e => e.estoqueTotal), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end pb-6 border-b-2 border-orange-500">
        <div>
          <h1 className="text-4xl font-black text-japura-black mb-2">Distribuição Inteligente</h1>
          <p className="text-japura-grey">Sistema preditivo de distribuição de produtos por filial</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-japura hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <RefreshCw size={18} />
            <span>Recalcular</span>
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-japura hover:bg-orange-700 flex items-center gap-2 transition-colors font-semibold">
            <Download size={18} />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-japura-grey" />
          <h3 className="text-sm font-bold text-japura-dark uppercase">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-japura-grey mb-2">Filial</label>
            <select
              value={selectedFilial}
              onChange={(e) => setSelectedFilial(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-japura focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
            <label className="block text-xs font-semibold text-japura-grey mb-2">Prioridade</label>
            <select 
              value={selectedPrioridade}
              onChange={(e) => setSelectedPrioridade(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-japura focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="todas">Todas</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-japura hover:bg-orange-700 transition-colors font-semibold">
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-japura shadow-sm border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500 rounded-lg text-white shadow-md">
              <Package size={24} />
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-200 px-2 py-1 rounded">
              {kpis.total}
            </span>
          </div>
          <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">Sugestões Geradas</p>
          <p className="text-3xl font-black text-japura-black">{kpis.total}</p>
          <p className="text-xs text-orange-600 mt-2">Filtradas</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-japura shadow-sm border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-lg text-white shadow-md">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded">
              {kpis.aprovadas}
            </span>
          </div>
          <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Aprovadas</p>
          <p className="text-3xl font-black text-japura-black">{kpis.aprovadas}</p>
          <p className="text-xs text-green-600 mt-2">
            {kpis.total > 0 ? Math.round((kpis.aprovadas / kpis.total) * 100) : 0}% do total
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-japura shadow-sm border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-lg text-white shadow-md">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-200 px-2 py-1 rounded">
              {kpis.altaPrioridade}
            </span>
          </div>
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Economia Estimada</p>
          <p className="text-3xl font-black text-japura-black">
            R$ {(kpis.economia / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-blue-600 mt-2">Com otimização</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-japura shadow-sm border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-lg text-white shadow-md">
              <AlertCircle size={24} />
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-200 px-2 py-1 rounded">
              {kpis.altaPrioridade}
            </span>
          </div>
          <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">Alta Prioridade</p>
          <p className="text-3xl font-black text-japura-black">{kpis.altaPrioridade}</p>
          <p className="text-xs text-purple-600 mt-2">Requerem atenção</p>
        </div>
      </div>

      {/* Gráfico de Estoque por Filial */}
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-japura-black flex items-center gap-2">
            <BarChart3 size={20} />
            Estoque por Filial
          </h3>
        </div>
        <div className="space-y-3">
          {estoquePorFilial.map((item, index) => (
            <div key={item.filial} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-japura-dark">{item.filial}</span>
                <span className="text-japura-grey tabular-nums">
                  {item.estoqueTotal.toLocaleString('pt-BR')} unidades
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(item.estoqueTotal / maxEstoque) * 100}%` }}
                />
              </div>
              {item.produtosCriticos > 0 && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {item.produtosCriticos} produto(s) com risco de ruptura
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Sugestões */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-japura-black">Sugestões de Distribuição</h3>
          <span className="text-sm text-japura-grey">
            Mostrando {sugestoesFiltradas.length} de {sugestoes.length} sugestões
          </span>
        </div>
        {sugestoesFiltradas.map((sugestao) => {
          const isAprovada = aprovadas.has(sugestao.id);
          return (
            <div
              key={sugestao.id}
              className={`bg-japura-white rounded-japura shadow-sm border-2 p-6 transition-all ${
                isAprovada 
                  ? 'border-green-300 bg-green-50/30' 
                  : `border-${sugestao.prioridade === 'alta' ? 'red' : sugestao.prioridade === 'media' ? 'yellow' : 'green'}-200`
              } hover:shadow-md`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-black text-japura-black">{sugestao.produto}</h3>
                    <span className="text-sm text-japura-grey">({sugestao.sku})</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPrioridadeColor(sugestao.prioridade)}`}>
                      Prioridade {sugestao.prioridade.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                      {sugestao.categoria}
                    </span>
                    {isAprovada && (
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Aprovada
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-semibold text-japura-grey uppercase mb-1">Origem</p>
                      <p className="text-sm font-semibold text-japura-black flex items-center gap-1">
                        <ArrowLeftRight size={14} />
                        {sugestao.filialOrigem}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-japura-grey uppercase mb-1">Destino</p>
                      <p className="text-sm font-semibold text-japura-black flex items-center gap-1">
                        <MapPin size={14} />
                        {sugestao.filialDestino}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-japura-grey uppercase mb-1">Quantidade</p>
                      <p className="text-sm font-black text-japura-black">{sugestao.quantidade.toLocaleString('pt-BR')} unidades</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-japura-grey uppercase mb-1">Estoque Atual</p>
                      <p className="text-sm text-japura-dark">{sugestao.estoqueAtual.toLocaleString('pt-BR')} unidades</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-xs font-semibold text-japura-grey uppercase mb-1">Justificativa</p>
                    <p className="text-sm text-japura-dark">{sugestao.justificativa}</p>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="flex items-center gap-2 text-japura-grey">
                        <TrendingUp size={14} />
                        <span>Vendas médias: {sugestao.vendasMedias.toLocaleString('pt-BR')}/mês</span>
                      </div>
                      <div className="flex items-center gap-2 text-japura-grey">
                        <Package size={14} />
                        <span>Estoque atual: {sugestao.estoqueAtual.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp size={14} />
                        <span>Economia: R$ {(sugestao.economiaEstimada / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex items-center gap-2 text-japura-grey">
                        <Truck size={14} />
                        <span>Trânsito: {sugestao.tempoTransito} dias</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-6 flex flex-col gap-2">
                  {!isAprovada ? (
                    <>
                      <button 
                        onClick={() => handleAprovar(sugestao.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-japura hover:bg-green-700 flex items-center gap-2 transition-colors font-semibold shadow-sm"
                      >
                        <CheckCircle2 size={18} />
                        <span>Aprovar</span>
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-japura hover:bg-gray-50 flex items-center gap-2 transition-colors">
                        <AlertCircle size={18} />
                        <span>Revisar</span>
                      </button>
                    </>
                  ) : (
                    <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-japura flex items-center gap-2 cursor-not-allowed">
                      <CheckCircle2 size={18} />
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
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-black text-japura-black mb-4 flex items-center gap-2">
          <MapPin size={20} />
          Mapa de Distribuição
        </h3>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <MapPin size={48} className="mx-auto text-japura-grey mb-2" />
            <p className="text-japura-grey font-semibold">Mapa interativo será implementado aqui</p>
            <p className="text-xs text-japura-grey mt-2">Visualização geográfica das rotas de distribuição</p>
          </div>
        </div>
      </div>
    </div>
  );
}
