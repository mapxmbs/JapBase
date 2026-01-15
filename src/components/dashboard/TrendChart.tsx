'use client';

import { motion } from 'framer-motion';

interface DataPoint {
  month: string;
  value: number;
  target: number;
}

// Dados de exemplo
const sampleData: DataPoint[] = [
  { month: 'Jan', value: 2200, target: 2500 },
  { month: 'Fev', value: 2350, target: 2500 },
  { month: 'Mar', value: 2450, target: 2500 },
  { month: 'Abr', value: 2380, target: 2500 },
  { month: 'Mai', value: 2420, target: 2500 },
  { month: 'Jun', value: 2450, target: 2500 },
];

const maxValue = Math.max(...sampleData.map(d => Math.max(d.value, d.target)));

export default function TrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg border border-[#d4d4d4] shadow-sm p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#000000] mb-2">Tendência de Compras</h3>
        <p className="text-sm text-[#827f7f]">Últimos 6 meses</p>
      </div>

      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
          {/* Linha de Meta */}
          <motion.polyline
            points={sampleData
              .map((d, i) => `${(i * 100) + 50},${200 - (d.target / maxValue) * 150}`)
              .join(' ')}
            fill="none"
            stroke="#827f7f"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          {/* Área de Valores */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3E3F40" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3E3F40" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <motion.path
            d={`M ${sampleData
              .map((d, i) => `${(i * 100) + 50},${200 - (d.value / maxValue) * 150}`)
              .join(' L')} L ${(sampleData.length - 1) * 100 + 50},200 L 50,200 Z`}
            fill="url(#areaGradient)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* Linha de Valores */}
          <motion.polyline
            points={sampleData
              .map((d, i) => `${(i * 100) + 50},${200 - (d.value / maxValue) * 150}`)
              .join(' ')}
            fill="none"
            stroke="#3E3F40"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          />

          {/* Pontos */}
          {sampleData.map((d, i) => (
            <motion.circle
              key={i}
              cx={(i * 100) + 50}
              cy={200 - (d.value / maxValue) * 150}
              r="5"
              fill="#3E3F40"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
            />
          ))}
        </svg>

        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
          {sampleData.map((d, i) => (
            <span key={i} className="text-xs text-[#827f7f] font-medium">
              {d.month}
            </span>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#d4d4d4]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[#3E3F40]"></div>
          <span className="text-xs text-[#827f7f]">Valores</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[#827f7f] border-dashed"></div>
          <span className="text-xs text-[#827f7f]">Meta</span>
        </div>
      </div>
    </motion.div>
  );
}
