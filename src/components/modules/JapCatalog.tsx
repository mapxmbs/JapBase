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
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pendente' };
      case 'processamento':
        return { icon: Clock, color: 'bg-blue-100 text-blue-700', label: 'Em Processamento' };
      case 'concluido':
        return { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Concluído' };
      case 'cancelado':
        return { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Cancelado' };
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end pb-6 border-b border-green-500">
        <div>
          <h1 className="text-4xl font-black text-black mb-2">Catálogo e Fichas Técnicas</h1>
          <p className="text-japura-grey">Gestão de fichas técnicas de produtos por marca</p>
        </div>
        <button className="px-6 py-3 bg-green-600 text-white rounded-japura hover:bg-green-700 flex items-center gap-2">
          <Plus size={20} />
          <span>Solicitar Nova Ficha</span>
        </button>
      </div>

      {/* Abas */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'todas', label: 'Todas as Fichas', count: fichas.length },
          { id: 'pendentes', label: 'Pendentes', count: fichas.filter(f => f.status === 'pendente').length },
          { id: 'concluidas', label: 'Concluídas', count: fichas.filter(f => f.status === 'concluido').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              px-6 py-3 font-semibold text-sm transition-colors relative
              ${activeTab === tab.id
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-japura-grey hover:text-black'
              }
            `}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-japura-grey" size={18} />
          <input
            type="text"
            placeholder="Buscar por produto, marca, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-japura focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-japura hover:bg-gray-50 flex items-center gap-2">
            <Filter size={18} />
            <span>Filtros</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-japura hover:bg-gray-50 flex items-center gap-2">
            <Download size={18} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Lista de Fichas */}
      <div className="space-y-4">
        {filteredFichas.map((ficha) => {
          const statusConfig = getStatusConfig(ficha.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div
              key={ficha.id}
              className="bg-japura-white rounded-japura shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-black text-black">{ficha.produto}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusConfig.color}`}>
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-semibold text-japura-grey uppercase mb-1">Marca</p>
                      <p className="text-sm font-semibold text-black">{ficha.marca}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-japura-grey uppercase mb-1">SKU</p>
                      <p className="text-sm font-semibold text-black">{ficha.sku}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-japura-grey uppercase mb-1">Data Solicitação</p>
                      <p className="text-sm text-japura-dark">
                        {new Date(ficha.dataSolicitacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  {ficha.responsavel && (
                    <div className="mt-3">
                      <p className="text-xs text-japura-grey">Responsável: <span className="font-semibold">{ficha.responsavel}</span></p>
                    </div>
                  )}
                  {ficha.observacoes && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <p className="text-sm text-japura-dark">{ficha.observacoes}</p>
                    </div>
                  )}
                </div>
                <div className="ml-6 flex gap-2">
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                    <FileText size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-japura-white p-6 rounded-japura shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-japura-grey uppercase">Total de Fichas</p>
            <BookOpen size={20} className="text-green-600" />
          </div>
          <p className="text-3xl font-black text-black">{fichas.length}</p>
        </div>
        <div className="bg-japura-white p-6 rounded-japura shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-japura-grey uppercase">Pendentes</p>
            <Clock size={20} className="text-yellow-600" />
          </div>
          <p className="text-3xl font-black text-black">
            {fichas.filter(f => f.status === 'pendente').length}
          </p>
        </div>
        <div className="bg-japura-white p-6 rounded-japura shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-japura-grey uppercase">Em Processamento</p>
            <Clock size={20} className="text-blue-600" />
          </div>
          <p className="text-3xl font-black text-black">
            {fichas.filter(f => f.status === 'processamento').length}
          </p>
        </div>
        <div className="bg-japura-white p-6 rounded-japura shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-japura-grey uppercase">Concluídas</p>
            <CheckCircle2 size={20} className="text-green-600" />
          </div>
          <p className="text-3xl font-black text-black">
            {fichas.filter(f => f.status === 'concluido').length}
          </p>
        </div>
      </div>
    </div>
  );
}
