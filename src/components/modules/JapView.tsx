'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Filter,
  Download,
  Search,
  DollarSign,
  FileText,
  Grid3x3,
  Table2,
  PieChart,
  LineChart,
  Settings,
  Plus,
  X,
  ChevronDown
} from 'lucide-react';

type ViewMode = 'table' | 'chart' | 'pivot';
type MetricType = 'faturamento' | 'quantidade' | 'ticket_medio' | 'clientes' | 'notas';

interface Venda {
  id: string;
  notaFiscal: string;
  data: string;
  cliente: string;
  vendedor: string;
  estado: string;
  cidade?: string;
  unidade?: string;
  canal: string;
  produto: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  desconto: number;
}

export default function JapView() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedClient, setSelectedClient] = useState('todos');
  const [selectedState, setSelectedState] = useState('todos');
  const [selectedCanal, setSelectedCanal] = useState('todos');
  const [selectedVendedor, setSelectedVendedor] = useState('todos');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(['faturamento', 'quantidade']);
  const [groupBy, setGroupBy] = useState<string>('cliente');
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const periods = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

  // Gerar dados mock extensos de vendas
  const generateVendas = (): Venda[] => {
    const clientes = [
      'Auto Peças XYZ', 'Distribuidora ABC', 'Revendedora 123', 'Comercial DEF', 'Atacado GHI', 
      'Varejo JKL', 'Pneus & Cia', 'Distribuidora Norte', 'Auto Center Sul', 'Mega Pneus',
      'Distribuidora Oeste', 'Pneus Premium', 'Auto Parts Center', 'Distribuidora Leste',
      'Pneus Express', 'Distribuidora Central', 'Auto Service', 'Pneus & Rodas', 'Distribuidora Sul',
      'Mega Auto Parts', 'Pneus Brasil', 'Distribuidora Nacional', 'Auto Center Premium'
    ];
    const vendedores = [
      'João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Paula', 'Carlos Mendes',
      'Fernanda Lima', 'Roberto Alves', 'Juliana Souza', 'Ricardo Oliveira', 'Patricia Rocha'
    ];
    const estados = ['AM', 'SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE', 'DF'];
    const cidades = [
      'Manaus', 'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre',
      'Curitiba', 'Florianópolis', 'Salvador', 'Goiânia', 'Recife', 'Fortaleza', 'Brasília'
    ];
    const canais = ['Atacado', 'Varejo', 'E-commerce', 'Distribuidor', 'Marketplace'];
    const produtos = [
      'Pneu 205/55R16', 'Pneu 185/65R15', 'Pneu 225/50R17', 'Pneu 195/60R15', 'Pneu 215/60R16',
      'Pneu 235/75R15', 'Pneu 265/70R16', 'Pneu 175/70R14', 'Pneu 245/45R18', 'Pneu 195/55R16',
      'Pneu 225/60R16', 'Pneu 185/60R15', 'Pneu 205/60R16', 'Pneu 215/55R17', 'Pneu 235/60R16'
    ];
    const unidades = [
      'Manaus - Centro', 'Manaus - Cidade Nova', 'São Paulo - SP', 'Rio de Janeiro - RJ',
      'Belo Horizonte - MG', 'Curitiba - PR', 'Porto Alegre - RS', 'Recife - PE',
      'Salvador - BA', 'Fortaleza - CE', 'Brasília - DF', 'Goiânia - GO'
    ];

    const vendas: Venda[] = [];
    const meses = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Janeiro a Dezembro
    
    meses.forEach((mes, mesIndex) => {
      const vendasNoMes = Math.floor(Math.random() * 80) + 40; // 40-120 vendas por mês
      
      for (let i = 0; i < vendasNoMes; i++) {
        const dia = Math.floor(Math.random() * 28) + 1;
        const quantidade = Math.floor(Math.random() * 150) + 10;
        const valorUnitario = Math.random() * 600 + 150;
        const desconto = Math.random() * 0.15;
        const estadoIndex = Math.floor(Math.random() * estados.length);
        
        vendas.push({
          id: `venda-${mesIndex}-${i + 1}`,
          notaFiscal: `NF-2024-${String(mesIndex * 1000 + i + 1).padStart(6, '0')}`,
          data: new Date(2024, mes, dia).toISOString().split('T')[0],
          cliente: clientes[Math.floor(Math.random() * clientes.length)],
          vendedor: vendedores[Math.floor(Math.random() * vendedores.length)],
          estado: estados[estadoIndex],
          cidade: cidades[estadoIndex] || cidades[0],
          unidade: unidades[estadoIndex] || unidades[0],
          canal: canais[Math.floor(Math.random() * canais.length)],
          produto: produtos[Math.floor(Math.random() * produtos.length)],
          quantidade,
          valorUnitario: Math.round(valorUnitario * 100) / 100,
          valorTotal: Math.round(quantidade * valorUnitario * (1 - desconto) * 100) / 100,
          desconto: Math.round(desconto * 100),
        });
      }
    });

    return vendas;
  };

  const [vendas] = useState<Venda[]>(generateVendas());

  // Filtrar vendas
  const vendasFiltradas = useMemo(() => {
    return vendas.filter(venda => {
      const matchPeriod = venda.data.startsWith(selectedPeriod);
      const matchClient = selectedClient === 'todos' || venda.cliente === selectedClient;
      const matchState = selectedState === 'todos' || venda.estado === selectedState;
      const matchCanal = selectedCanal === 'todos' || venda.canal === selectedCanal;
      const matchVendedor = selectedVendedor === 'todos' || venda.vendedor === selectedVendedor;
      const matchSearch = searchTerm === '' || 
        venda.notaFiscal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venda.produto.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchPeriod && matchClient && matchState && matchCanal && matchVendedor && matchSearch;
    });
  }, [vendas, selectedPeriod, selectedClient, selectedState, selectedCanal, selectedVendedor, searchTerm]);

  // Agregações dinâmicas
  const getAggregatedData = () => {
    let grouped: Record<string, any> = {};

    vendasFiltradas.forEach(venda => {
      const key = groupBy === 'cliente' ? venda.cliente :
                  groupBy === 'vendedor' ? venda.vendedor :
                  groupBy === 'estado' ? venda.estado :
                  groupBy === 'canal' ? venda.canal :
                  groupBy === 'produto' ? venda.produto :
                  groupBy === 'unidade' ? (venda.unidade || venda.estado) :
                  groupBy === 'cidade' ? (venda.cidade || venda.estado) :
                  groupBy === 'notaFiscal' ? venda.notaFiscal : venda.cliente;

      if (!grouped[key]) {
        grouped[key] = {
          key,
          faturamento: 0,
          quantidade: 0,
          notas: 0,
          clientes: new Set(),
        };
      }

      grouped[key].faturamento += venda.valorTotal;
      grouped[key].quantidade += venda.quantidade;
      grouped[key].notas += 1;
      grouped[key].clientes.add(venda.cliente);
    });

    return Object.values(grouped).map((item: any) => ({
      ...item,
      clientes: item.clientes.size,
      ticket_medio: item.notas > 0 ? item.faturamento / item.notas : 0,
    }));
  };

  const aggregatedData = getAggregatedData();

  const toggleMetric = (metric: MetricType) => {
    setSelectedMetrics(prev => {
      const newMetrics = prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric];
      // Garantir que sempre há pelo menos uma métrica selecionada
      return newMetrics.length > 0 ? newMetrics : ['faturamento'];
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-end pb-4 border-b-2 border-japura-dark">
        <div>
          <h1 className="text-4xl font-black text-japura-black mb-2">JapView</h1>
          <p className="text-japura-grey">Business Intelligence estratégico - Dados desde 2013 (Sispro)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            <Filter size={18} />
            <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
          </button>
          <button className="px-4 py-2 bg-japura-dark hover:bg-japura-black text-white rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm">
            <Download size={18} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Filtros Avançados - Colapsável */}
      {showFilters && (
        <div className="bg-gradient-to-br from-japura-white to-gray-50 rounded-japura shadow-sm border-2 border-gray-200 p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-japura-grey mb-1">Período</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-japura-dark text-sm"
              >
                {periods.map((period) => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-japura-grey mb-1">Cliente</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-japura-dark text-sm"
              >
                <option value="todos">Todos</option>
                {Array.from(new Set(vendas.map(v => v.cliente))).map(cliente => (
                  <option key={cliente} value={cliente}>{cliente}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-japura-grey mb-1">Estado</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-japura-dark text-sm"
              >
                <option value="todos">Todos</option>
                {Array.from(new Set(vendas.map(v => v.estado))).map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-japura-grey mb-1">Canal</label>
              <select
                value={selectedCanal}
                onChange={(e) => setSelectedCanal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-japura-dark text-sm"
              >
                <option value="todos">Todos</option>
                {Array.from(new Set(vendas.map(v => v.canal))).map(canal => (
                  <option key={canal} value={canal}>{canal}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-japura-grey mb-1">Vendedor</label>
              <select
                value={selectedVendedor}
                onChange={(e) => setSelectedVendedor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-japura-dark text-sm"
              >
                <option value="todos">Todos</option>
                {Array.from(new Set(vendas.map(v => v.vendedor))).map(vendedor => (
                  <option key={vendedor} value={vendedor}>{vendedor}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Controles de Visualização - Estilo QlikView */}
      <div className="bg-gradient-to-br from-japura-white to-gray-50 rounded-japura shadow-sm border-2 border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-japura-dark">Agrupar por:</span>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-japura-dark text-sm"
              >
                <option value="cliente">Cliente</option>
                <option value="vendedor">Vendedor</option>
                <option value="estado">Estado</option>
                <option value="cidade">Cidade</option>
                <option value="unidade">Unidade</option>
                <option value="canal">Canal</option>
                <option value="produto">Produto</option>
                <option value="notaFiscal">Nota Fiscal</option>
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-japura-dark">Métricas:</span>
              {(['faturamento', 'quantidade', 'ticket_medio', 'clientes', 'notas'] as MetricType[]).map(metric => (
                <button
                  key={metric}
                  onClick={() => toggleMetric(metric)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedMetrics.includes(metric)
                      ? 'bg-japura-dark text-white'
                      : 'bg-gray-100 text-japura-dark hover:bg-gray-200'
                  }`}
                >
                  {metric === 'faturamento' ? 'Faturamento' :
                   metric === 'quantidade' ? 'Quantidade' :
                   metric === 'ticket_medio' ? 'Ticket Médio' :
                   metric === 'clientes' ? 'Clientes' : 'Notas'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-japura-dark text-white' : 'bg-gray-100 text-japura-dark hover:bg-gray-200'}`}
              title="Tabela"
            >
              <Table2 size={18} />
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`p-2 rounded-lg ${viewMode === 'chart' ? 'bg-japura-dark text-white' : 'bg-gray-100 text-japura-dark hover:bg-gray-200'}`}
              title="Gráfico"
            >
              <BarChart3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('pivot')}
              className={`p-2 rounded-lg ${viewMode === 'pivot' ? 'bg-japura-dark text-white' : 'bg-gray-100 text-japura-dark hover:bg-gray-200'}`}
              title="Tabela Dinâmica"
            >
              <Grid3x3 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-japura shadow-sm border-2 border-blue-200">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Faturamento</p>
          <p className="text-2xl font-black text-japura-black tabular-nums">
            R$ {aggregatedData.reduce((sum, item) => sum + item.faturamento, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-blue-600 mt-1">Total acumulado</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-japura shadow-sm border-2 border-green-200">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Quantidade</p>
          <p className="text-2xl font-black text-japura-black tabular-nums">
            {aggregatedData.reduce((sum, item) => sum + item.quantidade, 0).toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-green-600 mt-1">Unidades vendidas</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-japura shadow-sm border-2 border-purple-200">
          <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">Ticket Médio</p>
          <p className="text-2xl font-black text-japura-black tabular-nums">
            R$ {(() => {
              const totalFaturamento = aggregatedData.reduce((sum, item) => sum + item.faturamento, 0);
              const totalNotas = aggregatedData.reduce((sum, item) => sum + item.notas, 0);
              return totalNotas > 0 
                ? (totalFaturamento / totalNotas).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '0,00';
            })()}
          </p>
          <p className="text-xs text-purple-600 mt-1">Por nota fiscal</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-japura shadow-sm border-2 border-orange-200">
          <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">Clientes</p>
          <p className="text-2xl font-black text-japura-black tabular-nums">
            {aggregatedData.reduce((sum, item) => sum + item.clientes, 0)}
          </p>
          <p className="text-xs text-orange-600 mt-1">Clientes únicos</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-japura shadow-sm border-2 border-red-200">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Notas Fiscais</p>
          <p className="text-2xl font-black text-japura-black tabular-nums">
            {aggregatedData.reduce((sum, item) => sum + item.notas, 0)}
          </p>
          <p className="text-xs text-red-600 mt-1">NFs emitidas</p>
        </div>
      </div>

      {/* Visualização - Tabela */}
      {viewMode === 'table' && aggregatedData.length > 0 && (
        <div className="bg-japura-white rounded-japura shadow-sm border-2 border-gray-200 overflow-hidden">
          <div className="p-4 border-b-2 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-black text-japura-black">
              Análise por {groupBy === 'cliente' ? 'Cliente' : 
                          groupBy === 'vendedor' ? 'Vendedor' : 
                          groupBy === 'estado' ? 'Estado' : 
                          groupBy === 'cidade' ? 'Cidade' :
                          groupBy === 'unidade' ? 'Unidade' :
                          groupBy === 'canal' ? 'Canal' : 
                          groupBy === 'produto' ? 'Produto' : 'Nota Fiscal'}
            </h3>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white text-sm flex items-center gap-2">
              <Download size={14} />
              Exportar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-400">
                  <th className="px-4 py-3 text-left text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                    {groupBy === 'cliente' ? 'Cliente' : 
                     groupBy === 'vendedor' ? 'Vendedor' : 
                     groupBy === 'estado' ? 'Estado' : 
                     groupBy === 'cidade' ? 'Cidade' :
                     groupBy === 'unidade' ? 'Unidade' :
                     groupBy === 'canal' ? 'Canal' : 
                     groupBy === 'produto' ? 'Produto' : 'Nota Fiscal'}
                  </th>
                  {selectedMetrics.includes('faturamento') && (
                    <th className="px-4 py-3 text-right text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                      Faturamento
                    </th>
                  )}
                  {selectedMetrics.includes('quantidade') && (
                    <th className="px-4 py-3 text-right text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                      Quantidade
                    </th>
                  )}
                  {selectedMetrics.includes('ticket_medio') && (
                    <th className="px-4 py-3 text-right text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                      Ticket Médio
                    </th>
                  )}
                  {selectedMetrics.includes('clientes') && (
                    <th className="px-4 py-3 text-right text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                      Clientes
                    </th>
                  )}
                  {selectedMetrics.includes('notas') && (
                    <th className="px-4 py-3 text-right text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                      Notas
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {aggregatedData
                  .sort((a, b) => b.faturamento - a.faturamento)
                  .slice(0, 20)
                  .map((item, index) => (
                    <tr
                      key={`${item.key}-${index}`}
                      className={`hover:bg-japura-bg transition-colors border-b border-gray-300 ${
                        index % 2 === 0 ? 'bg-japura-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-semibold text-japura-black border-r border-gray-300">
                        {item.key}
                      </td>
                      {selectedMetrics.includes('faturamento') && (
                        <td className="px-4 py-3 text-sm text-right text-japura-black tabular-nums border-r border-gray-300">
                          R$ {item.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      )}
                      {selectedMetrics.includes('quantidade') && (
                        <td className="px-4 py-3 text-sm text-right text-japura-dark tabular-nums border-r border-gray-300">
                          {item.quantidade.toLocaleString('pt-BR')}
                        </td>
                      )}
                      {selectedMetrics.includes('ticket_medio') && (
                        <td className="px-4 py-3 text-sm text-right text-japura-dark tabular-nums border-r border-gray-300">
                          R$ {item.ticket_medio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      )}
                      {selectedMetrics.includes('clientes') && (
                        <td className="px-4 py-3 text-sm text-right text-japura-dark tabular-nums border-r border-gray-300">
                          {item.clientes}
                        </td>
                      )}
                      {selectedMetrics.includes('notas') && (
                        <td className="px-4 py-3 text-sm text-right text-japura-dark tabular-nums border-r border-gray-300">
                          {item.notas}
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {aggregatedData.length === 0 && (
            <div className="p-8 text-center text-japura-grey">
              <p>Nenhum dado encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      )}
      
      {viewMode === 'table' && aggregatedData.length === 0 && (
        <div className="bg-japura-white rounded-japura shadow-sm border border-gray-300 p-8 text-center">
          <p className="text-japura-grey">Nenhum dado encontrado com os filtros selecionados.</p>
        </div>
      )}

      {/* Visualização - Gráfico */}
      {viewMode === 'chart' && (
        <div className="bg-japura-white rounded-japura shadow-sm border border-gray-300 p-6">
          <h3 className="text-lg font-black text-japura-black mb-4">
            Gráfico de {groupBy === 'cliente' ? 'Clientes' : 
                       groupBy === 'vendedor' ? 'Vendedores' : 
                       groupBy === 'estado' ? 'Estados' : 
                       groupBy === 'cidade' ? 'Cidades' :
                       groupBy === 'unidade' ? 'Unidades' :
                       groupBy === 'canal' ? 'Canais' : 'Produtos'}
          </h3>
          <div className="space-y-4">
            {/* Gráfico de barras simples */}
            <div className="space-y-3">
              {aggregatedData
                .sort((a, b) => b.faturamento - a.faturamento)
                .slice(0, 10)
                .map((item, index) => {
                  const maxFaturamento = Math.max(...aggregatedData.map(d => d.faturamento));
                  const porcentagem = (item.faturamento / maxFaturamento) * 100;
                  
                  return (
                    <div key={`${item.key}-${index}`} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-japura-dark truncate flex-1 mr-4">{item.key}</span>
                        <span className="text-japura-black font-bold tabular-nums">
                          R$ {item.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-japura-dark to-japura-black h-full rounded-full transition-all duration-500"
                          style={{ width: `${porcentagem}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-japura-grey">
                        <span>Qtd: {item.quantidade.toLocaleString('pt-BR')}</span>
                        <span>Notas: {item.notas}</span>
                        <span>Ticket Médio: R$ {item.ticket_medio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
            {aggregatedData.length === 0 && (
              <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3 size={48} className="mx-auto text-japura-grey mb-2" />
                  <p className="text-japura-grey">Nenhum dado encontrado com os filtros selecionados</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visualização - Tabela Dinâmica */}
      {viewMode === 'pivot' && (
        <div className="bg-japura-white rounded-japura shadow-sm border border-gray-300 p-6">
          <h3 className="text-lg font-black text-japura-black mb-4">Tabela Dinâmica</h3>
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Grid3x3 size={48} className="mx-auto text-japura-grey mb-2" />
              <p className="text-japura-grey">Tabela dinâmica será implementada</p>
              <p className="text-xs text-japura-grey mt-2">Permitirá arrastar e soltar dimensões e métricas</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabela Detalhada de Notas Fiscais */}
      <div className="bg-japura-white rounded-japura shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="p-4 border-b-2 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-japura-black">Detalhamento por Nota Fiscal</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-japura-grey" size={16} />
              <input
                type="text"
                placeholder="Buscar NF, cliente, produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-japura-dark w-64 text-sm"
              />
            </div>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-white text-sm flex items-center gap-2">
              <Download size={14} />
              Exportar
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-400">
                <th className="px-3 py-2 text-left text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                  NF
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                  Data
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                  Cliente
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                  Vendedor
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                  Estado
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                  Canal
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                  Produto
                </th>
                <th className="px-3 py-2 text-right text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                  Qtd
                </th>
                <th className="px-3 py-2 text-right text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                  Valor Unit.
                </th>
                <th className="px-3 py-2 text-right text-xs font-bold text-japura-black uppercase tracking-wider border-r border-gray-400 bg-gray-200">
                  Desconto
                </th>
                <th className="px-3 py-2 text-right text-xs font-bold text-japura-black uppercase tracking-wider bg-gray-200">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.slice(0, 50).map((venda, index) => (
                <tr
                  key={venda.id}
                  className={`hover:bg-japura-bg transition-colors border-b border-gray-300 ${
                    index % 2 === 0 ? 'bg-japura-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-3 py-2 text-sm font-semibold text-japura-black border-r border-gray-300">
                    {venda.notaFiscal}
                  </td>
                  <td className="px-3 py-2 text-sm text-japura-dark border-r border-gray-300">
                    {new Date(venda.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-3 py-2 text-sm text-japura-dark border-r border-gray-300">
                    {venda.cliente}
                  </td>
                  <td className="px-3 py-2 text-sm text-japura-dark border-r border-gray-300">
                    {venda.vendedor}
                  </td>
                  <td className="px-3 py-2 text-sm text-japura-dark border-r border-gray-300">
                    {venda.estado}
                  </td>
                  <td className="px-3 py-2 text-sm text-japura-dark border-r border-gray-300">
                    {venda.canal}
                  </td>
                  <td className="px-3 py-2 text-sm text-japura-dark border-r border-gray-300">
                    {venda.produto}
                  </td>
                  <td className="px-3 py-2 text-sm text-right text-japura-dark tabular-nums border-r border-gray-300">
                    {venda.quantidade}
                  </td>
                  <td className="px-3 py-2 text-sm text-right text-japura-dark tabular-nums border-r border-gray-300">
                    R$ {venda.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-2 text-sm text-right text-japura-dark tabular-nums border-r border-gray-300">
                    {venda.desconto}%
                  </td>
                  <td className="px-3 py-2 text-sm text-right font-semibold text-japura-black tabular-nums">
                    R$ {venda.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-400 bg-gray-100 text-xs text-japura-grey flex justify-between">
          <span>Mostrando {Math.min(50, vendasFiltradas.length)} de {vendasFiltradas.length} notas fiscais</span>
          <div className="flex gap-2">
            <button className="px-2 py-1 border border-gray-300 rounded hover:bg-white transition-colors">Anterior</button>
            <button className="px-2 py-1 border border-gray-300 rounded hover:bg-white transition-colors">Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
}
