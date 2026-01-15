// Dados fictícios compartilhados para toda a plataforma

export interface ShoppingItem {
  sku: string;
  produto: string;
  estoque: number;
  pimp: number;
  mediaVenda: number;
  sugestao: number;
  status?: 'ok' | 'alerta' | 'critico';
  fornecedor?: string;
  preco?: number;
}

export interface PriceComparisonItem {
  medidaSku: string;
  nossoPreco: number;
  concorrenteA: number;
  concorrenteB: number;
  margem?: number;
}

export interface ImportProcess {
  numero: string;
  fornecedor: string;
  steps: ProcessStep[];
  previsaoChegada: string;
  valorTotal?: number;
  quantidadeItens?: number;
}

export interface ProcessStep {
  label: string;
  completed: boolean;
}

// Dados de Shopping/Compras
export const shoppingData: ShoppingItem[] = [
  {
    sku: 'SKU001',
    produto: 'Pneu 175/70R13 - Triangle',
    estoque: 45,
    pimp: 120,
    mediaVenda: 15,
    sugestao: 90,
    status: 'ok',
    fornecedor: 'Triangle Tyres',
    preco: 245.90,
  },
  {
    sku: 'SKU002',
    produto: 'Pneu 185/65R14 - Triangle',
    estoque: 32,
    pimp: 150,
    mediaVenda: 20,
    sugestao: 118,
    status: 'ok',
    fornecedor: 'Triangle Tyres',
    preco: 289.50,
  },
  {
    sku: 'SKU003',
    produto: 'Pneu 195/55R15 - Triangle',
    estoque: 28,
    pimp: 180,
    mediaVenda: 12,
    sugestao: 164,
    status: 'alerta',
    fornecedor: 'Triangle Tyres',
    preco: 325.00,
  },
  {
    sku: 'SKU004',
    produto: 'Pneu 205/55R16 - Michelin',
    estoque: 15,
    pimp: 200,
    mediaVenda: 8,
    sugestao: 193,
    status: 'alerta',
    fornecedor: 'Michelin',
    preco: 389.90,
  },
  {
    sku: 'SKU005',
    produto: 'Pneu 215/60R16 - Goodyear',
    estoque: 8,
    pimp: 250,
    mediaVenda: 5,
    sugestao: 247,
    status: 'critico',
    fornecedor: 'Goodyear',
    preco: 425.00,
  },
  {
    sku: 'SKU006',
    produto: 'Pneu 225/50R17 - Michelin',
    estoque: 50,
    pimp: 100,
    mediaVenda: 10,
    sugestao: 80,
    status: 'ok',
    fornecedor: 'Michelin',
    preco: 489.90,
  },
  {
    sku: 'SKU007',
    produto: 'Pneu 235/45R18 - Pirelli',
    estoque: 20,
    pimp: 130,
    mediaVenda: 7,
    sugestao: 110,
    status: 'alerta',
    fornecedor: 'Pirelli',
    preco: 550.00,
  },
  {
    sku: 'SKU008',
    produto: 'Pneu 245/40R19 - Bridgestone',
    estoque: 10,
    pimp: 180,
    mediaVenda: 3,
    sugestao: 170,
    status: 'critico',
    fornecedor: 'Bridgestone',
    preco: 610.00,
  },
  {
    sku: 'SKU009',
    produto: 'Pneu 255/35R20 - Michelin',
    estoque: 30,
    pimp: 110,
    mediaVenda: 11,
    sugestao: 95,
    status: 'ok',
    fornecedor: 'Michelin',
    preco: 720.00,
  },
  {
    sku: 'SKU010',
    produto: 'Pneu 265/30R22 - Pirelli',
    estoque: 25,
    pimp: 140,
    mediaVenda: 9,
    sugestao: 125,
    status: 'ok',
    fornecedor: 'Pirelli',
    preco: 850.00,
  },
  {
    sku: 'SKU011',
    produto: 'Pneu 175/65R14 - Triangle',
    estoque: 38,
    pimp: 95,
    mediaVenda: 18,
    sugestao: 75,
    status: 'ok',
    fornecedor: 'Triangle Tyres',
    preco: 220.00,
  },
  {
    sku: 'SKU012',
    produto: 'Pneu 185/60R15 - Goodyear',
    estoque: 22,
    pimp: 160,
    mediaVenda: 14,
    sugestao: 148,
    status: 'alerta',
    fornecedor: 'Goodyear',
    preco: 310.00,
  },
  {
    sku: 'SKU013',
    produto: 'Pneu 195/60R15 - Michelin',
    estoque: 42,
    pimp: 105,
    mediaVenda: 16,
    sugestao: 89,
    status: 'ok',
    fornecedor: 'Michelin',
    preco: 340.00,
  },
  {
    sku: 'SKU014',
    produto: 'Pneu 205/60R16 - Bridgestone',
    estoque: 18,
    pimp: 190,
    mediaVenda: 9,
    sugestao: 181,
    status: 'alerta',
    fornecedor: 'Bridgestone',
    preco: 410.00,
  },
  {
    sku: 'SKU015',
    produto: 'Pneu 215/55R17 - Pirelli',
    estoque: 12,
    pimp: 220,
    mediaVenda: 6,
    sugestao: 214,
    status: 'critico',
    fornecedor: 'Pirelli',
    preco: 520.00,
  },
];

