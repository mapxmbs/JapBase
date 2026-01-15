'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { markerConfigs, type MarkerColor } from './RowMarker';
import { shoppingData } from '@/data/mockData';
import { getAllMarkers } from '@/utils/markerStorage';
import { useMemo } from 'react';

interface MarkerDashboardProps {
  markers: Record<string, MarkerColor>;
}

export default function MarkerDashboard({ markers }: MarkerDashboardProps) {
  const chartData = useMemo(() => {
    const data = {
      red: 0,
      green: 0,
      yellow: 0,
    };

    Object.values(markers).forEach((color) => {
      if (color) {
        data[color]++;
      }
    });

    return [
      { name: markerConfigs.red.label, value: data.red, color: '#ef4444' },
      { name: markerConfigs.green.label, value: data.green, color: '#22c55e' },
      { name: markerConfigs.yellow.label, value: data.yellow, color: '#eab308' },
    ].filter((item) => item.value > 0);
  }, [markers]);

  const barData = useMemo(() => {
    const byFornecedor: Record<string, { red: number; green: number; yellow: number }> = {};

    Object.entries(markers).forEach(([sku, color]) => {
      if (!color) return;
      const item = shoppingData.find((s) => s.sku === sku);
      if (!item?.fornecedor) return;

      if (!byFornecedor[item.fornecedor]) {
        byFornecedor[item.fornecedor] = { red: 0, green: 0, yellow: 0 };
      }
      byFornecedor[item.fornecedor][color]++;
    });

    return Object.entries(byFornecedor).map(([fornecedor, counts]) => ({
      fornecedor,
      'Venda Futura': counts.red,
      'Distribuição Prevista': counts.green,
      'Alta Venda': counts.yellow,
    }));
  }, [markers]);

  const totalValue = useMemo(() => {
    return Object.entries(markers)
      .filter(([_, color]) => color !== null)
      .reduce((sum, [sku]) => {
        const item = shoppingData.find((s) => s.sku === sku);
        return sum + (item?.preco || 0) * (item?.sugestao || 0);
      }, 0);
  }, [markers]);

  if (Object.keys(markers).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-[#d0d0d0] p-8 text-center"
      >
        <p className="text-gray-500">Nenhuma marcação encontrada. Marque algumas linhas no grid para visualizar os dados aqui.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-4"
        >
          <div className="text-xs text-gray-600 mb-1">Total Marcado</div>
          <div className="text-2xl font-bold text-[#000000]">
            {Object.keys(markers).length} SKU{Object.keys(markers).length !== 1 ? 's' : ''}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-4"
        >
          <div className="text-xs text-gray-600 mb-1">Valor Total</div>
          <div className="text-2xl font-bold text-green-600">
            R$ {(totalValue / 1000000).toFixed(2)}M
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-4"
        >
          <div className="text-xs text-gray-600 mb-1">Tipos de Marcação</div>
          <div className="text-2xl font-bold text-[#000000]">
            {chartData.length}
          </div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-6"
        >
          <h3 className="text-sm font-bold text-[#000000] mb-4">
            Distribuição por Tipo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#3E3F40',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gráfico de Barras */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-[#d0d0d0] rounded-lg p-6"
        >
          <h3 className="text-sm font-bold text-[#000000] mb-4">
            Marcações por Fornecedor
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d4" />
              <XAxis
                dataKey="fornecedor"
                tick={{ fontSize: 11, fill: '#827f7f' }}
                stroke="#827f7f"
              />
              <YAxis tick={{ fontSize: 11, fill: '#827f7f' }} stroke="#827f7f" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#3E3F40',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                }}
              />
              <Legend />
              <Bar dataKey="Venda Futura" fill="#ef4444" />
              <Bar dataKey="Distribuição Prevista" fill="#22c55e" />
              <Bar dataKey="Alta Venda" fill="#eab308" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}
