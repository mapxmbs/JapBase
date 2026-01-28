'use client';

import { useState } from 'react';
import {
  FileCheck,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Divergencia {
  id: string;
  notaFiscal: string;
  cliente: string;
  valorNota: number;
  valorEsperado: number;
  diferenca: number;
  condicaoComercial: string;
  dataEmissao: string;
  status: 'pendente' | 'resolvida' | 'aprovada';
}

export default function JapAudit() {
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [selectedStatus, setSelectedStatus] = useState('todos');

  const divergencias: Divergencia[] = [
    {
      id: '1',
      notaFiscal: 'NF-2025-001234',
      cliente: 'Auto Peças XYZ Ltda',
      valorNota: 125000.00,
      valorEsperado: 118750.00,
      diferenca: 6250.00,
      condicaoComercial: 'Atacado - 5%',
      dataEmissao: '2025-01-15',
      status: 'pendente',
    },
    {
      id: '2',
      notaFiscal: 'NF-2025-001567',
      cliente: 'Distribuidora ABC',
      valorNota: 89000.00,
      valorEsperado: 89000.00,
      diferenca: 0,
      condicaoComercial: 'Varejo - Padrão',
      dataEmissao: '2025-01-18',
      status: 'resolvida',
    },
    {
      id: '3',
      notaFiscal: 'NF-2025-001890',
      cliente: 'Revendedora 123',
      valorNota: 156000.00,
      valorEsperado: 148200.00,
      diferenca: 7800.00,
      condicaoComercial: 'Atacado - 5%',
      dataEmissao: '2025-01-20',
      status: 'pendente',
    },
  ];

  const totalDivergencias = divergencias.filter(d => d.status === 'pendente').length;
  const totalValorDivergente = divergencias
    .filter(d => d.status === 'pendente')
    .reduce((sum, d) => sum + d.diferenca, 0);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pendente':
        return { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700', label: 'Pendente' };
      case 'resolvida':
        return { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Resolvida' };
      case 'aprovada':
        return { icon: CheckCircle2, color: 'bg-blue-100 text-blue-700', label: 'Aprovada' };
      default:
        return { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Erro' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end pb-6 border-b border-red-500">
        <div>
          <h1 className="text-4xl font-black text-black mb-2">Auditoria de Faturamento</h1>
          <p className="text-japura-grey">Confronto de notas fiscais com condições comerciais</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-japura hover:bg-gray-50 flex items-center gap-2">
            <Calendar size={18} />
            <span>Processar Mês</span>
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-japura hover:bg-red-700 flex items-center gap-2">
            <Download size={18} />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-japura-grey mb-2">Mês/Ano</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-japura focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-japura-grey mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-japura focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendentes</option>
              <option value="resolvida">Resolvidas</option>
              <option value="aprovada">Aprovadas</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-japura hover:bg-red-700 flex items-center justify-center gap-2">
              <Filter size={18} />
              <span>Aplicar</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-japura-white p-6 rounded-japura shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-japura-grey uppercase tracking-wider mb-1">Divergências Pendentes</p>
          <p className="text-3xl font-black text-black">{totalDivergencias}</p>
          <p className="text-xs text-red-600 mt-2">Requerem ação</p>
        </div>
        <div className="bg-japura-white p-6 rounded-japura shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-japura-grey uppercase tracking-wider mb-1">Valor Divergente</p>
          <p className="text-3xl font-black text-black">
            R$ {totalValorDivergente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-yellow-600 mt-2">Em análise</p>
        </div>
        <div className="bg-japura-white p-6 rounded-japura shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-japura-grey uppercase tracking-wider mb-1">Resolvidas</p>
          <p className="text-3xl font-black text-black">
            {divergencias.filter(d => d.status === 'resolvida').length}
          </p>
          <p className="text-xs text-green-600 mt-2">Este mês</p>
        </div>
        <div className="bg-japura-white p-6 rounded-japura shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <FileCheck size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-japura-grey uppercase tracking-wider mb-1">Total Auditado</p>
          <p className="text-3xl font-black text-black">{divergencias.length}</p>
          <p className="text-xs text-japura-grey mt-2">Notas fiscais</p>
        </div>
      </div>

      {/* Tabela de Divergências */}
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-black text-black">Divergências Identificadas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-grey uppercase">Nota Fiscal</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-grey uppercase">Cliente</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-japura-grey uppercase">Valor Nota</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-japura-grey uppercase">Valor Esperado</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-japura-grey uppercase">Diferença</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-grey uppercase">Condição</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-grey uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-japura-grey uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {divergencias.map((div) => {
                const statusConfig = getStatusConfig(div.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr key={div.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-black">{div.notaFiscal}</td>
                    <td className="px-4 py-3 text-sm text-japura-dark">{div.cliente}</td>
                    <td className="px-4 py-3 text-sm text-right text-japura-dark">
                      R$ {div.valorNota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-japura-dark">
                      R$ {div.valorEsperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={`font-semibold ${div.diferenca > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {div.diferenca > 0 ? '+' : ''}R$ {div.diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-japura-dark">{div.condicaoComercial}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${statusConfig.color}`}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FileCheck size={18} />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <CheckCircle2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumo de Economia */}
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-black text-black mb-4">Resumo de Economia Identificada</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <p className="text-xs font-semibold text-japura-grey uppercase mb-1">Economia Potencial</p>
            <p className="text-2xl font-black text-green-700">
              R$ {totalValorDivergente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-xs font-semibold text-japura-grey uppercase mb-1">Notas Corretas</p>
            <p className="text-2xl font-black text-blue-700">
              {divergencias.filter(d => d.diferenca === 0).length}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <p className="text-xs font-semibold text-japura-grey uppercase mb-1">Taxa de Conformidade</p>
            <p className="text-2xl font-black text-yellow-700">
              {((divergencias.filter(d => d.diferenca === 0).length / divergencias.length) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
