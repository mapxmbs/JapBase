'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHome from '@/components/modules/DashboardHome';
import JapAudit from '@/components/modules/JapAudit';
import JapImport from '@/components/modules/JapImport';
import JapView from '@/components/modules/JapView';
import JapCatalog from '@/components/modules/JapCatalog';
import JapPricing from '@/components/modules/JapPricing';
import JapDistribution from '@/components/modules/JapDistribution';
import JapSales from '@/components/modules/JapSales';
import DetachButton from '@/components/ui/DetachButton';

type PricingTab = 'motor' | 'formacao' | 'market' | 'auditoria' | 'parametros' | 'historico';

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [pricingTab, setPricingTab] = useState<PricingTab>('motor');
  const [isDetached, setIsDetached] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Suporta parâmetro de view e tab via URL (para desacoplar)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const tabParam = params.get('tab') as PricingTab | null;
    const detachParam = params.get('detach');
    
    if (viewParam === 'market') {
      setCurrentView('pricing');
      setPricingTab('market');
    } else if (viewParam) {
      setCurrentView(viewParam);
      if (viewParam === 'pricing' && tabParam) setPricingTab(tabParam);
    }
    
    if (detachParam === 'true') setIsDetached(true);
  }, []);

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
      case 'pricing':
        return <JapPricing initialTab={pricingTab} onTabChange={setPricingTab} />;
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
        <div className="max-w-[1600px] mx-auto p-3">
          {/* Barra de ações - Desacoplar e Exportar (padronizados) */}
          {!isDetached && (
            <div className="mb-2 flex justify-end gap-2">
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('japbase-export'))}
                className="flex items-center gap-2 px-3 py-1.5 min-h-[32px] border border-gray-400 rounded hover:bg-japura-bg text-sm font-medium text-japura-dark transition-colors"
                title="Exportar (conforme módulo atual)"
              >
                <span className="flex items-center justify-center w-[18px] h-[18px] shrink-0">
                  <Download size={16} strokeWidth={2} />
                </span>
                <span>Exportar</span>
              </button>
              <DetachButton currentView={currentView} pricingTab={currentView === 'pricing' ? pricingTab : undefined} />
            </div>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
