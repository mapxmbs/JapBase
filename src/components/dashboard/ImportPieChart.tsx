'use client';

import { motion } from 'framer-motion';

interface StatusData {
  label: string;
  value: number;
  color: string;
}

// Dados de exemplo
const statusData: StatusData[] = [
  { label: 'Em Estoque', value: 45, color: '#10b981' },
  { label: 'Em Canal', value: 25, color: '#3b82f6' },
  { label: 'Embarque', value: 20, color: '#f59e0b' },
  { label: 'Pedido', value: 10, color: '#827f7f' },
];

const total = statusData.reduce((sum, item) => sum + item.value, 0);
const radius = 80;
const centerX = 100;
const centerY = 100;

function calculatePath(index: number, data: StatusData[]) {
  let currentAngle = -90;
  for (let i = 0; i < index; i++) {
    currentAngle += (data[i].value / total) * 360;
  }
  const angle = (data[index].value / total) * 360;
  
  const startAngle = (currentAngle * Math.PI) / 180;
  const endAngle = ((currentAngle + angle) * Math.PI) / 180;
  
  const x1 = centerX + radius * Math.cos(startAngle);
  const y1 = centerY + radius * Math.sin(startAngle);
  const x2 = centerX + radius * Math.cos(endAngle);
  const y2 = centerY + radius * Math.sin(endAngle);
  
  const largeArcFlag = angle > 180 ? 1 : 0;
  
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

export default function ImportPieChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg border border-[#d4d4d4] shadow-sm p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#000000] mb-2">Status das Importações</h3>
        <p className="text-sm text-[#827f7f]">Distribuição atual</p>
      </div>

      <div className="flex items-center gap-8">
        {/* Gráfico de Rosca */}
        <div className="flex-shrink-0">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {statusData.map((item, index) => (
              <motion.path
                key={item.label}
                d={calculatePath(index, statusData)}
                fill={item.color}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              />
            ))}
            {/* Círculo central para efeito de rosca */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.6}
              fill="white"
            />
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              className="text-2xl font-black fill-[#000000] tabular-nums"
            >
              {total}
            </text>
            <text
              x={centerX}
              y={centerY + 15}
              textAnchor="middle"
              className="text-xs fill-[#827f7f]"
            >
              Processos
            </text>
          </svg>
        </div>

        {/* Legenda */}
        <div className="flex-1 space-y-3">
          {statusData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-[#000000]">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#3E3F40] tabular-nums">
                  {item.value}
                </span>
                <span className="text-xs text-[#827f7f]">
                  ({((item.value / total) * 100).toFixed(0)}%)
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
