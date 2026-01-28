/**
 * @app japview
 * @file page.tsx
 *
 * Skeleton do app JapView (BI Estratégico / Comercial).
 *
 * Este arquivo existe como MAPA ARQUITETURAL.
 * A implementação real hoje está em:
 * - `src/components/modules/JapView.tsx`
 *
 * Futuro:
 * - Migrar gradualmente a lógica de JapView para este app
 * - Expor APIs e data products próprios
 */

'use client';

export default function JapViewAppSkeleton() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-japura-bg">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-black text-japura-black">
          JapView – Skeleton de Aplicação
        </h1>
        <p className="text-sm text-japura-grey">
          Este app representa o sistema independente de BI Estratégico / Comercial.
          No momento, a implementação está concentrada no módulo
          `src/components/modules/JapView.tsx` dentro do JapBase Hub.
        </p>
        <p className="text-xs text-japura-grey">
          Quando estiver pronto para extração para polirepo, este app será o
          candidato natural para receber o frontend completo, serviços e integração
          com seu próprio Supabase.
        </p>
      </div>
    </main>
  );
}

