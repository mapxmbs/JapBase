/**
 * @app japdistribution
 * @file page.tsx
 *
 * Skeleton do app JapDistribution (Distribuição Inteligente).
 *
 * Mapa arquitetural:
 * - Implementação atual: `src/components/modules/JapDistribution.tsx`
 * - Futuro: app independente com Supabase próprio (schemas `distribution.*`)
 */

'use client';

export default function JapDistributionAppSkeleton() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-japura-bg">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-black text-japura-black">
          JapDistribution – Skeleton de Aplicação
        </h1>
        <p className="text-sm text-japura-grey">
          Sistema lógico para simulações e planos de distribuição inteligente.
          Hoje a interface está implementada como módulo dentro do JapBase Hub.
        </p>
        <p className="text-xs text-japura-grey">
          Este app serve como alvo futuro para extração, mantendo a arquitetura
          polissistêmica e evitando retrabalho estrutural.
        </p>
      </div>
    </main>
  );
}

