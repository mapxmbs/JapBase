'use client';

import { useState } from 'react';
import {
  Store,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Search,
  Upload,
  Download,
  Filter,
  DollarSign,
  MapPin
} from 'lucide-react';

interface ComparacaoPreco {
  id: string;
  produto: string;
  medida: string;
  nossoPreco: number;
  concorrente1: { nome: string; preco: number };
  concorrente2: { nome: string; preco: number };
  concorrente3: { nome: string; preco: number };
  economia: number;
  variacao: number;
  dataAnalise: string;
  estado: string;
}

export default function JapMarket() {
  const [selectedState, setSelectedState] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Gerar mais dados de comparação
  const generateComparacoes = (): ComparacaoPreco[] => {
    const produtos = [
      { nome: 'Pneu 205/55R16', medida: '205/55R16' },
      { nome: 'Pneu 185/65R15', medida: '185/65R15' },
      { nome: 'Pneu 225/50R17', medida: '225/50R17' },
      { nome: 'Pneu 195/60R15', medida: '195/60R15' },
      { nome: 'Pneu 215/60R16', medida: '215/60R16' },
      { nome: 'Pneu 235/75R15', medida: '235/75R15' },
      { nome: 'Pneu 265/70R16', medida: '265/70R16' },
      { nome: 'Pneu 175/70R14', medida: '175/70R14' },
      { nome: 'Pneu 245/45R18', medida: '245/45R18' },
      { nome: 'Pneu 195/55R16', medida: '195/55R16' },
    ];

    const concorrentes = [
      'Auto Pneus Premium', 'Distribuidora Nacional', 'Pneus Express', 'Mega Pneus',
      'Pneus & Cia', 'Auto Center Plus', 'Distribuidora Sul', 'Pneus Brasil'
    ];

    const estados = ['AM', 'SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE'];

    return produtos.flatMap((produto, prodIndex) => 
      estados.map((estado, estadoIndex) => {
        const nossoPreco = Math.random() * 300 + 300;
        const variacao = (Math.random() - 0.5) * 20; // -10% a +10%
        
        const concorrentesPrecos = Array.from({ length: 3 }, () => ({
          nome: concorrentes[Math.floor(Math.random() * concorrentes.length)],
          preco: nossoPreco * (1 + (Math.random() * 0.2 - 0.05)) // ±10% do nosso preço
        }));

        const menorPrecoConcorrente = Math.min(...concorrentesPrecos.map(c => c.preco));
        const economia = Math.max(0, menorPrecoConcorrente - nossoPreco);

        return {
          id: `${produto.medida}-${estado}-${estadoIndex}`,
          produto: produto.nome,
          medida: produto.medida,
          nossoPreco: Math.round(nossoPreco * 100) / 100,
          concorrente1: {
            nome: concorrentesPrecos[0].nome,
            preco: Math.round(concorrentesPrecos[0].preco * 100) / 100
          },
          concorrente2: {
            nome: concorrentesPrecos[1].nome,
            preco: Math.round(concorrentesPrecos[1].preco * 100) / 100
          },
          concorrente3: {
            nome: concorrentesPrecos[2].nome,
            preco: Math.round(concorrentesPrecos[2].preco * 100) / 100
          },
          economia: Math.round(economia * 100) / 100,
          variacao: Math.round(variacao * 100) / 100,
          dataAnalise: '2025-01-20',
          estado,
        };
      })
    );
  };

  const comparacoes = generateComparacoes();

  const comparacoesFiltradas = comparacoes.filter(c => {
    const matchState = selectedState === 'todos' || c.estado.toLowerCase() === selectedState.toLowerCase();
    const matchSearch = searchTerm === '' || 
      c.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.medida.toLowerCase().includes(searchTerm.toLowerCase());
    return matchState && matchSearch;
  });

  const kpis = {
    economiaMedia: comparacoesFiltradas.reduce((sum, c) => sum + c.economia, 0) / comparacoesFiltradas.length || 0,
    concorrentes: new Set(comparacoesFiltradas.flatMap(c => [c.concorrente1.nome, c.concorrente2.nome, c.concorrente3.nome])).size,
    acimaMedia: comparacoesFiltradas.filter(c => c.nossoPreco > (c.concorrente1.preco + c.concorrente2.preco + c.concorrente3.preco) / 3).length,
    abaixoMedia: comparacoesFiltradas.filter(c => c.nossoPreco < (c.concorrente1.preco + c.concorrente2.preco + c.concorrente3.preco) / 3).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end pb-6 border-b-2 border-yellow-500">
        <div>
          <h1 className="text-4xl font-black text-japura-black mb-2">Shopping de Preços</h1>
          <p className="text-japura-grey">Inteligência de mercado e análise de concorrência</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border-2 border-gray-300 rounded-japura hover:bg-gray-50 flex items-center gap-2 transition-colors font-semibold">
            <Upload size={18} />
            <span>Upload Planilha</span>
          </button>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-japura hover:bg-yellow-700 flex items-center gap-2 transition-colors font-semibold shadow-sm">
            <Download size={18} />
            <span>Exportar Análise</span>
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-japura-grey" size={18} />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-japura focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-japura focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="todos">Todos os Estados</option>
              <option value="am">Amazonas</option>
              <option value="sp">São Paulo</option>
              <option value="rj">Rio de Janeiro</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-japura focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-japura hover:bg-yellow-700 flex items-center justify-center gap-2">
              <Filter size={18} />
              <span>Aplicar</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPIs de Inteligência */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-japura shadow-sm border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-lg text-white shadow-md">
              <TrendingDown size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Economia Média</p>
          <p className="text-3xl font-black text-japura-black">
            R$ {kpis.economiaMedia.toFixed(2)}
          </p>
          <p className="text-xs text-green-600 mt-2">Por unidade</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-japura shadow-sm border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-lg text-white shadow-md">
              <Store size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Concorrentes Monitorados</p>
          <p className="text-3xl font-black text-japura-black">{kpis.concorrentes}</p>
          <p className="text-xs text-blue-600 mt-2">Ativos</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-japura shadow-sm border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500 rounded-lg text-white shadow-md">
              <AlertTriangle size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">Produtos Acima da Média</p>
          <p className="text-3xl font-black text-japura-black">{kpis.acimaMedia}</p>
          <p className="text-xs text-yellow-600 mt-2">Requerem atenção</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-japura shadow-sm border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-lg text-white shadow-md">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">Produtos Abaixo da Média</p>
          <p className="text-3xl font-black text-japura-black">{kpis.abaixoMedia}</p>
          <p className="text-xs text-purple-600 mt-2">Competitivos</p>
        </div>
      </div>

      {/* Tabela de Comparação */}
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-black text-black">Comparação de Preços</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-grey uppercase">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-grey uppercase">Medida</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-japura-grey uppercase">Nosso Preço</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-japura-grey uppercase">Concorrente A</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-japura-grey uppercase">Concorrente B</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-japura-grey uppercase">Concorrente C</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-japura-grey uppercase">Economia</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-japura-grey uppercase">Variação</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-japura-grey uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comparacoesFiltradas.slice(0, 50).map((comp) => (
                <tr key={comp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-black">{comp.produto}</td>
                  <td className="px-4 py-3 text-sm text-japura-dark">{comp.medida}</td>
                  <td className="px-4 py-3 text-sm text-right font-black text-black">
                    R$ {comp.nossoPreco.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-japura-dark">
                    R$ {comp.concorrente1.preco.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-japura-dark">
                    R$ {comp.concorrente2.preco.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-japura-dark">
                    R$ {comp.concorrente3.preco.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                    R$ {comp.economia.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-semibold ${comp.variacao < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {comp.variacao > 0 ? '+' : ''}{comp.variacao.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-japura-dark">{comp.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sugestões de Preços */}
      <div className="bg-japura-white rounded-japura shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-black text-black mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-yellow-600" />
          Sugestões de Ajuste de Preço
        </h3>
        <div className="space-y-3">
          {[
            { produto: 'Pneu 225/50R17', sugestao: 'Reduzir 5% para competir', impacto: 'Alto' },
            { produto: 'Pneu 195/60R15', sugestao: 'Manter preço atual', impacto: 'Baixo' },
          ].map((item, index) => (
            <div key={index} className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-black">{item.produto}</p>
                  <p className="text-sm text-japura-dark mt-1">{item.sugestao}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.impacto === 'Alto' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  Impacto: {item.impacto}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
