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
        return { icon: AlertTriangle, color: 'bg-japura-bg text-japura-dark border border-gray-400', label: 'Pendente' };
      case 'resolvida':
        return { icon: CheckCircle2, color: 'bg-gray-100 text-japura-dark border border-gray-400', label: 'Resolvida' };
      case 'aprovada':
        return { icon: CheckCircle2, color: 'bg-gray-100 text-japura-black border border-gray-400', label: 'Aprovada' };
      default:
        return { icon: XCircle, color: 'bg-japura-bg text-japura-grey border border-gray-400', label: 'Erro' };
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-end pb-3 border-b border-gray-400">
        <div>
          <h1 className="text-lg font-semibold text-japura-black mb-1">Auditoria de Faturamento</h1>
          <p className="text-xs text-japura-grey">Confronto de notas fiscais com condições comerciais</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-gray-400 rounded hover:bg-japura-bg flex items-center gap-2 text-sm">
            <Calendar size={14} />
            <span>Processar Mês</span>
          </button>
          <button className="px-3 py-1.5 bg-japura-dark text-white rounded hover:bg-japura-black flex items-center gap-2 text-sm">
            <Download size={14} />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-japura-white rounded border border-gray-400 p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium text-japura-grey mb-1">Mês/Ano</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-400 rounded text-sm focus:outline-none focus:ring-1 focus:ring-japura-dark"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-japura-grey mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-400 rounded text-sm focus:outline-none focus:ring-1 focus:ring-japura-dark"
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendentes</option>
              <option value="resolvida">Resolvidas</option>
              <option value="aprovada">Aprovadas</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-3 py-1.5 bg-japura-dark text-white rounded hover:bg-japura-black flex items-center justify-center gap-2 text-sm">
              <Filter size={14} />
              <span>Aplicar</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="bg-japura-white p-2 rounded border border-gray-400 flex items-center gap-2">
          <div className="p-1.5 bg-japura-bg rounded border border-gray-200 shrink-0">
            <AlertTriangle size={14} className="text-japura-dark" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-japura-grey uppercase">Divergências Pendentes</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">{totalDivergencias}</p>
            <p className="text-[11px] text-japura-grey">Requerem ação</p>
          </div>
        </div>
        <div className="bg-japura-white p-2 rounded border border-gray-400 flex items-center gap-2">
          <div className="p-1.5 bg-japura-bg rounded border border-gray-200 shrink-0">
            <DollarSign size={14} className="text-japura-dark" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-japura-grey uppercase">Valor Divergente</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">
              R$ {totalValorDivergente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-japura-grey">Em análise</p>
          </div>
        </div>
        <div className="bg-japura-white p-2 rounded border border-gray-400 flex items-center gap-2">
          <div className="p-1.5 bg-gray-100 rounded border border-gray-200 shrink-0">
            <CheckCircle2 size={14} className="text-japura-dark" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-japura-grey uppercase">Resolvidas</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">
              {divergencias.filter(d => d.status === 'resolvida').length}
            </p>
            <p className="text-[11px] text-japura-grey">Este mês</p>
          </div>
        </div>
        <div className="bg-japura-white p-2 rounded border border-gray-400 flex items-center gap-2">
          <div className="p-1.5 bg-gray-100 rounded border border-gray-200 shrink-0">
            <FileCheck size={14} className="text-japura-dark" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-japura-grey uppercase">Total Auditado</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">{divergencias.length}</p>
            <p className="text-[11px] text-japura-grey">Notas fiscais</p>
          </div>
        </div>
      </div>

      {/* Tabela de Divergências */}
      <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
        <div className="p-2 border-b border-gray-400">
          <h3 className="text-base font-semibold text-japura-black">Divergências Identificadas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200 border-b border-gray-400">
              <tr>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase">Nota Fiscal</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase">Cliente</th>
                <th className="px-2 py-1 text-right text-xs font-semibold text-japura-grey uppercase">Valor Nota</th>
                <th className="px-2 py-1 text-right text-xs font-semibold text-japura-grey uppercase">Valor Esperado</th>
                <th className="px-2 py-1 text-right text-xs font-semibold text-japura-grey uppercase">Diferença</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase">Condição</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase">Status</th>
                <th className="px-2 py-1 text-center text-xs font-semibold text-japura-grey uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {divergencias.map((div) => {
                const statusConfig = getStatusConfig(div.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr key={div.id} className="hover:bg-japura-bg transition-colors">
                    <td className="px-2 py-1 text-xs font-semibold text-japura-black">{div.notaFiscal}</td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{div.cliente}</td>
                    <td className="px-2 py-1 text-xs text-right text-japura-dark">
                      R$ {div.valorNota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-2 py-1 text-xs text-right text-japura-dark">
                      R$ {div.valorEsperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-2 py-1 text-xs text-right">
                      <span className={`font-semibold ${div.diferenca > 0 ? 'text-japura-dark' : 'text-japura-grey'}`}>
                        {div.diferenca > 0 ? '+' : ''}R$ {div.diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{div.condicaoComercial}</td>
                    <td className="px-2 py-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 w-fit border ${statusConfig.color}`}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-2 py-1 text-center">
                      <div className="flex justify-center gap-1">
                        <button className="text-japura-dark hover:text-japura-black p-1">
                          <FileCheck size={14} />
                        </button>
                        <button className="text-japura-dark hover:text-japura-black p-1">
                          <CheckCircle2 size={14} />
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
      <div className="bg-japura-white rounded border border-gray-400 p-3">
        <h3 className="text-base font-semibold text-japura-black mb-2">Resumo de Economia Identificada</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="p-2 bg-japura-bg rounded border-l-2 border-japura-dark">
            <p className="text-[11px] font-medium text-japura-grey uppercase mb-0.5">Economia Potencial</p>
            <p className="text-base font-semibold text-japura-black">
              R$ {totalValorDivergente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-2 bg-gray-50 rounded border-l-2 border-gray-400">
            <p className="text-[11px] font-medium text-japura-grey uppercase mb-0.5">Notas Corretas</p>
            <p className="text-base font-semibold text-japura-black">
              {divergencias.filter(d => d.diferenca === 0).length}
            </p>
          </div>
          <div className="p-2 bg-gray-50 rounded border-l-2 border-gray-400">
            <p className="text-[11px] font-medium text-japura-grey uppercase mb-0.5">Taxa de Conformidade</p>
            <p className="text-base font-semibold text-japura-black">
              {((divergencias.filter(d => d.diferenca === 0).length / divergencias.length) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
