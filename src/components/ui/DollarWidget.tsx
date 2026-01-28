'use client';

import { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface CurrencyRate {
  value: number; // Valor em BRL
  timestamp: string;
  variation?: number;
}

interface DollarWidgetProps {
  standalone?: boolean;
}

export default function DollarWidget({ standalone = false }: DollarWidgetProps) {
  const [dollarRate, setDollarRate] = useState<CurrencyRate | null>(null);
  const [isLoadingDollar, setIsLoadingDollar] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Função para buscar cotação do dólar
  // TODO FUTURO: Integrar com API real (AwesomeAPI, BCB, ou n8n) para atualização automática
  const fetchDollarRate = async () => {
    setIsLoadingDollar(true);
    try {
      // TODO: Substituir por API real (ex: AwesomeAPI, BCB, ou n8n)
      // Por enquanto, usando mock com simulação de variação
      const mockRate: CurrencyRate = {
        value: 5.28 + (Math.random() * 0.1 - 0.05),
        timestamp: new Date().toISOString(),
        variation: (Math.random() * 0.5 - 0.25),
      };
      
      setDollarRate(mockRate);
      setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error('Erro ao buscar cotação:', error);
      // Fallback para valores padrão
      setDollarRate({
        value: 5.28,
        timestamp: new Date().toISOString(),
        variation: 0,
      });
    } finally {
      setIsLoadingDollar(false);
    }
  };

  useEffect(() => {
    fetchDollarRate();
    // TODO FUTURO: Atualizar automaticamente a cada 5 minutos quando API real estiver integrada
    // const interval = setInterval(fetchDollarRate, 5 * 60 * 1000);
    // return () => clearInterval(interval);
  }, []);

  const getVariationIcon = (variation?: number) => {
    if (!variation || variation === 0) return Minus;
    return variation > 0 ? TrendingUp : TrendingDown;
  };

  const getVariationColor = (variation?: number) => {
    if (!variation || variation === 0) return 'text-gray-600';
    return variation > 0 ? 'text-red-700' : 'text-green-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-japura-white rounded-japura shadow-md border-2 border-japura-black overflow-hidden"
    >
      <div className="bg-japura-black p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-japura-white rounded-lg">
              <DollarSign size={18} className="text-japura-black" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Dólar PTAX</h2>
              <p className="text-xs text-gray-400 mt-0.5">Cotação em tempo real</p>
            </div>
          </div>
          <button
            onClick={fetchDollarRate}
            disabled={isLoadingDollar}
            className="p-2 bg-japura-dark hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            title="Atualizar cotação"
          >
            <RefreshCw size={16} className={`text-white ${isLoadingDollar ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      <div className="p-4">
        {isLoadingDollar && !dollarRate ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-japura-black mx-auto"></div>
            <p className="text-xs text-japura-grey mt-2">Carregando cotação...</p>
          </div>
        ) : dollarRate ? (
          <>
            {/* Equivalência Principal */}
            <div className="mb-3 pb-3 border-b border-gray-200">
              <div className="flex items-baseline gap-2 mb-1.5">
                <p className="text-2xl font-black text-japura-black tabular-nums leading-none">
                  1 USD = R$ {dollarRate.value.toFixed(2)}
                </p>
                {dollarRate.variation !== undefined && dollarRate.variation !== 0 && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    dollarRate.variation > 0 
                      ? 'bg-red-50 text-red-700' 
                      : 'bg-green-50 text-green-700'
                  }`}>
                    {(() => {
                      const VariationIcon = getVariationIcon(dollarRate.variation);
                      return <VariationIcon size={12} />;
                    })()}
                    {Math.abs(dollarRate.variation).toFixed(2)}%
                  </div>
                )}
              </div>
              <p className="text-xs text-japura-grey">
                1 BRL = {(1 / dollarRate.value).toFixed(4)} USD
              </p>
            </div>

            {/* Informações Adicionais */}
            <div className="pt-2">
              <p className="text-xs text-japura-grey">
                Atualizado: {lastUpdate || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-xs text-japura-grey">Erro ao carregar cotação</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
