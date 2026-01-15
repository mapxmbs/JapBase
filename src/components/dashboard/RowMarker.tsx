'use client';

import { useState } from 'react';
import { Palette, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type MarkerColor = 'red' | 'green' | 'yellow' | null;

export interface MarkerConfig {
  color: MarkerColor;
  label: string;
  description: string;
}

export const markerConfigs: Record<NonNullable<MarkerColor>, MarkerConfig> = {
  red: {
    color: 'red',
    label: 'Venda Futura',
    description: 'Produto destinado para venda futura',
  },
  green: {
    color: 'green',
    label: 'Distribuição Prevista',
    description: 'Carga já tem distribuição prevista',
  },
  yellow: {
    color: 'yellow',
    label: 'Alta Venda',
    description: 'Vamos ter muita venda deste produto',
  },
};

interface RowMarkerProps {
  currentColor: MarkerColor;
  onColorChange: (color: MarkerColor) => void;
  sku: string;
}

export default function RowMarker({ currentColor, onColorChange, sku }: RowMarkerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorClick = (color: MarkerColor) => {
    if (currentColor === color) {
      onColorChange(null); // Remove marcação se clicar na mesma cor
    } else {
      onColorChange(color);
    }
    setIsOpen(false);
  };

  const getMarkerStyle = (color: MarkerColor) => {
    if (!color) return {};
    const config = markerConfigs[color];
    return {
      backgroundColor: color === 'red' ? '#fee2e2' : color === 'green' ? '#dcfce7' : '#fef9c3',
      borderLeft: `4px solid ${color === 'red' ? '#ef4444' : color === 'green' ? '#22c55e' : '#eab308'}`,
    };
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          backgroundColor: currentColor === 'red' ? '#fee2e2' : currentColor === 'green' ? '#dcfce7' : currentColor === 'yellow' ? '#fef9c3' : '#f3f4f6',
          color: currentColor === 'red' ? '#b91c1c' : currentColor === 'green' ? '#15803d' : currentColor === 'yellow' ? '#a16207' : '#4b5563',
        }}
        className="p-1.5 rounded transition-colors hover:opacity-80"
        title={currentColor ? markerConfigs[currentColor].label : 'Marcar linha'}
      >
        <Palette size={14} strokeWidth={2} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px]"
            >
              <div className="text-xs font-semibold text-gray-700 mb-2 px-2">
                Marcar como:
              </div>
              {Object.entries(markerConfigs).map(([color, config]) => (
                <motion.button
                  key={color}
                  onClick={() => handleColorClick(color as MarkerColor)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    backgroundColor: currentColor === color
                      ? (color === 'red' ? '#fee2e2' : color === 'green' ? '#dcfce7' : '#fef9c3')
                      : 'transparent',
                    color: currentColor === color
                      ? (color === 'red' ? '#b91c1c' : color === 'green' ? '#15803d' : '#a16207')
                      : '#374151',
                    border: `2px solid ${currentColor === color
                      ? (color === 'red' ? '#f87171' : color === 'green' ? '#4ade80' : '#facc15')
                      : 'transparent'}`,
                  }}
                  className="w-full text-left px-3 py-2 rounded mb-1 flex items-center gap-2 transition-colors hover:bg-gray-50"
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      color === 'red'
                        ? 'bg-red-500'
                        : color === 'green'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-xs font-medium">{config.label}</div>
                    <div className="text-xs text-gray-500">{config.description}</div>
                  </div>
                  {currentColor === color && (
                    <X size={12} className="text-gray-400" />
                  )}
                </motion.button>
              ))}
              {currentColor && (
                <motion.button
                  onClick={() => handleColorClick(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left px-3 py-2 rounded mt-1 text-xs text-red-600 hover:bg-red-50 border-2 border-transparent hover:border-red-200"
                >
                  Remover marcação
                </motion.button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
