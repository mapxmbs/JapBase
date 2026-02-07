'use client';

import { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CurrencyRate {
  value: number;
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

  const fetchDollarRate = async () => {
    setIsLoadingDollar(true);
    try {
      const mockRate: CurrencyRate = {
        value: 5.28 + (Math.random() * 0.1 - 0.05),
        timestamp: new Date().toISOString(),
        variation: (Math.random() * 0.5 - 0.25),
      };
      setDollarRate(mockRate);
      setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      setDollarRate({ value: 5.28, timestamp: new Date().toISOString(), variation: 0 });
    } finally {
      setIsLoadingDollar(false);
    }
  };

  useEffect(() => {
    fetchDollarRate();
  }, []);

  const getVariationIcon = (variation?: number) => {
    if (!variation || variation === 0) return Minus;
    return variation > 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div className="bg-japura-white rounded border border-japura-black overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-300 bg-japura-bg px-2 py-1.5">
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-japura-black" strokeWidth={2} />
          <span className="text-sm font-semibold text-japura-black">Dólar PTAX</span>
        </div>
        <button
          onClick={fetchDollarRate}
          disabled={isLoadingDollar}
          className="p-1 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
          title="Atualizar cotação"
        >
          <RefreshCw size={12} className={isLoadingDollar ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="p-2">
        {isLoadingDollar && !dollarRate ? (
          <div className="text-center py-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-japura-black mx-auto" />
            <p className="text-[11px] text-japura-grey mt-1">Carregando...</p>
          </div>
        ) : dollarRate ? (
          <>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-semibold text-japura-black tabular-nums">
                1 USD = R$ {dollarRate.value.toFixed(2)}
              </p>
              {dollarRate.variation !== undefined && dollarRate.variation !== 0 && (
                <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  dollarRate.variation > 0 ? 'bg-japura-bg text-japura-dark' : 'bg-japura-bg text-japura-grey'
                }`}>
                  {(() => {
                    const VariationIcon = getVariationIcon(dollarRate.variation);
                    return <VariationIcon size={10} />;
                  })()}
                  {Math.abs(dollarRate.variation).toFixed(2)}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-japura-grey mt-0.5">
              1 BRL = {(1 / dollarRate.value).toFixed(4)} USD • Atualizado: {lastUpdate}
            </p>
          </>
        ) : (
          <p className="text-[11px] text-japura-grey text-center py-2">Erro ao carregar</p>
        )}
      </div>
    </div>
  );
}
