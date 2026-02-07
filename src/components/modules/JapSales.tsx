'use client';

import { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Store, 
  DollarSign,
  Calendar,
  Edit,
  Send,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import KpiCard from '@/components/ui/KpiCard';

interface Meta {
  id: string;
  tipo: 'mensal' | 'semanal';
  periodo: string;
  loja?: string;
  vendedor?: string;
  equipe?: string;
  canal?: string;
  valor: number;
  atingido: number;
  percentual: number;
  status: 'aprovada' | 'pendente' | 'enviada';
}

export default function JapSales() {
  const [viewMode, setViewMode] = useState<'visualizacao' | 'edicao'>('visualizacao');
  const [filtroVisualizacao, setFiltroVisualizacao] = useState<'diretor' | 'equipe' | 'loja' | 'vendedor' | 'canal'>('diretor');

  const metas: Meta[] = [
    {
      id: '1',
      tipo: 'mensal',
      periodo: 'Janeiro 2025',
      loja: 'Manaus Centro',
      valor: 2500000,
      atingido: 2175000,
      percentual: 87,
      status: 'aprovada'
    },
    {
      id: '2',
      tipo: 'mensal',
      periodo: 'Janeiro 2025',
      loja: 'Manaus Cidade Nova',
      valor: 1800000,
      atingido: 1620000,
      percentual: 90,
      status: 'aprovada'
    },
    {
      id: '3',
      tipo: 'semanal',
      periodo: 'Semana 04/2025',
      vendedor: 'João Silva',
      equipe: 'Atacado Norte',
      valor: 450000,
      atingido: 382500,
      percentual: 85,
      status: 'aprovada'
    },
    {
      id: '4',
      tipo: 'mensal',
      periodo: 'Fevereiro 2025',
      canal: 'Varejo',
      valor: 3200000,
      atingido: 0,
      percentual: 0,
      status: 'pendente'
    },
  ];

  const performanceData = [
    { diretor: 'Carlos Mendes', faturamento: 12500000, meta: 12000000, atingimento: 104 },
    { diretor: 'Ana Paula', faturamento: 9800000, meta: 10000000, atingimento: 98 },
    { diretor: 'Roberto Santos', faturamento: 11200000, meta: 11000000, atingimento: 102 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada':
        return 'bg-gray-100 text-japura-black border-gray-400';
      case 'pendente':
        return 'bg-japura-bg text-japura-dark border-gray-400';
      case 'enviada':
        return 'bg-gray-100 text-japura-dark border-gray-400';
      default:
        return 'bg-gray-100 text-japura-grey border-gray-300';
    }
  };

  const getAtingimentoColor = (percentual: number) => {
    if (percentual >= 100) return 'text-japura-black';
    if (percentual >= 80) return 'text-japura-dark';
    return 'text-japura-grey';
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-end pb-3 border-b border-gray-400">
        <div>
          <h1 className="text-lg font-semibold text-japura-black mb-1">JapSales</h1>
          <p className="text-xs text-japura-grey">Metas, Performance e Direcionamento Comercial</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'visualizacao' ? 'edicao' : 'visualizacao')}
            className="px-3 py-1.5 bg-japura-dark hover:bg-japura-black text-white rounded text-sm font-medium flex items-center gap-2"
          >
            {viewMode === 'visualizacao' ? <Edit size={14} /> : <Target size={14} />}
            <span>{viewMode === 'visualizacao' ? 'Editar Metas' : 'Visualizar'}</span>
          </button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <KpiCard
          title="Faturamento Total"
          value="R$ 33.5M"
          icon={DollarSign}
          trend={{ value: '+12% vs mês anterior', icon: TrendingUp }}
        />
        <KpiCard
          title="Meta Mensal"
          value="R$ 35.0M"
          icon={Target}
          progress={96}
        />
        <KpiCard
          title="Atingimento Médio"
          value="94%"
          icon={TrendingUp}
        />
        <KpiCard
          title="Equipes Ativas"
          value="12"
          icon={Users}
        />
      </div>

      {/* Filtros de Visualização */}
      <div className="bg-japura-white rounded border border-gray-400 p-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-japura-dark">Visualizar por:</span>
          <div className="flex gap-1">
            {(['diretor', 'equipe', 'loja', 'vendedor', 'canal'] as const).map((filtro) => (
              <button
                key={filtro}
                onClick={() => setFiltroVisualizacao(filtro)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  filtroVisualizacao === filtro
                    ? 'bg-japura-dark text-white'
                    : 'bg-japura-bg text-japura-dark hover:bg-gray-200 border border-gray-400'
                }`}
              >
                {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Performance por Diretor */}
      {filtroVisualizacao === 'diretor' && (
        <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
          <div className="p-2 border-b border-gray-400 bg-gray-200 flex items-center justify-between">
            <h3 className="text-base font-semibold text-japura-black">Performance por Diretor</h3>
            <button className="px-2 py-1 border border-gray-400 rounded hover:bg-white text-xs flex items-center gap-1">
              <Download size={12} />
              Exportar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200 border-b border-gray-400">
                  <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase border-r border-gray-400">Diretor</th>
                  <th className="px-2 py-1 text-right text-xs font-semibold text-japura-grey uppercase border-r border-gray-400">Faturamento</th>
                  <th className="px-2 py-1 text-right text-xs font-semibold text-japura-grey uppercase border-r border-gray-400">Meta</th>
                  <th className="px-2 py-1 text-right text-xs font-semibold text-japura-grey uppercase">Atingimento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {performanceData.map((item, index) => (
                  <tr key={index} className={`hover:bg-japura-bg ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-2 py-1 text-xs font-semibold text-japura-black border-r border-gray-300">{item.diretor}</td>
                    <td className="px-2 py-1 text-xs text-right text-japura-black tabular-nums border-r border-gray-300">R$ {item.faturamento.toLocaleString('pt-BR')}</td>
                    <td className="px-2 py-1 text-xs text-right text-japura-grey tabular-nums border-r border-gray-300">R$ {item.meta.toLocaleString('pt-BR')}</td>
                    <td className="px-2 py-1 text-right">
                      <span className={`text-xs font-semibold ${getAtingimentoColor(item.atingimento)}`}>{item.atingimento}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Metas Cadastradas */}
      <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
        <div className="p-2 border-b border-gray-400 bg-gray-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-japura-black">Metas Cadastradas</h3>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-gray-400 rounded hover:bg-white text-xs flex items-center gap-1">
              <Filter size={12} />
              Filtrar
            </button>
            <button className="px-2 py-1 border border-gray-400 rounded hover:bg-white text-xs flex items-center gap-1">
              <Download size={12} />
              Exportar
            </button>
            {viewMode === 'edicao' && (
              <button className="px-3 py-1.5 bg-japura-dark hover:bg-japura-black text-white rounded text-xs font-medium flex items-center gap-1">
                <Send size={12} />
                Enviar Metas ao JapHub
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 border-b border-gray-400">
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase border-r border-gray-400">Tipo</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase border-r border-gray-400">Período</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase border-r border-gray-400">Segmento</th>
                <th className="px-2 py-1 text-right text-xs font-semibold text-japura-grey uppercase border-r border-gray-400">Meta (R$)</th>
                <th className="px-2 py-1 text-right text-xs font-semibold text-japura-grey uppercase border-r border-gray-400">Atingido (R$)</th>
                <th className="px-2 py-1 text-right text-xs font-semibold text-japura-grey uppercase border-r border-gray-400">%</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {metas.map((meta, index) => (
                <tr key={meta.id} className={`hover:bg-japura-bg ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-2 py-1 text-xs font-semibold text-japura-black border-r border-gray-300">{meta.tipo === 'mensal' ? 'Mensal' : 'Semanal'}</td>
                  <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">{meta.periodo}</td>
                  <td className="px-2 py-1 text-xs text-japura-dark border-r border-gray-300">{meta.loja || meta.vendedor || meta.equipe || meta.canal || '-'}</td>
                  <td className="px-2 py-1 text-xs text-right text-japura-black tabular-nums border-r border-gray-300">R$ {meta.valor.toLocaleString('pt-BR')}</td>
                  <td className="px-2 py-1 text-xs text-right text-japura-dark tabular-nums border-r border-gray-300">R$ {meta.atingido.toLocaleString('pt-BR')}</td>
                  <td className="px-2 py-1 text-right border-r border-gray-300">
                    <span className={`text-xs font-semibold ${getAtingimentoColor(meta.percentual)}`}>{meta.percentual}%</span>
                  </td>
                  <td className="px-2 py-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(meta.status)}`}>
                      {meta.status === 'aprovada' && <CheckCircle2 size={10} className="mr-1" />}
                      {meta.status === 'pendente' && <AlertCircle size={10} className="mr-1" />}
                      {meta.status.charAt(0).toUpperCase() + meta.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histórico de Alterações */}
      <div className="bg-japura-white rounded border border-gray-400 p-3">
        <h3 className="text-base font-semibold text-japura-black mb-2">Histórico de Alterações</h3>
        <div className="space-y-2">
          <div className="p-2 bg-japura-bg rounded border-l-2 border-japura-dark">
            <p className="text-xs font-semibold text-japura-black">Meta de Fevereiro 2025 criada</p>
            <p className="text-[11px] text-japura-grey mt-0.5">Canal Varejo • R$ 3.200.000,00 • Por: Carlos Mendes • 25/01/2025 14:30</p>
          </div>
          <div className="p-2 bg-gray-50 rounded border-l-2 border-gray-400">
            <p className="text-xs font-semibold text-japura-black">Meta de Janeiro 2025 aprovada</p>
            <p className="text-[11px] text-japura-grey mt-0.5">Manaus Centro • R$ 2.500.000,00 • Por: Ana Paula • 20/01/2025 10:15</p>
          </div>
        </div>
      </div>
    </div>
  );
}
