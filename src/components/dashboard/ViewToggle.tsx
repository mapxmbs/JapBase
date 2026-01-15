'use client';

import { motion } from 'framer-motion';
import { Table2, BarChart3 } from 'lucide-react';

type ViewMode = 'grid' | 'chart';

interface ViewToggleProps {
  viewMode?: ViewMode;
  currentMode?: ViewMode;
  onViewChange?: (mode: ViewMode) => void;
  setMode?: (mode: ViewMode) => void;
}

export default function ViewToggle({ 
  viewMode, 
  currentMode, 
  onViewChange, 
  setMode 
}: ViewToggleProps) {
  const activeMode = currentMode || viewMode || 'grid';
  const handleChange = setMode || onViewChange || (() => {});
  return (
    <div className="inline-flex bg-[#3E3F40] rounded-lg p-1 gap-1">
      <motion.button
        onClick={() => handleChange('grid')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${
          activeMode === 'grid'
            ? 'text-[#3E3F40]'
            : 'text-white/70 hover:text-white'
        }`}
      >
        {activeMode === 'grid' && (
          <motion.div
            layoutId="activeView"
            className="absolute inset-0 bg-white rounded-md"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Table2 size={16} strokeWidth={1.5} />
          <span>Dados</span>
        </span>
      </motion.button>

      <motion.button
        onClick={() => handleChange('chart')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${
          activeMode === 'chart'
            ? 'text-[#3E3F40]'
            : 'text-white/70 hover:text-white'
        }`}
      >
        {activeMode === 'chart' && (
          <motion.div
            layoutId="activeView"
            className="absolute inset-0 bg-white rounded-md"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <BarChart3 size={16} strokeWidth={1.5} />
          <span>Gráfico</span>
        </span>
      </motion.button>
    </div>
  );
}
