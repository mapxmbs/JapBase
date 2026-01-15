'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import KPIGrid from '@/components/dashboard/KPIGrid';
import ShoppingGrid from '@/components/dashboard/ShoppingGrid';
import ImportTracker from '@/components/dashboard/ImportTracker';
import PriceComparison from '@/components/dashboard/PriceComparison';

type ViewType = 'dashboard' | 'import' | 'pricing';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <h1 className="text-3xl font-bold text-jap-black mb-6">Dashboard</h1>
            <KPIGrid />
            <ShoppingGrid />
          </>
        );
      case 'import':
        return (
          <>
            <h1 className="text-3xl font-bold text-jap-black mb-6">Importação</h1>
            <ImportTracker />
          </>
        );
      case 'pricing':
        return (
          <>
            <h1 className="text-3xl font-bold text-jap-black mb-6">Shopping de Preços</h1>
            <PriceComparison />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-jap-offwhite">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="ml-64 flex-1 p-6">
        {renderContent()}
      </main>
    </div>
  );
}
