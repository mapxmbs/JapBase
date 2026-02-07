'use client';

import { useState } from 'react';
import {
  BookOpen,
  Search,
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Download
} from 'lucide-react';

type FichaStatus = 'pendente' | 'processamento' | 'concluido' | 'cancelado';

interface FichaTecnica {
  id: string;
  produto: string;
  marca: string;
  sku: string;
  status: FichaStatus;
  dataSolicitacao: string;
  responsavel?: string;
  observacoes?: string;
}

export default function JapCatalog() {
  const [activeTab, setActiveTab] = useState<'todas' | 'pendentes' | 'concluidas'>('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const fichas: FichaTecnica[] = [
    {
      id: '1',
      produto: 'Pneu 205/55R16 91V',
      marca: 'Michelin',
      sku: 'MIC-205-55-16',
      status: 'pendente',
      dataSolicitacao: '2025-01-15',
      observacoes: 'Aguardando informações técnicas',
    },
    {
      id: '2',
      produto: 'Pneu 185/65R15 88H',
      marca: 'Continental',
      sku: 'CON-185-65-15',
      status: 'processamento',
      dataSolicitacao: '2025-01-10',
      responsavel: 'Equipe Técnica',
    },
    {
      id: '3',
      produto: 'Pneu 225/50R17 98Y',
      marca: 'Bridgestone',
      sku: 'BRI-225-50-17',
      status: 'concluido',
      dataSolicitacao: '2025-01-05',
      responsavel: 'Equipe Técnica',
    },
  ];

  const getStatusConfig = (status: FichaStatus) => {
    switch (status) {
      case 'pendente':
        return { icon: Clock, color: 'bg-japura-bg text-japura-dark border border-gray-400', label: 'Pendente' };
      case 'processamento':
        return { icon: Clock, color: 'bg-gray-100 text-japura-dark border border-gray-400', label: 'Em Processamento' };
      case 'concluido':
        return { icon: CheckCircle2, color: 'bg-gray-100 text-japura-black border border-gray-400', label: 'Concluído' };
      case 'cancelado':
        return { icon: XCircle, color: 'bg-japura-bg text-japura-grey border border-gray-400', label: 'Cancelado' };
    }
  };

  const filteredFichas = fichas.filter((ficha) => {
    const matchesSearch = ficha.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ficha.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ficha.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'pendentes') return matchesSearch && ficha.status === 'pendente';
    if (activeTab === 'concluidas') return matchesSearch && ficha.status === 'concluido';
    return matchesSearch;
  });

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-end pb-3 border-b border-gray-400">
        <div>
          <h1 className="text-lg font-semibold text-japura-black mb-1">Catálogo e Fichas Técnicas</h1>
          <p className="text-xs text-japura-grey">Gestão de fichas técnicas de produtos por marca</p>
        </div>
        <button className="px-3 py-1.5 bg-japura-dark text-white rounded hover:bg-japura-black flex items-center gap-2 text-sm">
          <Plus size={14} />
          <span>Solicitar Nova Ficha</span>
        </button>
      </div>

      {/* Abas */}
      <div className="flex gap-2 border-b border-gray-400">
        {[
          { id: 'todas', label: 'Todas as Fichas', count: fichas.length },
          { id: 'pendentes', label: 'Pendentes', count: fichas.filter(f => f.status === 'pendente').length },
          { id: 'concluidas', label: 'Concluídas', count: fichas.filter(f => f.status === 'concluido').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 font-medium text-sm transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-japura-black border-japura-dark'
                : 'text-japura-grey hover:text-japura-dark border-transparent'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 rounded text-xs border border-gray-300">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="flex justify-between items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-japura-grey" size={14} />
          <input
            type="text"
            placeholder="Buscar por produto, marca, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-gray-400 rounded text-sm focus:outline-none focus:ring-1 focus:ring-japura-dark"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-gray-400 rounded hover:bg-japura-bg flex items-center gap-2 text-sm">
            <Filter size={14} />
            <span>Filtros</span>
          </button>
          <button className="px-3 py-1.5 border border-gray-400 rounded hover:bg-japura-bg flex items-center gap-2 text-sm">
            <Download size={14} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Lista de Fichas - Tabela densa */}
      <div className="bg-japura-white rounded border border-gray-400 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200 border-b border-gray-400">
              <tr>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase">Produto</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase">Marca</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase">SKU</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase">Status</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase">Data Solicitação</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase">Responsável</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-japura-grey uppercase">Observações</th>
                <th className="px-2 py-1 text-center text-xs font-semibold text-japura-grey uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFichas.map((ficha) => {
                const statusConfig = getStatusConfig(ficha.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <tr key={ficha.id} className="hover:bg-japura-bg transition-colors">
                    <td className="px-2 py-1 text-xs font-semibold text-japura-black">{ficha.produto}</td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{ficha.marca}</td>
                    <td className="px-2 py-1 text-xs text-japura-dark">{ficha.sku}</td>
                    <td className="px-2 py-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 w-fit border ${statusConfig.color}`}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-2 py-1 text-xs text-japura-dark">
                      {new Date(ficha.dataSolicitacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-2 py-1 text-xs text-japura-grey">{ficha.responsavel || '-'}</td>
                    <td className="px-2 py-1 text-xs text-japura-grey max-w-[200px] truncate">{ficha.observacoes || '-'}</td>
                    <td className="px-2 py-1 text-center">
                      <button className="p-1 text-japura-dark hover:text-japura-black">
                        <FileText size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estatísticas - linha compacta */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="bg-japura-white p-2 rounded border border-gray-400 flex items-center gap-2">
          <BookOpen size={14} className="text-japura-dark shrink-0" />
          <div>
            <p className="text-[11px] font-medium text-japura-grey uppercase">Total de Fichas</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">{fichas.length}</p>
          </div>
        </div>
        <div className="bg-japura-white p-2 rounded border border-gray-400 flex items-center gap-2">
          <Clock size={14} className="text-japura-dark shrink-0" />
          <div>
            <p className="text-[11px] font-medium text-japura-grey uppercase">Pendentes</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">
              {fichas.filter(f => f.status === 'pendente').length}
            </p>
          </div>
        </div>
        <div className="bg-japura-white p-2 rounded border border-gray-400 flex items-center gap-2">
          <Clock size={14} className="text-japura-dark shrink-0" />
          <div>
            <p className="text-[11px] font-medium text-japura-grey uppercase">Em Processamento</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">
              {fichas.filter(f => f.status === 'processamento').length}
            </p>
          </div>
        </div>
        <div className="bg-japura-white p-2 rounded border border-gray-400 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-japura-dark shrink-0" />
          <div>
            <p className="text-[11px] font-medium text-japura-grey uppercase">Concluídas</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">
              {fichas.filter(f => f.status === 'concluido').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
