'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import KPIGrid from '@/components/dashboard/KPIGrid';
import ShoppingModule from '@/components/dashboard/ShoppingModule';
import ImportModule from '@/components/dashboard/ImportModule';
import PriceComparison from '@/components/dashboard/PriceComparison';
import InsightsHome from '@/components/dashboard/InsightsHome';
import JapAiAssistant from '@/components/ai/JapAiAssistant';

type ViewType = 'home' | 'dashboard' | 'import' | 'pricing';

export default function Home() {
  console.log('Renderizando Page');
  
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const renderContent = () => {
    console.log('Current View:', currentView);
    
    switch (currentView) {
      case 'home':
        return <InsightsHome setCurrentView={handleViewChange} />;
      case 'dashboard':
        return (
          <>
            <h1 className="text-3xl font-bold text-[#000000] mb-6">Dashboard</h1>
            <KPIGrid />
            <ShoppingModule />
          </>
        );
      case 'import':
        return (
          <>
            <h1 className="text-3xl font-bold text-[#000000] mb-6">Importação</h1>
            <ImportModule />
          </>
        );
      case 'pricing':
        return (
          <>
            <h1 className="text-3xl font-bold text-[#000000] mb-6">Shopping de Preços</h1>
            <PriceComparison />
          </>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-lg">
            <p className="text-[#000000]">View não encontrada</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0efee]">
      <Sidebar currentView={currentView} setCurrentView={handleViewChange} />
      <main className="ml-64 flex-1 p-6">
        {renderContent()}
      </main>
      <JapAiAssistant />
    </div>
  );
}
