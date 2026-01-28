/**
 * @package @japbase/ui
 * @component KpiCard
 * 
 * Componente de card de KPI reutilizável do Design System Japurá 2025.
 * Usado em dashboards e visões executivas para exibir métricas principais.
 * 
 * @example
 * ```tsx
 * <KpiCard
 *   title="Total de Vendas"
 *   value="R$ 1.234.567"
 *   icon={DollarSign}
 *   iconBgColor="bg-japura-primary"
 *   iconColor="text-white"
 *   trend={{ value: "+12%", color: "text-green-600", icon: TrendingUp }}
 * />
 * ```
 */

'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface KpiCardProps {
  /** Título do KPI (ex: "Total de Vendas") */
  title: string;
  /** Valor principal a ser exibido */
  value: string;
  /** Ícone do Lucide React */
  icon: LucideIcon;
  /** Cor de fundo do ícone (classes Tailwind) */
  iconBgColor: string;
  /** Cor do ícone (classes Tailwind) */
  iconColor: string;
  /** Tendência opcional (ex: "+12%", "-5%") */
  trend?: {
    value: string;
    color: string;
    icon: LucideIcon;
  };
  /** Progresso opcional (0-100) para exibir barra de progresso */
  progress?: number;
  /** Delay de animação em segundos */
  delay?: number;
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  trend,
  progress,
  delay = 0,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-japura-white p-6 rounded-japura shadow-sm border border-gray-300 hover:shadow-md hover:border-japura-dark transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${iconBgColor} rounded-lg ${iconColor}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="text-xs font-bold text-japura-grey uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className="text-3xl font-black text-japura-black tabular-nums">{value}</p>
      {trend && (
        <div className={`mt-4 flex items-center text-xs ${trend.color}`}>
          <trend.icon size={14} className="mr-1" />
          <span>{trend.value}</span>
        </div>
      )}
      {progress !== undefined && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-japura-dark h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </motion.div>
  );
}
