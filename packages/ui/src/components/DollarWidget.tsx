/**
 * @package @japbase/ui
 * @component DollarWidget
 * 
 * Widget para exibir cotação do dólar em tempo real.
 * Consome dados da API de câmbio.
 */

'use client';

import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface DollarWidgetProps {
  /** Valor da cotação do dólar */
  value: number;
  /** Variação percentual */
  variation?: number;
  /** Data da última atualização */
  lastUpdate?: string;
}

export function DollarWidget({ value, variation, lastUpdate }: DollarWidgetProps) {
  const isPositive = variation !== undefined && variation >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-japura-white p-4 rounded-lg border border-gray-300 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-japura-primary rounded-lg text-white">
          <DollarSign size={20} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-japura-grey uppercase tracking-wider">Dólar</p>
          <p className="text-xl font-black text-japura-black">
            R$ {value.toFixed(2)}
          </p>
          {variation !== undefined && (
            <div className={`flex items-center gap-1 text-xs ${trendColor} mt-1`}>
              <TrendIcon size={12} />
              <span>{variation >= 0 ? '+' : ''}{variation.toFixed(2)}%</span>
            </div>
          )}
        </div>
      </div>
      {lastUpdate && (
        <p className="text-xs text-japura-grey mt-2">Atualizado: {lastUpdate}</p>
      )}
    </motion.div>
  );
}
