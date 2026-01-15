'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Edit2, ZoomIn, ZoomOut, RotateCcw, BarChart3 } from 'lucide-react';
import { exportToExcel } from '@/utils/exportToExcel';
import ExcelFilter from './ExcelFilter';
import { shoppingData, type ShoppingItem } from '@/data/mockData';
import RowMarker, { type MarkerColor, markerConfigs } from './RowMarker';
import MarkerLegend from './MarkerLegend';
import MarkerDashboard from './MarkerDashboard';
import { getAllMarkers, saveMarker } from '@/utils/markerStorage';

const sampleData = shoppingData;

function StatusBadge({ status }: { status: 'ok' | 'alerta' | 'critico' }) {
  const styles = {
    ok: 'bg-green-100 text-green-700',
    alerta: 'bg-yellow-100 text-yellow-700',
    critico: 'bg-red-100 text-red-700',
  };

  const labels = {
    ok: 'OK',
    alerta: 'Alerta',
    critico: 'Crítico',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function ShoppingGrid() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [markers, setMarkers] = useState<Record<string, MarkerColor>>({});
  const [markerFilter, setMarkerFilter] = useState<MarkerColor | 'all'>('all');
  const [showDashboard, setShowDashboard] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({
    sku: [],
    produto: [],
    status: [],
  });

  // Carregar marcadores do localStorage
  useEffect(() => {
    setMarkers(getAllMarkers());
  }, []);

  // Obter valores únicos para cada coluna
  const uniqueValues = useMemo(() => {
    return {
      sku: Array.from(new Set(sampleData.map((item) => item.sku))),
      produto: Array.from(new Set(sampleData.map((item) => item.produto))),
      status: Array.from(
        new Set(sampleData.map((item) => item.status || 'ok'))
      ),
    };
  }, []);

  // Filtrar dados
  const filteredData = useMemo(() => {
    return sampleData.filter((item) => {
      if (filters.sku.length > 0 && !filters.sku.includes(item.sku)) {
        return false;
      }
      if (
        filters.produto.length > 0 &&
        !filters.produto.includes(item.produto)
      ) {
        return false;
      }
      if (
        filters.status.length > 0 &&
        !filters.status.includes(item.status || 'ok')
      ) {
        return false;
      }
      // Filtro por marcador
      if (markerFilter !== 'all') {
        const itemMarker = markers[item.sku];
        if (itemMarker !== markerFilter) {
          return false;
        }
      }
      return true;
    });
  }, [filters, markers, markerFilter]);

  const handleMarkerChange = (sku: string, color: MarkerColor) => {
    const newMarkers = { ...markers };
    if (color === null) {
      delete newMarkers[sku];
    } else {
      newMarkers[sku] = color;
    }
    setMarkers(newMarkers);
    saveMarker(sku, color);
  };

  const getRowStyle = (sku: string) => {
    const marker = markers[sku];
    if (!marker) return {};
    
    return {
      backgroundColor: marker === 'red' ? '#fee2e2' : marker === 'green' ? '#dcfce7' : '#fef9c3',
      borderLeft: `4px solid ${marker === 'red' ? '#ef4444' : marker === 'green' ? '#22c55e' : '#eab308'}`,
    };
  };

  const handleFilterChange = (columnKey: string, values: string[]) => {
    setFilters((prev) => ({
      ...prev,
      [columnKey]: values,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      sku: [],
      produto: [],
      status: [],
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
    const exportData = filteredData.map((item) => ({
      SKU: item.sku,
      Produto: item.produto,
      Estoque: item.estoque,
      PIMP: item.pimp,
      'Média Venda': item.mediaVenda,
      Sugestão: item.sugestao,
      Status: item.status,
    }));

    exportToExcel(exportData, 'sugestao-compra', 'Sugestão de Compra');
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
            onClick={() => setShowDashboard(!showDashboard)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors font-medium text-xs shadow-sm ${
              showDashboard
                ? 'bg-[#3E3F40] text-white'
                : 'border border-[#3E3F40] text-[#3E3F40] hover:bg-[#3E3F40] hover:text-white'
            }`}
          >
            <BarChart3 size={14} strokeWidth={1.5} />
            Dashboard
          </motion.button>
          <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 border border-[#3E3F40] text-[#3E3F40] px-4 py-2 rounded hover:bg-[#3E3F40] hover:text-white transition-colors font-medium text-xs shadow-sm"
          >
            <Download size={14} strokeWidth={1.5} />
            Exportar Excel
          </motion.button>
        </div>
      </div>

      {/* Dashboard de Marcadores */}
      <AnimatePresence>
        {showDashboard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <MarkerDashboard markers={markers} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legenda de Marcadores */}
      <MarkerLegend
        markers={markers}
        onFilter={setMarkerFilter}
        activeFilter={markerFilter}
      />

      {/* Tabela Excel-like */}
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
                    SKU
                    <ExcelFilter
                      columnKey="sku"
                      options={uniqueValues.sku}
                      selectedValues={filters.sku}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </th>
                <th className="text-left">
                  <div className="flex items-center gap-1">
                    Produto
                    <ExcelFilter
                      columnKey="produto"
                      options={uniqueValues.produto}
                      selectedValues={filters.produto}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </th>
                <th className="text-left">Estoque</th>
                <th className="text-left">PIMP</th>
                <th className="text-left">Média Venda</th>
                <th className="text-left">Sugestão</th>
                <th className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    Status
                    <ExcelFilter
                      columnKey="status"
                      options={uniqueValues.status}
                      selectedValues={filters.status}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </th>
                <th className="text-center w-20">Marcar</th>
                <th className="text-center w-20">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    Nenhum resultado encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  const marker = markers[item.sku];
                  const rowStyle = getRowStyle(item.sku);
                  
                  return (
                    <motion.tr
                      key={item.sku}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      style={rowStyle}
                      className={`${
                        hoveredRow === index && !marker ? 'bg-[#E7F3FF]' : ''
                      } transition-colors relative group`}
                      onMouseEnter={() => {
                        setHoveredRow(index);
                        if (marker) {
                          setHoveredTooltip(item.sku);
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredRow(null);
                        setHoveredTooltip(null);
                      }}
                    >
                    <td className="font-mono">{item.sku}</td>
                    <td>{item.produto}</td>
                    <td className="text-left tabular-nums">{item.estoque}</td>
                    <td className="text-left tabular-nums">{item.pimp}</td>
                    <td className="text-left tabular-nums">
                      {item.mediaVenda}
                    </td>
                    <td className="text-left tabular-nums font-semibold">
                      {item.sugestao}
                    </td>
                    <td className="text-center">
                      <StatusBadge status={item.status || 'ok'} />
                    </td>
                    <td className="text-center">
                      <RowMarker
                        currentColor={marker || null}
                        onColorChange={(color) => handleMarkerChange(item.sku, color)}
                        sku={item.sku}
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
                    {/* Tooltip ao hover em linha marcada */}
                    <AnimatePresence>
                      {hoveredTooltip === item.sku && marker && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 bg-[#3E3F40] text-white px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap pointer-events-none"
                        >
                          <div className="font-semibold mb-1">
                            {markerConfigs[marker].label}
                          </div>
                          <div className="text-white/80">
                            {markerConfigs[marker].description}
                          </div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[#3E3F40] rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.tr>
                  );
                })
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
