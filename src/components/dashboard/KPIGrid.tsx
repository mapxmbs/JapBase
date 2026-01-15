'use client';

import { motion } from 'framer-motion';
import { Truck, DollarSign, AlertTriangle } from 'lucide-react';
import { getKPIData } from '@/data/mockData';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  delay: number;
}

function KPICard({ title, value, icon, iconColor, iconBg, delay }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-[#3E3F40]"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-medium text-[#827f7f] uppercase tracking-wide mb-1">
            {title}
          </h3>
          <p className="text-3xl font-black text-[#000000] tabular-nums">
            {value}
          </p>
        </div>
        <motion.div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}
          whileHover={{ rotate: 5, scale: 1.1 }}
        >
          <div className={iconColor}>{icon}</div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function KPIGrid() {
  const kpiData = getKPIData();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(2)}M`;
    }
    return `R$ ${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <KPICard
        title="Em Trânsito"
        value={`${kpiData.emTransito} PIMPs`}
        icon={<Truck size={24} strokeWidth={1.5} />}
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
        delay={0.1}
      />
      <KPICard
        title="Sugestão Compra"
        value={formatCurrency(kpiData.sugestaoCompra)}
        icon={<DollarSign size={24} strokeWidth={1.5} />}
        iconColor="text-green-600"
        iconBg="bg-green-50"
        delay={0.2}
      />
      <KPICard
        title="Divergências"
        value={`${kpiData.divergencias} Ativas`}
        icon={<AlertTriangle size={24} strokeWidth={1.5} />}
        iconColor="text-red-600"
        iconBg="bg-red-50"
        delay={0.3}
      />
    </div>
  );
}
