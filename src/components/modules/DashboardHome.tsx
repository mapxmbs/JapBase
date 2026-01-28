'use client';

import { Package, CheckCircle2, Clock, BarChart3, ChevronRight, FileText, User, RefreshCw, Calendar, LayoutGrid, Settings, TrendingUp, DollarSign, AlertCircle, Ship, X, Download } from 'lucide-react';
import KpiCard from '@/components/ui/KpiCard';
import DollarWidget from '@/components/ui/DollarWidget';
import AIAssistant from '@/components/ui/AIAssistant';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Dados fictícios mais completos
  const pimpsAtivos = 18;
  const pimpsFinalizados = 42;
  const faturamentoMensal = 33500000;
  const metaMensal = 35000000;
  const atingimentoMeta = Math.round((faturamentoMensal / metaMensal) * 100);
  
  const pimpsProximos: Pimp[] = [
    {
      id: '1',
      numero: 'PIMP-2025-001',
      fornecedor: 'Continental AG',
      produto: 'Pneu 205/55R16 91V',
      dataPrevista: '2025-02-05',
      status: 'Em Trânsito',
      diasRestantes: 15,
      valorUsd: 125000,
      valorBrl: 660000,
    },
    {
      id: '2',
      numero: 'PIMP-2025-015',
      fornecedor: 'Michelin',
      produto: 'Pneu 185/65R15 88H',
      dataPrevista: '2025-02-12',
      status: 'Em Porto',
      diasRestantes: 22,
      valorUsd: 89000,
      valorBrl: 469920,
    },
    {
      id: '3',
      numero: 'PIMP-2025-008',
      fornecedor: 'Bridgestone',
      produto: 'Pneu 225/50R17 98Y',
      dataPrevista: '2025-02-18',
      status: 'Aguardando Embarque',
      diasRestantes: 28,
      valorUsd: 95000,
      valorBrl: 501600,
    },
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
    executivo: {
      title: 'Visão Executiva',
      description: 'Indicadores estratégicos consolidados para a diretoria',
      kpis: [
        { label: 'Faturamento Total', value: 'R$ 33.5M', trend: '+12%' },
        { label: 'Meta Atingida', value: '96%', trend: '+3%' },
        { label: 'PIMPs Ativos', value: '18', trend: 'Em trânsito' },
        { label: 'Clientes Ativos', value: '1.247', trend: '+8%' },
      ],
    },
    logistica: {
      title: 'Dashboard de Logística',
      description: 'Estoque, distribuição e processos de importação',
      kpis: [
        { label: 'Estoque Total', value: '12.500 un', trend: 'Estável' },
        { label: 'PIMPs em Trânsito', value: '12', trend: 'Aguardando' },
        { label: 'Sugestões Distribuição', value: '2', trend: 'Pendentes' },
        { label: 'Economia Estimada', value: 'R$ 45K', trend: 'Otimização' },
      ],
    },
    comercial: {
      title: 'Dashboard Comercial',
      description: 'Vendas, metas e performance da equipe',
      kpis: [
        { label: 'Faturamento Mensal', value: 'R$ 33.5M', trend: '+12%' },
        { label: 'Ticket Médio', value: 'R$ 36.2K', trend: '+5%' },
        { label: 'Vendedores Ativos', value: '15', trend: '100%' },
        { label: 'Novos Clientes', value: '45', trend: 'Este mês' },
      ],
    },
    financeiro: {
      title: 'Dashboard Financeiro',
      description: 'Fluxo de caixa, receitas e despesas',
      kpis: [
        { label: 'Receita Bruta', value: 'R$ 33.5M', trend: '+12%' },
        { label: 'Glosas Pendentes', value: 'R$ 14.050', trend: '2 casos' },
        { label: 'Savings Identificados', value: 'R$ 211.816', trend: '+8%' },
        { label: 'Taxa Conformidade', value: '98.5%', trend: 'Excelente' },
      ],
    },
  };

  const getChangeIcon = (type: RecentChange['type']) => {
    switch (type) {
      case 'create':
        return FileText;
      case 'update':
        return RefreshCw;
      case 'delete':
        return AlertCircle;
      case 'import':
        return Package;
      default:
        return FileText;
    }
  };

  const getChangeColor = (type: RecentChange['type']) => {
    switch (type) {
      case 'create':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'delete':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'import':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const handleExport = () => {
    const data = dashboardData[selectedDashboard as keyof DashboardData];
    alert(`Exportando relatório: ${data.title}\n\nFormato: Excel\nDados: ${data.kpis.length} KPIs\nStatus: Processando...`);
  };

  const handlePimpClick = (pimp: Pimp) => {
    alert(`Detalhes do ${pimp.numero}:\n\nFornecedor: ${pimp.fornecedor}\nProduto: ${pimp.produto}\nValor USD: $${pimp.valorUsd.toLocaleString('pt-BR')}\nValor BRL: R$ ${pimp.valorBrl.toLocaleString('pt-BR')}\nChegada prevista: ${new Date(pimp.dataPrevista).toLocaleDateString('pt-BR')}\nStatus: ${pimp.status}\nDias restantes: ${pimp.diasRestantes}`);
  };

  const handleChangeClick = (change: RecentChange) => {
    alert(`Detalhes da Alteração:\n\nAção: ${change.action}\nMódulo: ${change.module}\nUsuário: ${change.user}\nHorário: ${change.time}\nTipo: ${change.type}`);
  };

  const handleCalendarClick = (event: typeof calendarEvents[0]) => {
    alert(`Compromisso: ${event.title}\n\nHorário: ${event.time}\nData: ${event.date}\nLocal: ${event.location}\nTipo: ${event.type}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end pb-4 border-b border-gray-300">
        <div>
          <h1 className="text-4xl font-black text-japura-black mb-2">Painel de Atualizações</h1>
          <p className="text-japura-grey">Resumo executivo consolidado • Janeiro 2025</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-japura-grey">
            <Clock size={16} />
            <span>{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => setShowDashboardMenu(!showDashboardMenu)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2 transition-colors"
            >
              <LayoutGrid size={16} />
              <span>Dashboards</span>
            </button>
            <AnimatePresence>
              {showDashboardMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 bg-japura-white rounded-lg shadow-lg border border-gray-300 p-2 z-50 min-w-[200px]"
                >
                  <div className="space-y-1">
                    {['executivo', 'logistica', 'comercial', 'financeiro'].map((dashboard) => (
                      <button
                        key={dashboard}
                        onClick={() => {
                          setSelectedDashboard(dashboard);
                          setShowDashboardMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          selectedDashboard === dashboard
                            ? 'bg-japura-dark text-white'
                            : 'hover:bg-gray-100 text-japura-dark'
                        }`}
                      >
                        {dashboard === 'executivo' ? '📊 Executivo' : 
                         dashboard === 'logistica' ? '🚚 Logística' : 
                         dashboard === 'comercial' ? '💼 Comercial' : '💰 Financeiro'}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2 transition-colors ${
                showSettings ? 'bg-japura-dark text-white' : ''
              }`}
            >
              <Settings size={16} />
              <span>Configurar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Painel de Configurações */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-japura-white rounded-japura shadow-sm border border-gray-300 p-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-japura-black">Configurações do Painel</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-japura-grey mb-2">Widgets Visíveis</label>
                <div className="space-y-2">
                  {['Dólar', 'PIMPs', 'Compromissos', 'Alterações'].map((widget) => (
                    <label key={widget} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>{widget}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-japura-grey mb-2">Notificações</label>
                <div className="space-y-2">
                  {['Email', 'Push', 'SMS'].map((notif) => (
                    <label key={notif} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked={notif === 'Email'} className="rounded" />
                      <span>{notif}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-japura-grey mb-2">Atualização Automática</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>5 minutos</option>
                  <option>15 minutos</option>
                  <option>30 minutos</option>
                  <option>1 hora</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Configurações salvas com sucesso!');
                  setShowSettings(false);
                }}
                className="px-4 py-2 bg-japura-dark text-white rounded-lg hover:bg-japura-black text-sm"
              >
                Salvar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opções de Dashboards */}
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-300 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-japura-dark">Visualizar:</span>
          <div className="flex gap-2">
            {['executivo', 'logistica', 'comercial', 'financeiro'].map((dashboard) => (
              <button
                key={dashboard}
                onClick={() => setSelectedDashboard(dashboard)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  selectedDashboard === dashboard
                    ? 'bg-japura-dark text-white'
                    : 'bg-gray-100 text-japura-dark hover:bg-gray-200'
                }`}
              >
                {dashboard === 'executivo' ? 'Executivo' : 
                 dashboard === 'logistica' ? 'Logística' : 
                 dashboard === 'comercial' ? 'Comercial' : 'Financeiro'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Widget Dólar - DESTAQUE MÁXIMO */}
      <DollarWidget />

      {/* Grid Principal - KPIs e PIMPs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: KPIs e Dashboards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cards KPI - PIMPs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard
              title="PIMPs Ativos"
              value={pimpsAtivos.toString()}
              icon={Package}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-700"
              trend={{
                value: 'Em trânsito e processamento',
                color: 'text-blue-700',
                icon: Ship,
              }}
              delay={0}
            />
            <KpiCard
              title="PIMPs Finalizados"
              value={pimpsFinalizados.toString()}
              icon={CheckCircle2}
              iconBgColor="bg-green-100"
              iconColor="text-green-700"
              trend={{
                value: 'Este mês',
                color: 'text-green-700',
                icon: CheckCircle2,
              }}
              delay={0.1}
            />
            <KpiCard
              title="Faturamento Mensal"
              value={`R$ ${(faturamentoMensal / 1000000).toFixed(1)}M`}
              icon={DollarSign}
              iconBgColor="bg-japura-dark/10"
              iconColor="text-japura-dark"
              trend={{
                value: `${atingimentoMeta}% da meta`,
                color: atingimentoMeta >= 90 ? 'text-green-700' : 'text-yellow-700',
                icon: TrendingUp,
              }}
              progress={atingimentoMeta}
              delay={0.2}
            />
          </div>

          {/* PIMPs Mais Próximos de Chegada */}
          <div className="bg-japura-white p-6 rounded-japura shadow-sm border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-japura-black">PIMPs Mais Próximos de Chegada</h2>
              <button 
                onClick={() => alert('Redirecionando para JapImport...')}
                className="text-sm font-bold text-japura-dark hover:text-japura-black transition-colors flex items-center gap-1"
              >
                Ver todos
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {pimpsProximos.map((pimp, index) => (
                <motion.div
                  key={pimp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => handlePimpClick(pimp)}
                  className="p-4 bg-japura-bg rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-black text-japura-black">{pimp.numero}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          pimp.status === 'Em Trânsito' ? 'bg-blue-100 text-blue-700' :
                          pimp.status === 'Em Porto' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {pimp.status}
                        </span>
                      </div>
                      <p className="text-sm text-japura-dark mb-1 font-semibold">{pimp.fornecedor}</p>
                      <p className="text-xs text-japura-grey mb-2">{pimp.produto}</p>
                      <div className="flex items-center gap-4 text-xs text-japura-grey">
                        <span>USD ${(pimp.valorUsd / 1000).toFixed(0)}K</span>
                        <span>•</span>
                        <span>BRL R$ {(pimp.valorBrl / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-black text-japura-black">{pimp.diasRestantes}</p>
                      <p className="text-xs text-japura-grey">dias restantes</p>
                      <p className="text-xs text-japura-grey mt-1">
                        {new Date(pimp.dataPrevista).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dashboard Dinâmico baseado na seleção */}
          <motion.div
            key={selectedDashboard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-japura-white p-6 rounded-japura shadow-sm border border-gray-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-black text-japura-black">
                  {dashboardData[selectedDashboard as keyof DashboardData].title}
                </h2>
                <p className="text-xs text-japura-grey mt-1">
                  {dashboardData[selectedDashboard as keyof DashboardData].description}
                </p>
              </div>
              <button 
                onClick={handleExport}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2 transition-colors"
              >
                <Download size={14} />
                Exportar
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {dashboardData[selectedDashboard as keyof DashboardData].kpis.map((kpi, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="bg-japura-bg p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <p className="text-xs font-semibold text-japura-grey mb-1">{kpi.label}</p>
                  <p className="text-lg font-black text-japura-black">{kpi.value}</p>
                  <p className="text-xs text-japura-grey mt-1">{kpi.trend}</p>
                </motion.div>
              ))}
            </div>
            <div className="h-64 flex items-center justify-center bg-japura-bg rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto text-japura-grey mb-2" />
                <p className="text-japura-grey">
                  {selectedDashboard === 'executivo' && 'Gráfico de performance geral, faturamento consolidado e tendências estratégicas será implementado'}
                  {selectedDashboard === 'logistica' && 'Gráfico de estoque por filial, distribuição e processos de importação será implementado'}
                  {selectedDashboard === 'comercial' && 'Gráfico de vendas por canal, performance de vendedores e evolução de metas será implementado'}
                  {selectedDashboard === 'financeiro' && 'Gráfico de fluxo de caixa, receitas vs despesas e análise de glosas será implementado'}
                </p>
              </div>
            </div>
            
            {/* Conteúdo específico por dashboard */}
            {selectedDashboard === 'executivo' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-japura-dark">
                  <strong>Resumo Executivo:</strong> Faturamento de R$ 33.5M representa 96% da meta. 
                  18 PIMPs ativos em processamento. Crescimento de 12% vs mês anterior.
                </p>
              </div>
            )}
            
            {selectedDashboard === 'logistica' && (
              <div className="mt-4 space-y-2">
                <div className="p-3 bg-japura-bg rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-japura-grey mb-1">Estoque por Filial</p>
                  <div className="flex justify-between text-sm">
                    <span>Manaus Centro: 3.200 un</span>
                    <span>Manaus Norte: 2.800 un</span>
                    <span>Boa Vista: 1.500 un</span>
                    <span>Porto Velho: 2.100 un</span>
                  </div>
                </div>
                <div className="p-3 bg-japura-bg rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-japura-grey mb-1">Sugestões de Distribuição</p>
                  <p className="text-sm text-japura-dark">2 sugestões pendentes • Economia estimada: R$ 45K</p>
                </div>
              </div>
            )}
            
            {selectedDashboard === 'comercial' && (
              <div className="mt-4 space-y-2">
                <div className="p-3 bg-japura-bg rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-japura-grey mb-1">Top 3 Vendedores</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Ana Silva</span>
                      <span className="font-semibold">R$ 1.2M (120%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pedro Lima</span>
                      <span className="font-semibold">R$ 1.1M (100%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bruno Costa</span>
                      <span className="font-semibold">R$ 850K (94%)</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-japura-bg rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-japura-grey mb-1">Vendas por Canal</p>
                  <div className="flex justify-between text-sm">
                    <span>Atacado: R$ 18.2M</span>
                    <span>Varejo: R$ 15.3M</span>
                  </div>
                </div>
              </div>
            )}
            
            {selectedDashboard === 'financeiro' && (
              <div className="mt-4 space-y-2">
                <div className="p-3 bg-japura-bg rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-japura-grey mb-1">Glosas Pendentes</p>
                  <p className="text-sm text-japura-dark">2 casos • Total: R$ 14.050,00 • Taxa de conformidade: 98.5%</p>
                </div>
                <div className="p-3 bg-japura-bg rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-japura-grey mb-1">Savings Identificados</p>
                  <p className="text-sm text-japura-dark">R$ 211.816,22 acumulados • +8% vs mês anterior</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Coluna 2: Widgets Informativos */}
        <div className="space-y-6">
          {/* Google Calendar - Compromissos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-japura-white rounded-japura shadow-sm border border-gray-300 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-300 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-japura-dark" />
                <h2 className="text-lg font-black text-japura-black">Compromissos</h2>
              </div>
              <button 
                onClick={() => alert('Abrindo calendário completo...')}
                className="text-xs font-bold text-japura-dark hover:text-japura-black transition-colors"
              >
                Ver calendário →
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {calendarEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 hover:bg-japura-bg transition-colors cursor-pointer group border-l-2 border-transparent hover:border-japura-dark"
                  onClick={() => handleCalendarClick(event)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-japura-black group-hover:text-japura-dark transition-colors">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-japura-grey">{event.time}</span>
                        <span className="text-xs text-japura-grey">•</span>
                        <span className="text-xs text-japura-grey">{event.date}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-japura-grey group-hover:text-japura-black transition-colors shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-japura-grey italic">
                TODO: Integrar com Google Calendar API
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Últimas Alterações - Estilo Excel Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-japura-white rounded-japura shadow-sm border border-gray-300 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-300 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-japura-dark" />
            <h2 className="text-lg font-black text-japura-black">Últimas Alterações</h2>
          </div>
          <button 
            onClick={() => alert('Abrindo log completo de alterações...')}
            className="text-xs font-bold text-japura-dark hover:text-japura-black transition-colors"
          >
            Ver log completo →
          </button>
        </div>
        
        {/* Tabela Estilo Excel */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300">
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                  Ação
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                  Módulo
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-dark uppercase tracking-wider border-r border-gray-300">
                  Usuário
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-dark uppercase tracking-wider">
                  Horário
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentChanges.map((change, index) => {
                const Icon = getChangeIcon(change.type);
                return (
                  <tr
                    key={change.id}
                    className={`hover:bg-japura-bg transition-colors cursor-pointer ${
                      index % 2 === 0 ? 'bg-japura-white' : 'bg-gray-50/50'
                    }`}
                    onClick={() => handleChangeClick(change)}
                  >
                    <td className="px-4 py-3 border-r border-gray-200">
                      <div className={`inline-flex items-center justify-center p-1.5 rounded ${getChangeColor(change.type)}`}>
                        <Icon size={14} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-japura-black border-r border-gray-200">
                      {change.action}
                    </td>
                    <td className="px-4 py-3 text-xs text-japura-grey border-r border-gray-200">
                      {change.module}
                    </td>
                    <td className="px-4 py-3 text-xs text-japura-grey border-r border-gray-200">
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-japura-grey" />
                        {change.user}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-japura-grey tabular-nums">
                      {change.time}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Assistente de IA */}
      <AIAssistant />
    </div>
  );
}
