'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Zap, Edit2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { exportToExcel } from '@/utils/exportToExcel';
import ExcelFilter from './ExcelFilter';
import { priceComparisonData, type PriceComparisonItem } from '@/data/mockData';

const sampleData = priceComparisonData;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function calculateDifference(ourPrice: number, competitorPrice: number): number {
  return ((ourPrice - competitorPrice) / competitorPrice) * 100;
}

function DifferenceCell({ ourPrice, competitorPrice }: { ourPrice: number; competitorPrice: number }) {
  const difference = calculateDifference(ourPrice, competitorPrice);
  const isHigher = difference > 0;
  const isLower = difference < 0;

  return (
    <span
      className={`tabular-nums ${
        isHigher
          ? 'bg-red-100 text-red-700'
          : isLower
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-[#3E3F40]'
      } px-2 py-1 rounded-full text-xs font-semibold`}
    >
      {isHigher ? '+' : ''}
      {difference.toFixed(1)}%
    </span>
  );
}

export default function PriceComparison() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [zoom, setZoom] = useState(100);
  const [filters, setFilters] = useState<Record<string, string[]>>({
    medidaSku: [],
  });

  // Obter valores únicos para cada coluna
  const uniqueValues = useMemo(() => {
    return {
      medidaSku: Array.from(new Set(sampleData.map((item) => item.medidaSku))),
    };
  }, []);

  // Filtrar dados
  const filteredData = useMemo(() => {
    return sampleData.filter((item) => {
      if (
        filters.medidaSku.length > 0 &&
        !filters.medidaSku.includes(item.medidaSku)
      ) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const handleFilterChange = (columnKey: string, values: string[]) => {
    setFilters((prev) => ({
      ...prev,
      [columnKey]: values,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      medidaSku: [],
    });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleExport = () => {
    const exportData = filteredData.map((item) => {
      const diffA = calculateDifference(item.nossoPreco, item.concorrenteA);
      const diffB = calculateDifference(item.nossoPreco, item.concorrenteB);
      return {
        'Medida/SKU': item.medidaSku,
        'Nosso Preço (Japurá)': item.nossoPreco,
        'Concorrente A': item.concorrenteA,
        'Concorrente B': item.concorrenteB,
        'Diferença % (vs A)': `${diffA > 0 ? '+' : ''}${diffA.toFixed(2)}%`,
        'Diferença % (vs B)': `${diffB > 0 ? '+' : ''}${diffB.toFixed(2)}%`,
      };
    });

    exportToExcel(exportData, 'comparacao-precos', 'Comparação de Preços');
  };

  const hasActiveFilters = Object.values(filters).some(
    (arr) => arr.length > 0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4"
    >
      {/* Barra de Controles */}
      <div className="flex justify-between items-center bg-white border border-[#d0d0d0] rounded px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Zoom:</span>
          <div className="flex items-center gap-1 border border-[#d0d0d0] rounded">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-gray-100 transition-colors"
              title="Diminuir"
            >
              <ZoomOut size={14} strokeWidth={2} />
            </button>
            <span className="px-2 text-xs font-medium min-w-[3rem] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-gray-100 transition-colors"
              title="Aumentar"
            >
              <ZoomIn size={14} strokeWidth={2} />
            </button>
            {zoom !== 100 && (
              <button
                onClick={handleResetZoom}
                className="p-1 hover:bg-gray-100 transition-colors border-l border-[#d0d0d0] pl-1 ml-1"
                title="Resetar Zoom"
              >
                <RotateCcw size={14} strokeWidth={2} />
              </button>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="ml-4 text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Limpar Filtros
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 border border-[#3E3F40] text-[#3E3F40] px-4 py-2 rounded hover:bg-[#3E3F40] hover:text-white transition-colors font-medium text-xs shadow-sm"
          >
            <Download size={14} strokeWidth={1.5} />
            Exportar Excel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-[#3E3F40] text-white px-4 py-2 rounded hover:bg-[#000000] transition-colors font-medium text-xs shadow-sm"
          >
            <Zap size={14} strokeWidth={1.5} />
            Rodar Robô de Preços (IA)
          </motion.button>
        </div>
      </div>

      {/* Tabela Comparativa Excel-like */}
      <div
        className="bg-white rounded-lg border border-[#d0d0d0] overflow-hidden shadow-lg"
        style={{ zoom: `${zoom}%` }}
      >
        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
          <table className="excel-grid w-full">
            <thead>
              <tr>
                <th className="text-left">
                  <div className="flex items-center gap-1">
                    Medida/SKU
                    <ExcelFilter
                      columnKey="medidaSku"
                      options={uniqueValues.medidaSku}
                      selectedValues={filters.medidaSku}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </th>
                <th className="text-left">Nosso Preço (Japurá)</th>
                <th className="text-left">Concorrente A</th>
                <th className="text-left">Concorrente B</th>
                <th className="text-left">Diferença % (vs A)</th>
                <th className="text-left">Diferença % (vs B)</th>
                <th className="text-center w-20">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    Nenhum resultado encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <motion.tr
                    key={item.medidaSku}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`${
                      hoveredRow === index ? 'bg-[#E7F3FF]' : ''
                    } transition-colors relative group`}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="font-mono font-semibold">
                      {item.medidaSku}
                    </td>
                    <td className="text-left tabular-nums font-semibold">
                      {formatCurrency(item.nossoPreco)}
                    </td>
                    <td className="text-left tabular-nums">
                      {formatCurrency(item.concorrenteA)}
                    </td>
                    <td className="text-left tabular-nums">
                      {formatCurrency(item.concorrenteB)}
                    </td>
                    <td className="text-left">
                      <DifferenceCell
                        ourPrice={item.nossoPreco}
                        competitorPrice={item.concorrenteA}
                      />
                    </td>
                    <td className="text-left">
                      <DifferenceCell
                        ourPrice={item.nossoPreco}
                        competitorPrice={item.concorrenteB}
                      />
                    </td>
                    <td className="text-center">
                      <AnimatePresence>
                        {hoveredRow === index && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 rounded hover:bg-[#3E3F40] hover:text-white transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={12} strokeWidth={1.5} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredData.length > 0 && (
          <div className="bg-[#F2F2F2] border-t border-[#d0d0d0] px-4 py-2 text-xs text-gray-600">
            Mostrando {filteredData.length} de {sampleData.length} registros
          </div>
        )}
      </div>
    </motion.div>
  );
}
