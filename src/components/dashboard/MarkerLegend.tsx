'use client';

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { markerConfigs, type MarkerColor } from './RowMarker';

interface MarkerLegendProps {
  markers: Record<string, MarkerColor>;
  onFilter?: (color: MarkerColor | 'all') => void;
  activeFilter?: MarkerColor | 'all';
}

export default function MarkerLegend({
  markers,
  onFilter,
  activeFilter = 'all',
}: MarkerLegendProps) {
  const counts = {
    red: Object.values(markers).filter((c) => c === 'red').length,
    green: Object.values(markers).filter((c) => c === 'green').length,
    yellow: Object.values(markers).filter((c) => c === 'yellow').length,
    total: Object.keys(markers).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#d0d0d0] rounded-lg p-4 mb-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <Info size={16} strokeWidth={1.5} className="text-[#3E3F40]" />
        <h3 className="text-sm font-bold text-[#000000]">Legenda de Marcadores</h3>
        <span className="text-xs text-gray-500 ml-auto">
          {counts.total} linha{counts.total !== 1 ? 's' : ''} marcada{counts.total !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(markerConfigs).map(([color, config]) => {
          const count = counts[color as keyof typeof counts];
          const isActive = activeFilter === color || activeFilter === 'all';
          
          return (
            <motion.button
              key={color}
              onClick={() => onFilter?.(isActive && activeFilter !== 'all' ? 'all' : (color as MarkerColor))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                border: `2px solid ${isActive && activeFilter === color
                  ? (color === 'red' ? '#f87171' : color === 'green' ? '#4ade80' : '#facc15')
                  : '#e5e7eb'}`,
                backgroundColor: isActive && activeFilter === color
                  ? (color === 'red' ? '#fee2e2' : color === 'green' ? '#dcfce7' : '#fef9c3')
                  : '#f9fafb',
              }}
              className="flex items-center gap-3 p-3 rounded-lg transition-all hover:border-gray-300"
            >
              <div
                className={`w-5 h-5 rounded-full flex-shrink-0 ${
                  color === 'red'
                    ? 'bg-red-500'
                    : color === 'green'
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                }`}
              />
              <div className="flex-1 text-left">
                <div className="text-xs font-semibold text-[#000000]">
                  {config.label}
                </div>
                <div className="text-xs text-gray-600">{config.description}</div>
              </div>
              <div
                style={{
                  backgroundColor: color === 'red' ? '#fee2e2' : color === 'green' ? '#dcfce7' : '#fef9c3',
                  color: color === 'red' ? '#b91c1c' : color === 'green' ? '#15803d' : '#a16207',
                }}
                className="text-xs font-bold px-2 py-1 rounded"
              >
                {count}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
