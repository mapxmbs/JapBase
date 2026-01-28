/**
 * @app japcatalog
 * @file page.tsx
 *
 * Skeleton do app JapCatalog (Fichas Técnicas e Produtos).
 *
 * Mapa arquitetural:
 * - Implementação atual: `src/components/modules/JapCatalog.tsx`
 * - Futuro: app independente com Supabase próprio (schemas `catalog.*`)
 */

'use client';

export default function JapCatalogAppSkeleton() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-japura-bg">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-black text-japura-black">
          JapCatalog – Skeleton de Aplicação
        </h1>
        <p className="text-sm text-japura-grey">
          Sistema lógico para gestão de fichas técnicas, produtos e documentos
          técnicos. Atualmente apresentado como módulo no JapBase Hub.
        </p>
        <p className="text-xs text-japura-grey">
          Este app será o destino natural quando o catálogo for extraído para
          um sistema totalmente independente.
        </p>
      </div>
    </main>
  );
}

