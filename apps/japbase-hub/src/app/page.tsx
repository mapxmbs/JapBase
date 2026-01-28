/**
 * @app japbase-hub
 * @file page.tsx
 * 
 * Página principal do JapBase Hub.
 * 
 * Funciona como Shell/Orquestrador que:
 * - Renderiza módulos como componentes de integração
 * - Gerencia navegação e estado global
 * - Fornece layout unificado (Sidebar + conteúdo)
 * 
 * Os módulos são importados como componentes, mas futuramente
 * podem ser consumidos via APIs REST quando extraídos para polirepo.
 */

'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHome from '@/components/modules/DashboardHome';
import JapAudit from '@/components/modules/JapAudit';
import JapImport from '@/components/modules/JapImport';
import JapView from '@/components/modules/JapView';
import JapCatalog from '@/components/modules/JapCatalog';
import JapMarket from '@/components/modules/JapMarket';
import JapDistribution from '@/components/modules/JapDistribution';
import JapSales from '@/components/modules/JapSales';
import { DetachButton, AIAssistant } from '@japbase/ui';

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [isDetached, setIsDetached] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Suporta parâmetro de view via URL (para desacoplar módulos)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const detachParam = params.get('detach');
    
    if (viewParam) {
      setCurrentView(viewParam);
    }
    
    if (detachParam === 'true') {
      setIsDetached(true);
    }
  }, []);

  /**
   * Renderiza o conteúdo do módulo selecionado.
   * 
   * Futuramente, quando módulos forem extraídos para polirepo,
   * esta função pode consumir APIs REST em vez de importar componentes diretamente.
   */
  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <DashboardHome />;
      case 'audit':
        return <JapAudit />;
      case 'import':
        return <JapImport />;
      case 'view':
        return <JapView />;
      case 'catalog':
        return <JapCatalog />;
      case 'market':
        return <JapMarket />;
      case 'distribution':
        return <JapDistribution />;
      case 'sales':
        return <JapSales />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-japura-bg overflow-hidden">
      {/* Sidebar Container - Oculto quando desacoplado */}
      {!isDetached && (
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          isExpanded={isSidebarExpanded}
          setIsExpanded={setIsSidebarExpanded}
        />
      )}

      {/* Main Content com Scroll */}
      <main className={`${isDetached ? 'w-full' : 'flex-1'} h-full overflow-y-auto`}>
        <div className="max-w-[1600px] mx-auto p-8">
          {/* Botão Desacoplar - Aparece em todas as abas (apenas quando não está desacoplado) */}
          {!isDetached && (
            <div className="mb-6 flex justify-end">
              <DetachButton currentView={currentView} />
            </div>
          )}
          {renderContent()}
        </div>
        {/* Assistente de IA Global - Disponível em todas as páginas */}
        {!isDetached && <AIAssistant />}
      </main>
    </div>
  );
}
