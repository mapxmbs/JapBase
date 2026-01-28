/**
 * @app japmarket
 * @file page.tsx
 *
 * Skeleton do app JapMarket (Shopping de Preços e Precificação).
 *
 * Mapa arquitetural:
 * - Implementação atual: `src/components/modules/JapMarket.tsx`
 * - Futuro: app independente com Supabase próprio (schemas `market.*`)
 */

'use client';

export default function JapMarketAppSkeleton() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-japura-bg">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-black text-japura-black">
          JapMarket – Skeleton de Aplicação
        </h1>
        <p className="text-sm text-japura-grey">
          Sistema lógico para shopping de preços, análise de concorrentes e
          precificação estratégica. Hoje implementado como módulo do JapBase Hub.
        </p>
        <p className="text-xs text-japura-grey">
          Este app será usado quando o JapMarket for extraído para um sistema
          independente, com APIs e data products próprios.
        </p>
      </div>
    </main>
  );
}

