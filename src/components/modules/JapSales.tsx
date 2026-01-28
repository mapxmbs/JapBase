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
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'enviada':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAtingimentoColor = (percentual: number) => {
    if (percentual >= 100) return 'text-green-700';
    if (percentual >= 80) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end pb-4 border-b border-gray-300">
        <div>
          <h1 className="text-4xl font-black text-japura-black mb-2">JapSales</h1>
          <p className="text-japura-grey">Metas, Performance e Direcionamento Comercial</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'visualizacao' ? 'edicao' : 'visualizacao')}
            className="px-4 py-2 bg-japura-dark hover:bg-japura-black text-white rounded-lg transition-colors text-sm font-semibold flex items-center gap-2"
          >
            {viewMode === 'visualizacao' ? <Edit size={16} /> : <Target size={16} />}
            <span>{viewMode === 'visualizacao' ? 'Editar Metas' : 'Visualizar'}</span>
          </button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Faturamento Total"
          value="R$ 33.5M"
          icon={DollarSign}
          iconBgColor="bg-green-100"
          iconColor="text-green-700"
          trend={{
            value: '+12% vs mês anterior',
            color: 'text-green-700',
            icon: TrendingUp,
          }}
          delay={0}
        />
        <KpiCard
          title="Meta Mensal"
          value="R$ 35.0M"
          icon={Target}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-700"
          progress={96}
          delay={0.1}
        />
        <KpiCard
          title="Atingimento Médio"
          value="94%"
          icon={TrendingUp}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-700"
          delay={0.2}
        />
        <KpiCard
          title="Equipes Ativas"
          value="12"
          icon={Users}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-700"
          delay={0.3}
        />
      </div>

      {/* Filtros de Visualização */}
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-300 p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-japura-dark">Visualizar por:</span>
          <div className="flex gap-2">
            {(['diretor', 'equipe', 'loja', 'vendedor', 'canal'] as const).map((filtro) => (
              <button
                key={filtro}
                onClick={() => setFiltroVisualizacao(filtro)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  filtroVisualizacao === filtro
                    ? 'bg-japura-dark text-white'
                    : 'bg-gray-100 text-japura-dark hover:bg-gray-200'
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
        <div className="bg-japura-white rounded-japura shadow-sm border border-gray-300 overflow-hidden">
          <div className="p-4 border-b border-gray-300 bg-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-black text-japura-black">Performance por Diretor</h3>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white text-sm flex items-center gap-2">
              <Download size={14} />
              Exportar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="px-4 py-3 text-left text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                    Diretor
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                    Faturamento
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                    Meta
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-japura-dark uppercase tracking-wider">
                    Atingimento
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {performanceData.map((item, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-japura-bg transition-colors ${
                      index % 2 === 0 ? 'bg-japura-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-japura-black border-r border-gray-200">
                      {item.diretor}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-japura-black tabular-nums border-r border-gray-200">
                      R$ {item.faturamento.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-japura-grey tabular-nums border-r border-gray-200">
                      R$ {item.meta.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${getAtingimentoColor(item.atingimento)}`}>
                        {item.atingimento}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Metas Cadastradas */}
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-300 overflow-hidden">
        <div className="p-4 border-b border-gray-300 bg-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-black text-japura-black">Metas Cadastradas</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white text-sm flex items-center gap-2">
              <Filter size={14} />
              Filtrar
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white text-sm flex items-center gap-2">
              <Download size={14} />
              Exportar
            </button>
            {viewMode === 'edicao' && (
              <button className="px-4 py-1.5 bg-japura-dark hover:bg-japura-black text-white rounded-lg text-sm font-semibold flex items-center gap-2">
                <Send size={14} />
                Enviar Metas ao JapHub
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300">
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                  Período
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                  Segmento
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                  Meta (R$)
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                  Atingido (R$)
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                  %
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-dark uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {metas.map((meta, index) => (
                <tr
                  key={meta.id}
                  className={`hover:bg-japura-bg transition-colors ${
                    index % 2 === 0 ? 'bg-japura-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-semibold text-japura-black border-r border-gray-200">
                    {meta.tipo === 'mensal' ? 'Mensal' : 'Semanal'}
                  </td>
                  <td className="px-4 py-3 text-sm text-japura-dark border-r border-gray-200">
                    {meta.periodo}
                  </td>
                  <td className="px-4 py-3 text-sm text-japura-dark border-r border-gray-200">
                    {meta.loja || meta.vendedor || meta.equipe || meta.canal || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-japura-black tabular-nums border-r border-gray-200">
                    R$ {meta.valor.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-japura-dark tabular-nums border-r border-gray-200">
                    R$ {meta.atingido.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right border-r border-gray-200">
                    <span className={`text-sm font-bold ${getAtingimentoColor(meta.percentual)}`}>
                      {meta.percentual}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor(meta.status)}`}>
                      {meta.status === 'aprovada' && <CheckCircle2 size={12} className="mr-1" />}
                      {meta.status === 'pendente' && <AlertCircle size={12} className="mr-1" />}
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
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-300 p-6">
        <h3 className="text-lg font-black text-japura-black mb-4">Histórico de Alterações</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm font-semibold text-black">Meta de Fevereiro 2025 criada</p>
            <p className="text-xs text-japura-grey mt-1">Canal Varejo • R$ 3.200.000,00 • Por: Carlos Mendes • 25/01/2025 14:30</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
            <p className="text-sm font-semibold text-black">Meta de Janeiro 2025 aprovada</p>
            <p className="text-xs text-japura-grey mt-1">Manaus Centro • R$ 2.500.000,00 • Por: Ana Paula • 20/01/2025 10:15</p>
          </div>
        </div>
      </div>
    </div>
  );
}
