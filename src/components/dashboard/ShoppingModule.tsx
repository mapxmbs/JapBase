'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, TrendingUp, AlertCircle, Package, DollarSign, BarChart3 } from 'lucide-react';
import ViewToggle from './ViewToggle';
import ShoppingGrid from './ShoppingGrid';
import TrendChart from './TrendChart';
import { shoppingData } from '@/data/mockData';

export default function ShoppingModule() {
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');

  const stats = useMemo(() => {
    const totalEstoque = shoppingData.reduce((sum, item) => sum + item.estoque, 0);
    const totalSugestao = shoppingData.reduce((sum, item) => sum + item.sugestao, 0);
    const totalValor = shoppingData.reduce((sum, item) => sum + (item.sugestao * (item.preco || 0)), 0);
    const criticos = shoppingData.filter((s) => s.status === 'critico').length;
    const alertas = shoppingData.filter((s) => s.status === 'alerta').length;
    const mediaVendaTotal = shoppingData.reduce((sum, item) => sum + item.mediaVenda, 0);

    return {
      totalEstoque,
      totalSugestao,
      totalValor,
      criticos,
      alertas,
      mediaVendaTotal,
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
          <h1 className="text-3xl font-black text-[#000000] mb-1">Cockpit de Compras</h1>
          <p className="text-sm text-[#827f7f]">Gestão inteligente de sugestões e estoque</p>
        </div>
        <ViewToggle currentMode={viewMode} setMode={setViewMode} />
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#827f7f] uppercase">Total Estoque</span>
            <Package className="text-blue-600" size={18} strokeWidth={1.5} />
          </div>
          <p className="text-2xl font-black text-[#000000] tabular-nums">{stats.totalEstoque}</p>
          <p className="text-xs text-gray-500 mt-1">unidades em estoque</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#827f7f] uppercase">Sugestão Compra</span>
            <ShoppingCart className="text-green-600" size={18} strokeWidth={1.5} />
          </div>
          <p className="text-2xl font-black text-[#000000] tabular-nums">{stats.totalSugestao}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.totalValor >= 1000000 
              ? `R$ ${(stats.totalValor / 1000000).toFixed(2)}M`
              : `R$ ${(stats.totalValor / 1000).toFixed(0)}k`}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#827f7f] uppercase">Alertas</span>
            <AlertCircle className="text-yellow-600" size={18} strokeWidth={1.5} />
          </div>
          <p className="text-2xl font-black text-[#000000] tabular-nums">
            {stats.alertas + stats.criticos}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.criticos} críticos, {stats.alertas} alertas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#827f7f] uppercase">Média Venda</span>
            <TrendingUp className="text-purple-600" size={18} strokeWidth={1.5} />
          </div>
          <p className="text-2xl font-black text-[#000000] tabular-nums">{stats.mediaVendaTotal}</p>
          <p className="text-xs text-gray-500 mt-1">unidades/mês</p>
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
            <ShoppingGrid />
          </motion.div>
        ) : (
          <motion.div
            key="chart"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TrendChart />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
