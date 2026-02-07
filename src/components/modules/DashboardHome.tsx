'use client';

import { Package, CheckCircle2, Clock, BarChart3, ChevronRight, FileText, User, RefreshCw, Calendar, LayoutGrid, Settings, TrendingUp, DollarSign, AlertCircle, Ship, X, Download } from 'lucide-react';
import KpiCard from '@/components/ui/KpiCard';
import DollarWidget from '@/components/ui/DollarWidget';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Pimp {
  id: string;
  numero: string;
  fornecedor: string;
  produto: string;
  dataPrevista: string;
  status: string;
  diasRestantes: number;
  valorUsd: number;
  valorBrl: number;
}

interface RecentChange {
  id: number;
  action: string;
  module: string;
  user: string;
  time: string;
  type: 'create' | 'update' | 'delete' | 'import';
}

interface DashboardData {
  executivo: { title: string; kpis: any[]; description: string };
  logistica: { title: string; kpis: any[]; description: string };
  comercial: { title: string; kpis: any[]; description: string };
  financeiro: { title: string; kpis: any[]; description: string };
}

export default function DashboardHome() {
  const [selectedDashboard, setSelectedDashboard] = useState('executivo');
  const [showSettings, setShowSettings] = useState(false);
  const [showDashboardMenu, setShowDashboardMenu] = useState(false);

  const pimpsAtivos = 18;
  const pimpsFinalizados = 42;
  const faturamentoMensal = 33500000;
  const metaMensal = 35000000;
  const atingimentoMeta = Math.round((faturamentoMensal / metaMensal) * 100);
  
  const pimpsProximos: Pimp[] = [
    { id: '1', numero: 'PIMP-2025-001', fornecedor: 'Continental AG', produto: 'Pneu 205/55R16 91V', dataPrevista: '2025-02-05', status: 'Em Trânsito', diasRestantes: 15, valorUsd: 125000, valorBrl: 660000 },
    { id: '2', numero: 'PIMP-2025-015', fornecedor: 'Michelin', produto: 'Pneu 185/65R15 88H', dataPrevista: '2025-02-12', status: 'Em Porto', diasRestantes: 22, valorUsd: 89000, valorBrl: 469920 },
    { id: '3', numero: 'PIMP-2025-008', fornecedor: 'Bridgestone', produto: 'Pneu 225/50R17 98Y', dataPrevista: '2025-02-18', status: 'Aguardando Embarque', diasRestantes: 28, valorUsd: 95000, valorBrl: 501600 },
  ];

  const calendarEvents = [
    { id: 1, title: 'Reunião de Diretoria', time: '09:00', date: 'Hoje', type: 'meeting', location: 'Sala de Reuniões' },
    { id: 2, title: 'Apresentação de Resultados Q1', time: '14:00', date: 'Hoje', type: 'presentation', location: 'Auditório' },
    { id: 3, title: 'Revisão de Metas Comerciais', time: '10:00', date: 'Amanhã', type: 'review', location: 'Sala Executiva' },
    { id: 4, title: 'Reunião com Fornecedores', time: '15:30', date: 'Amanhã', type: 'meeting', location: 'Sala de Reuniões' },
  ];

  const recentChanges: RecentChange[] = [
    { id: 1, action: 'PIMP-2025-001 atualizado', module: 'Importação', user: 'Marcus Silva', time: 'Há 15 min', type: 'update' },
    { id: 2, action: 'Nova glosa identificada - NF-2025-001234', module: 'Auditoria', user: 'Sistema', time: 'Há 32 min', type: 'create' },
    { id: 3, action: 'Ficha técnica criada - Pneu 205/55R16', module: 'Catálogo', user: 'Márcio Santos', time: 'Há 1h', type: 'create' },
    { id: 4, action: 'Preço atualizado - 12 produtos', module: 'Mercado', user: 'Sistema', time: 'Há 2h', type: 'update' },
    { id: 5, action: 'Importação concluída - PIMP-2024-150', module: 'Importação', user: 'Sistema', time: 'Há 3h', type: 'import' },
    { id: 6, action: 'Nova meta definida - Equipe Manaus', module: 'Vendas', user: 'Ana Paula', time: 'Há 4h', type: 'create' },
    { id: 7, action: 'Distribuição aprovada - 500 unidades', module: 'Distribuição', user: 'Carlos Mendes', time: 'Há 5h', type: 'update' },
  ];

  const dashboardData: DashboardData = {
    executivo: { title: 'Visão Executiva', description: 'Indicadores estratégicos', kpis: [
      { label: 'Faturamento Total', value: 'R$ 33.5M', trend: '+12%' },
      { label: 'Meta Atingida', value: '96%', trend: '+3%' },
      { label: 'PIMPs Ativos', value: '18', trend: 'Em trânsito' },
      { label: 'Clientes Ativos', value: '1.247', trend: '+8%' },
    ]},
    logistica: { title: 'Logística', description: 'Estoque e distribuição', kpis: [
      { label: 'Estoque Total', value: '12.500 un', trend: 'Estável' },
      { label: 'PIMPs em Trânsito', value: '12', trend: 'Aguardando' },
      { label: 'Sugestões Distribuição', value: '2', trend: 'Pendentes' },
      { label: 'Economia Estimada', value: 'R$ 45K', trend: 'Otimização' },
    ]},
    comercial: { title: 'Comercial', description: 'Vendas e metas', kpis: [
      { label: 'Faturamento Mensal', value: 'R$ 33.5M', trend: '+12%' },
      { label: 'Ticket Médio', value: 'R$ 36.2K', trend: '+5%' },
      { label: 'Vendedores Ativos', value: '15', trend: '100%' },
      { label: 'Novos Clientes', value: '45', trend: 'Este mês' },
    ]},
    financeiro: { title: 'Financeiro', description: 'Fluxo e receitas', kpis: [
      { label: 'Receita Bruta', value: 'R$ 33.5M', trend: '+12%' },
      { label: 'Glosas Pendentes', value: 'R$ 14.050', trend: '2 casos' },
      { label: 'Savings Identificados', value: 'R$ 211.816', trend: '+8%' },
      { label: 'Taxa Conformidade', value: '98.5%', trend: 'Excelente' },
    ]},
  };

  const getChangeIcon = (type: RecentChange['type']) => {
    switch (type) {
      case 'create': return FileText;
      case 'update': return RefreshCw;
      case 'delete': return AlertCircle;
      case 'import': return Package;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-2">
      {/* Header - compacto */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-400">
        <div>
          <h1 className="text-lg font-semibold text-japura-black">Painel de Atualizações</h1>
          <p className="text-xs text-japura-grey">Resumo executivo • Janeiro 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-japura-grey flex items-center gap-1">
            <Clock size={12} />
            {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <div className="relative">
            <button 
              onClick={() => setShowDashboardMenu(!showDashboardMenu)}
              className="px-2 py-1 border border-gray-400 rounded text-xs flex items-center gap-1 hover:bg-japura-bg"
            >
              <LayoutGrid size={12} />
              Dashboards
            </button>
            <AnimatePresence>
              {showDashboardMenu && (
                <div className="absolute top-full right-0 mt-1 bg-japura-white rounded border border-gray-400 p-1 z-50 min-w-[140px] shadow-sm">
                  {['executivo', 'logistica', 'comercial', 'financeiro'].map((d) => (
                    <button
                      key={d}
                      onClick={() => { setSelectedDashboard(d); setShowDashboardMenu(false); }}
                      className={`w-full text-left px-2 py-1 rounded text-xs ${
                        selectedDashboard === d ? 'bg-japura-dark text-white' : 'hover:bg-japura-bg text-japura-dark'
                      }`}
                    >
                      {d === 'executivo' ? 'Executivo' : d === 'logistica' ? 'Logística' : d === 'comercial' ? 'Comercial' : 'Financeiro'}
                    </button>
                  ))}
                </div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`px-2 py-1 border border-gray-400 rounded text-xs flex items-center gap-1 ${showSettings ? 'bg-japura-dark text-white' : 'hover:bg-japura-bg'}`}
            >
              <Settings size={12} />
              Configurar
            </button>
          </div>
        </div>
      </div>

      {/* Configurações */}
      <AnimatePresence>
        {showSettings && (
          <div className="bg-japura-white rounded border border-gray-400 p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-japura-black">Configurações</h3>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-japura-bg rounded">
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-japura-grey mb-1">Widgets</label>
                {['Dólar', 'PIMPs', 'Compromissos', 'Alterações'].map((w) => (
                  <label key={w} className="flex items-center gap-1"><input type="checkbox" defaultChecked className="rounded" /><span>{w}</span></label>
                ))}
              </div>
              <div>
                <label className="block text-japura-grey mb-1">Notificações</label>
                {['Email', 'Push', 'SMS'].map((n) => (
                  <label key={n} className="flex items-center gap-1"><input type="checkbox" defaultChecked={n === 'Email'} className="rounded" /><span>{n}</span></label>
                ))}
              </div>
              <div>
                <label className="block text-japura-grey mb-1">Atualização</label>
                <select className="w-full px-2 py-1 border border-gray-400 rounded text-xs">
                  <option>5 min</option><option>15 min</option><option>30 min</option><option>1h</option>
                </select>
              </div>
            </div>
            <div className="mt-2 flex justify-end gap-1">
              <button onClick={() => setShowSettings(false)} className="px-2 py-1 border border-gray-400 rounded text-xs hover:bg-japura-bg">Cancelar</button>
              <button onClick={() => { alert('Salvo'); setShowSettings(false); }} className="px-2 py-1 bg-japura-dark text-white rounded text-xs">Salvar</button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Tabs de dashboard */}
      <div className="flex gap-1">
        {['executivo', 'logistica', 'comercial', 'financeiro'].map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDashboard(d)}
            className={`px-2 py-1 rounded text-xs font-medium border ${
              selectedDashboard === d ? 'bg-japura-dark text-white border-japura-dark' : 'border-gray-400 text-japura-dark hover:bg-japura-bg'
            }`}
          >
            {d === 'executivo' ? 'Executivo' : d === 'logistica' ? 'Logística' : d === 'comercial' ? 'Comercial' : 'Financeiro'}
          </button>
        ))}
      </div>

      {/* Linha: Dólar + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        <div className="lg:col-span-1">
          <DollarWidget />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-2">
          <KpiCard title="PIMPs Ativos" value={pimpsAtivos.toString()} icon={Package} trend={{ value: 'Em trânsito', icon: Ship }} />
          <KpiCard title="PIMPs Finalizados" value={pimpsFinalizados.toString()} icon={CheckCircle2} trend={{ value: 'Este mês', icon: CheckCircle2 }} />
          <KpiCard title="Faturamento Mensal" value={`R$ ${(faturamentoMensal / 1000000).toFixed(1)}M`} icon={DollarSign} trend={{ value: `${atingimentoMeta}% meta`, icon: TrendingUp }} progress={atingimentoMeta} />
        </div>
      </div>

      {/* Grid principal: PIMPs tabela + Compromissos + KPIs dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Coluna 1: PIMPs em tabela + Dashboard KPIs */}
        <div className="lg:col-span-2 space-y-2">
          {/* PIMPs - tabela densa estilo Excel */}
          <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
            <div className="flex justify-between items-center px-2 py-1.5 border-b border-gray-400 bg-japura-bg">
              <h2 className="text-sm font-semibold text-japura-black">PIMPs Mais Próximos</h2>
              <button onClick={() => alert('JapImport')} className="text-xs text-japura-dark hover:text-japura-black flex items-center gap-0.5">
                Ver todos <ChevronRight size={12} />
              </button>
            </div>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-200 border-b border-gray-400">
                  <th className="px-2 py-1.5 text-left font-semibold text-japura-dark border-r border-gray-400">PIMP</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-japura-dark border-r border-gray-400">Fornecedor</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-japura-dark border-r border-gray-400">Produto</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-japura-dark border-r border-gray-400">Status</th>
                  <th className="px-2 py-1.5 text-right font-semibold text-japura-dark border-r border-gray-400">USD</th>
                  <th className="px-2 py-1.5 text-right font-semibold text-japura-dark border-r border-gray-400">BRL</th>
                  <th className="px-2 py-1.5 text-center font-semibold text-japura-dark">Dias</th>
                </tr>
              </thead>
              <tbody>
                {pimpsProximos.map((pimp, i) => (
                  <tr 
                    key={pimp.id} 
                    onClick={() => alert(pimp.numero)}
                    className={`cursor-pointer hover:bg-japura-bg ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/80'}`}
                  >
                    <td className="px-2 py-1 border-r border-gray-300 font-medium">{pimp.numero}</td>
                    <td className="px-2 py-1 border-r border-gray-300">{pimp.fornecedor}</td>
                    <td className="px-2 py-1 border-r border-gray-300 text-japura-grey">{pimp.produto}</td>
                    <td className="px-2 py-1 border-r border-gray-300">
                      <span className="px-1.5 py-0.5 rounded bg-japura-bg text-japura-dark border border-gray-300">{pimp.status}</span>
                    </td>
                    <td className="px-2 py-1 border-r border-gray-300 text-right tabular-nums">${(pimp.valorUsd/1000).toFixed(0)}K</td>
                    <td className="px-2 py-1 border-r border-gray-300 text-right tabular-nums">R$ {(pimp.valorBrl/1000).toFixed(0)}K</td>
                    <td className="px-2 py-1 text-center font-semibold tabular-nums">{pimp.diasRestantes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* KPIs do dashboard selecionado - grid denso */}
          <div className="bg-japura-white rounded border border-gray-400 p-2">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-sm font-semibold text-japura-black">{dashboardData[selectedDashboard as keyof DashboardData].title}</h2>
                <p className="text-[11px] text-japura-grey">{dashboardData[selectedDashboard as keyof DashboardData].description}</p>
              </div>
              <button onClick={() => alert('Exportar')} className="px-2 py-1 border border-gray-400 rounded text-xs flex items-center gap-1 hover:bg-japura-bg">
                <Download size={12} /> Exportar
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {dashboardData[selectedDashboard as keyof DashboardData].kpis.map((kpi, i) => (
                <div key={i} className="p-2 bg-japura-bg rounded border border-gray-300">
                  <p className="text-[11px] text-japura-grey">{kpi.label}</p>
                  <p className="text-sm font-semibold text-japura-black">{kpi.value}</p>
                  <p className="text-[10px] text-japura-grey">{kpi.trend}</p>
                </div>
              ))}
            </div>
            <div className="h-24 flex items-center justify-center bg-japura-bg rounded border border-dashed border-gray-400">
              <div className="text-center text-japura-grey">
                <BarChart3 size={24} className="mx-auto mb-1" />
                <p className="text-[11px]">Gráfico será implementado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Compromissos */}
        <div className="space-y-2">
          <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
            <div className="px-2 py-1.5 border-b border-gray-400 bg-japura-bg flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-japura-dark" />
                <h2 className="text-sm font-semibold text-japura-black">Compromissos</h2>
              </div>
              <button onClick={() => alert('Calendário')} className="text-[11px] text-japura-dark hover:text-japura-black">Ver →</button>
            </div>
            <div className="divide-y divide-gray-300">
              {calendarEvents.map((e) => (
                <div key={e.id} onClick={() => alert(e.title)} className="px-2 py-1.5 hover:bg-japura-bg cursor-pointer">
                  <p className="text-xs font-medium text-japura-black">{e.title}</p>
                  <p className="text-[11px] text-japura-grey">{e.time} • {e.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Últimas Alterações - tabela Excel */}
      <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
        <div className="px-2 py-1.5 border-b border-gray-400 bg-japura-bg flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-japura-dark" />
            <h2 className="text-sm font-semibold text-japura-black">Últimas Alterações</h2>
          </div>
          <button onClick={() => alert('Log')} className="text-[11px] text-japura-dark hover:text-japura-black">Ver log →</button>
        </div>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-400">
              <th className="px-2 py-1 text-left font-semibold text-japura-dark border-r border-gray-400 w-10">Tipo</th>
              <th className="px-2 py-1 text-left font-semibold text-japura-dark border-r border-gray-400">Ação</th>
              <th className="px-2 py-1 text-left font-semibold text-japura-dark border-r border-gray-400 w-24">Módulo</th>
              <th className="px-2 py-1 text-left font-semibold text-japura-dark border-r border-gray-400 w-24">Usuário</th>
              <th className="px-2 py-1 text-left font-semibold text-japura-dark w-20">Horário</th>
            </tr>
          </thead>
          <tbody>
            {recentChanges.map((c, i) => {
              const Icon = getChangeIcon(c.type);
              return (
                <tr 
                  key={c.id} 
                  onClick={() => alert(c.action)}
                  className={`cursor-pointer hover:bg-japura-bg ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/80'}`}
                >
                  <td className="px-2 py-1 border-r border-gray-300">
                    <div className="inline-flex p-1 rounded bg-japura-bg border border-gray-300">
                      <Icon size={12} className="text-japura-dark" />
                    </div>
                  </td>
                  <td className="px-2 py-1 border-r border-gray-300 font-medium">{c.action}</td>
                  <td className="px-2 py-1 border-r border-gray-300 text-japura-grey">{c.module}</td>
                  <td className="px-2 py-1 border-r border-gray-300 text-japura-grey flex items-center gap-1">
                    <User size={10} />{c.user}
                  </td>
                  <td className="px-2 py-1 text-japura-grey tabular-nums">{c.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
