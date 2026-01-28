/**
 * @app japsales
 * @file page.tsx
 *
 * Skeleton do app JapSales (Metas, Performance e Direcionamento Comercial).
 *
 * Mapa arquitetural:
 * - Implementação atual: `src/components/modules/JapSales.tsx`
 * - Futuro: app independente com Supabase próprio (schemas `sales.*`)
 */

'use client';

export default function JapSalesAppSkeleton() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-japura-bg">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-black text-japura-black">
          JapSales – Skeleton de Aplicação
        </h1>
        <p className="text-sm text-japura-grey">
          Sistema lógico para metas, performance comercial e direcionamento de
          vendas. A experiência atual está centralizada no JapBase Hub.
        </p>
        <p className="text-xs text-japura-grey">
          Este app representa a futura fronteira de extração do JapSales como
          sistema independente, mantendo alinhamento com a arquitetura
          polissistêmica evolutiva.
        </p>
      </div>
    </main>
  );
}

