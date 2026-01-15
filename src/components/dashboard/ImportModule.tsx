'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle2, Clock, DollarSign, TrendingUp } from 'lucide-react';
import ViewToggle from './ViewToggle';
import ImportTracker from './ImportTracker';
import ImportPieChart from './ImportPieChart';
import { importProcessesData } from '@/data/mockData';

export default function ImportModule() {
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');

  const stats = useMemo(() => {
    const total = importProcessesData.length;
    const emTransito = importProcessesData.filter(
      (p) => !p.steps.every((s) => s.completed)
    ).length;
    const concluidos = importProcessesData.filter(
      (p) => p.steps.every((s) => s.completed)
    ).length;
    const valorTotal = importProcessesData.reduce(
      (sum, p) => sum + (p.valorTotal || 0),
      0
    );
    const itensTotal = importProcessesData.reduce(
      (sum, p) => sum + (p.quantidadeItens || 0),
      0
    );

    return {
      total,
      emTransito,
      concluidos,
      valorTotal,
      itensTotal,
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header com Título */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#000000] mb-1">Rastreamento de Importação</h1>
          <p className="text-sm text-[#827f7f]">Acompanhamento completo dos processos PIMP</p>
        </div>
        <ViewToggle currentMode={viewMode} setMode={setViewMode} />
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#827f7f] uppercase">Total PIMPs</span>
            <Package className="text-blue-600" size={18} strokeWidth={1.5} />
          </div>
          <p className="text-2xl font-black text-[#000000] tabular-nums">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">processos cadastrados</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#827f7f] uppercase">Em Trânsito</span>
            <Truck className="text-orange-600" size={18} strokeWidth={1.5} />
          </div>
          <p className="text-2xl font-black text-[#000000] tabular-nums">{stats.emTransito}</p>
          <p className="text-xs text-gray-500 mt-1">aguardando chegada</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#827f7f] uppercase">Concluídos</span>
            <CheckCircle2 className="text-green-600" size={18} strokeWidth={1.5} />
          </div>
          <p className="text-2xl font-black text-[#000000] tabular-nums">{stats.concluidos}</p>
          <p className="text-xs text-gray-500 mt-1">no estoque</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#827f7f] uppercase">Valor Total</span>
            <DollarSign className="text-purple-600" size={18} strokeWidth={1.5} />
          </div>
          <p className="text-2xl font-black text-[#000000] tabular-nums">
            {stats.valorTotal >= 1000000
              ? `R$ ${(stats.valorTotal / 1000000).toFixed(1)}M`
              : `R$ ${(stats.valorTotal / 1000).toFixed(0)}k`}
          </p>
          <p className="text-xs text-gray-500 mt-1">em importações</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#827f7f] uppercase">Itens Total</span>
            <TrendingUp className="text-indigo-600" size={18} strokeWidth={1.5} />
          </div>
          <p className="text-2xl font-black text-[#000000] tabular-nums">
            {stats.itensTotal.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-gray-500 mt-1">unidades</p>
        </motion.div>
      </div>

      {/* Conteúdo com Transição */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ImportTracker />
          </motion.div>
        ) : (
          <motion.div
            key="chart"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ImportPieChart />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