// Dados de Comparação de Preços
export const priceComparisonData: PriceComparisonItem[] = [
  {
    medidaSku: '175/70R13',
    nossoPreco: 245.90,
    concorrenteA: 239.90,
    concorrenteB: 249.90,
    margem: 12.5,
  },
  {
    medidaSku: '185/65R14',
    nossoPreco: 289.50,
    concorrenteA: 295.00,
    concorrenteB: 310.00,
    margem: 15.2,
  },
  {
    medidaSku: '195/55R15',
    nossoPreco: 325.00,
    concorrenteA: 320.00,
    concorrenteB: 315.00,
    margem: 18.0,
  },
  {
    medidaSku: '205/55R16',
    nossoPreco: 389.90,
    concorrenteA: 395.00,
    concorrenteB: 400.00,
    margem: 20.5,
  },
  {
    medidaSku: '215/60R16',
    nossoPreco: 425.00,
    concorrenteA: 420.00,
    concorrenteB: 430.00,
    margem: 22.3,
  },
  {
    medidaSku: '225/50R17',
    nossoPreco: 489.90,
    concorrenteA: 485.00,
    concorrenteB: 495.00,
    margem: 25.0,
  },
  {
    medidaSku: '235/45R18',
    nossoPreco: 550.00,
    concorrenteA: 560.00,
    concorrenteB: 545.00,
    margem: 28.5,
  },
  {
    medidaSku: '245/40R19',
    nossoPreco: 610.00,
    concorrenteA: 600.00,
    concorrenteB: 620.00,
    margem: 30.2,
  },
  {
    medidaSku: '255/35R20',
    nossoPreco: 720.00,
    concorrenteA: 730.00,
    concorrenteB: 715.00,
    margem: 32.0,
  },
  {
    medidaSku: '265/30R22',
    nossoPreco: 850.00,
    concorrenteA: 840.00,
    concorrenteB: 860.00,
    margem: 35.5,
  },
  {
    medidaSku: '175/65R14',
    nossoPreco: 220.00,
    concorrenteA: 225.00,
    concorrenteB: 218.00,
    margem: 10.5,
  },
  {
    medidaSku: '185/60R15',
    nossoPreco: 310.00,
    concorrenteA: 305.00,
    concorrenteB: 315.00,
    margem: 16.8,
  },
];

// Dados de Importação
export const importProcessesData: ImportProcess[] = [
  {
    numero: 'PIMP 2025/001',
    fornecedor: 'Triangle Tyres',
    steps: [
      { label: 'Pedido', completed: true },
      { label: 'Embarque', completed: true },
      { label: 'Canal', completed: true },
      { label: 'Estoque', completed: false },
    ],
    previsaoChegada: '15/02',
    valorTotal: 1250000,
    quantidadeItens: 5000,
  },
  {
    numero: 'PIMP 2025/002',
    fornecedor: 'Triangle Tyres',
    steps: [
      { label: 'Pedido', completed: true },
      { label: 'Embarque', completed: true },
      { label: 'Canal', completed: false },
      { label: 'Estoque', completed: false },
    ],
    previsaoChegada: '20/02',
    valorTotal: 980000,
    quantidadeItens: 3800,
  },
  {
    numero: 'PIMP 2025/003',
    fornecedor: 'Goodyear',
    steps: [
      { label: 'Pedido', completed: true },
      { label: 'Embarque', completed: false },
      { label: 'Canal', completed: false },
      { label: 'Estoque', completed: false },
    ],
    previsaoChegada: '25/02',
    valorTotal: 2100000,
    quantidadeItens: 4200,
  },
  {
    numero: 'PIMP 2025/004',
    fornecedor: 'Michelin',
    steps: [
      { label: 'Pedido', completed: true },
      { label: 'Embarque', completed: true },
      { label: 'Canal', completed: true },
      { label: 'Estoque', completed: true },
    ],
    previsaoChegada: '10/02',
    valorTotal: 1850000,
    quantidadeItens: 3200,
  },
  {
    numero: 'PIMP 2025/005',
    fornecedor: 'Pirelli',
    steps: [
      { label: 'Pedido', completed: true },
      { label: 'Embarque', completed: true },
      { label: 'Canal', completed: true },
      { label: 'Estoque', completed: false },
    ],
    previsaoChegada: '18/02',
    valorTotal: 1650000,
    quantidadeItens: 2800,
  },
  {
    numero: 'PIMP 2025/006',
    fornecedor: 'Bridgestone',
    steps: [
      { label: 'Pedido', completed: true },
      { label: 'Embarque', completed: false },
      { label: 'Canal', completed: false },
      { label: 'Estoque', completed: false },
    ],
    previsaoChegada: '28/02',
    valorTotal: 1950000,
    quantidadeItens: 3500,
  },
];

// Cálculos agregados
export const getKPIData = () => {
  const emTransito = importProcessesData.filter(
    (p) => !p.steps.every((s) => s.completed)
  ).length;

  const sugestaoCompra = shoppingData.reduce(
    (sum, item) => sum + (item.sugestao * (item.preco || 0)),
    0
  );

  const divergencias = 3; // Valor fixo para exemplo

  return {
    emTransito,
    sugestaoCompra,
    divergencias,
  };
};

// Divergências fictícias
export const divergenciasData = [
  {
    id: 1,
    nfe: 'NF-e 4590',
    fornecedor: 'Michelin',
    valor: 2000,
    tipo: 'Diferença de quantidade',
    status: 'pendente',
  },
  {
    id: 2,
    nfe: 'NF-e 4591',
    fornecedor: 'Triangle Tyres',
    valor: 850,
    tipo: 'Diferença de preço',
    status: 'pendente',
  },
  {
    id: 3,
    nfe: 'NF-e 4592',
    fornecedor: 'Goodyear',
    valor: 1500,
    tipo: 'Item não recebido',
    status: 'pendente',
  },
];
