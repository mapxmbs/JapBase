'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Search,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getKPIData, shoppingData, importProcessesData, divergenciasData } from '@/data/mockData';

type ViewType = 'home' | 'dashboard' | 'import' | 'pricing';

interface InsightsHomeProps {
  setCurrentView: (view: ViewType) => void;
}

// Dados para gráfico de vendas da semana
const weeklySalesData = [
  { day: 'Seg', vendas: 42000 },
  { day: 'Ter', vendas: 45000 },
  { day: 'Qua', vendas: 48000 },
  { day: 'Qui', vendas: 52000 },
  { day: 'Sex', vendas: 49000 },
  { day: 'Sáb', vendas: 38000 },
  { day: 'Dom', vendas: 35000 },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getFormattedDate() {
  const date = new Date();
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' });
  const day = date.getDate();
  const month = date.toLocaleDateString('pt-BR', { month: 'short' });
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} de ${month}`;
}

export default function InsightsHome({ setCurrentView }: InsightsHomeProps) {
  const greeting = getGreeting();
  const formattedDate = getFormattedDate();
  const kpiData = getKPIData();

  const emTransito = importProcessesData.filter(
    (p) => !p.steps.every((s) => s.completed)
  ).length;

  const criticos = shoppingData.filter((s) => s.status === 'critico');
  const alertas = shoppingData.filter((s) => s.status === 'alerta');
  const totalAprovar = kpiData.sugestaoCompra;

  const stats = [
    {
      label: 'Divergências',
      value: `${kpiData.divergencias}`,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      label: 'Em Trânsito',
      value: `${emTransito}`,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Aprovar',
      value: totalAprovar >= 1000000 
        ? `R$ ${(totalAprovar / 1000000).toFixed(1)}M`
        : `R$ ${(totalAprovar / 1000).toFixed(0)}k`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      label: 'Dólar PIMP',
      value: 'R$ 5,12',
      icon: TrendingUp,
      color: 'text-[#827f7f]',
      bgColor: 'bg-[#f0efee]',
      borderColor: 'border-[#d4d4d4]',
    },
  ];

  const criticalAlerts = [
    ...divergenciasData.slice(0, 2).map((div) => ({
      id: div.id,
      icon: '⚠️',
      message: `Divergência de R$ ${div.valor.toLocaleString('pt-BR')} detectada na ${div.nfe} (${div.fornecedor}).`,
      borderColor: 'border-l-yellow-500',
    })),
    ...criticos.slice(0, 2).map((item, idx) => ({
      id: `critico-${idx}`,
      icon: '📉',
      message: `Estoque crítico: ${item.sku} (${item.produto}) - apenas ${item.estoque} unidades.`,
      borderColor: 'border-l-red-500',
    })),
  ].slice(0, 4);

  const quickActions = [
    {
      label: 'Cockpit de Compras',
      icon: ShoppingCart,
      onClick: () => setCurrentView('dashboard'),
      description: 'Gerenciar sugestões de compra',
    },
    {
      label: 'Rastrear PIMP',
      icon: Package,
      onClick: () => setCurrentView('import'),
      description: 'Acompanhar importações',
    },
    {
      label: 'Shopping de Preços',
      icon: Search,
      onClick: () => setCurrentView('pricing'),
      description: 'Comparar preços',
    },
  ];

  // Dados para gráfico de tendência de importações
  const importTrendData = importProcessesData.map((pimp, idx) => ({
    mes: `PIMP ${idx + 1}`,
    valor: (pimp.valorTotal || 0) / 1000,
    status: pimp.steps.filter((s) => s.completed).length,
  }));

  // Próximos PIMPs a chegar
  const proximosPIMPs = importProcessesData
    .filter((p) => !p.steps.every((s) => s.completed))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Smart Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-[#d4d4d4] p-8"
      >
        <h1 className="text-5xl font-black text-[#000000] mb-3">
          {greeting}, Usuário
        </h1>
        <p className="text-xl text-[#827f7f] font-medium">{formattedDate}</p>
      </motion.div>

      {/* Grid de Resumo (Stats) - 4 Cards pequenos no topo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.03, y: -3 }}
              className={`bg-white rounded-lg shadow-sm border ${stat.borderColor} p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#827f7f] uppercase tracking-wide">
                  {stat.label}
                </span>
                <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={stat.color} size={18} strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-3xl font-black text-[#000000] tabular-nums">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Seção: Próximos PIMPs */}
      {proximosPIMPs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-[#d4d4d4] p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Clock className="text-blue-600" size={20} strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold text-[#000000]">Próximos PIMPs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {proximosPIMPs.map((pimp, idx) => {
              const progress = (pimp.steps.filter((s) => s.completed).length / pimp.steps.length) * 100;
              return (
                <motion.div
                  key={pimp.numero}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="border border-[#d4d4d4] rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#827f7f]">{pimp.numero}</span>
                    <span className="text-xs text-blue-600 font-medium">{pimp.previsaoChegada}</span>
                  </div>
                  <p className="text-sm font-medium text-[#000000] mb-2">{pimp.fornecedor}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {pimp.steps.filter((s) => s.completed).length}/{pimp.steps.length} etapas
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Grid: Alertas Críticos + Mini Gráfico + Acesso Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seção Alertas Críticos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-[#d4d4d4] p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={20} strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold text-[#000000]">Alertas Críticos</h2>
          </div>
          <div className="space-y-3">
            {criticalAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`${alert.borderColor} border-l-4 bg-[#f9f9f9] rounded-r-lg p-4 hover:bg-[#f0efee] transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{alert.icon}</span>
                  <p className="text-sm font-medium text-[#3E3F40] leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mini Gráfico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-[#d4d4d4] p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} strokeWidth={1.5} className="text-[#3E3F40]" />
            <h3 className="text-sm font-medium text-[#827f7f] uppercase tracking-wide">
              Vendas da Semana
            </h3>
          </div>
          <div className="h-48 min-h-[192px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={192}>
              <AreaChart data={weeklySalesData}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3E3F40" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3E3F40" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d4" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: '#827f7f' }}
                  stroke="#827f7f"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#827f7f' }}
                  stroke="#827f7f"
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#3E3F40',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                  formatter={(value: number | undefined) => {
                    if (value === undefined) return ['R$ 0', 'Vendas'];
                    return [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas'];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="vendas"
                  stroke="#3E3F40"
                  strokeWidth={2}
                  fill="url(#colorVendas)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Seção Acesso Rápido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-[#d4d4d4] p-6"
        >
          <h3 className="text-sm font-medium text-[#827f7f] uppercase tracking-wide mb-5">
            Acesso Rápido
          </h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  onClick={action.onClick}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-4 p-5 rounded-lg border-2 border-[#3E3F40] hover:bg-[#3E3F40] hover:text-white transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-full bg-[#3E3F40] group-hover:bg-white flex items-center justify-center flex-shrink-0">
                    <Icon className="text-white group-hover:text-[#3E3F40]" size={22} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-[#000000] group-hover:text-white text-base block">
                      {action.label}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-white/80">
                      {action.description}
                    </span>
                  </div>
                  <ArrowRight className="text-[#3E3F40] group-hover:text-white" size={18} strokeWidth={1.5} />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
