/**
 * @app japaudit
 * @file page.tsx
 *
 * Skeleton do app JapAudit (Auditoria de Faturamento).
 *
 * Mapa arquitetural:
 * - Implementação atual: `src/components/modules/JapAudit.tsx`
 * - Futuro: app independente com Supabase próprio (schemas `audit.*`)
 */

'use client';

export default function JapAuditAppSkeleton() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-japura-bg">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-black text-japura-black">
          JapAudit – Skeleton de Aplicação
        </h1>
        <p className="text-sm text-japura-grey">
          Sistema lógico para auditoria de faturamento, comparação de preços e
          identificação de divergências. Hoje implementado como módulo do Hub.
        </p>
        <p className="text-xs text-japura-grey">
          Este app facilita a futura extração do JapAudit para um sistema
          independente, mantendo contratos e data products bem definidos.
        </p>
      </div>
    </main>
  );
}

