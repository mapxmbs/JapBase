'use client';

import { ExternalLink } from 'lucide-react';

interface DetachButtonProps {
  currentView: string;
  /** Tab ativa quando currentView é pricing (para preservar na URL) */
  pricingTab?: string;
}

export default function DetachButton({ currentView, pricingTab }: DetachButtonProps) {
  const handleDetach = () => {
    let url = `${window.location.origin}?view=${currentView}&detach=true`;
    if (currentView === 'pricing' && pricingTab) url += `&tab=${pricingTab}`;
    
    const width = window.screen.width * 0.85;
    const height = window.screen.height * 0.85;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const newWindow = window.open(
      url,
      `JapBase-${currentView}`,
      `width=${Math.round(width)},height=${Math.round(height)},left=${Math.round(left)},top=${Math.round(top)},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no`
    );
    
    if (newWindow) {
      newWindow.focus();
    }
  };

  return (
    <button
      onClick={handleDetach}
      className="flex items-center gap-2 px-3 py-1.5 min-h-[32px] border border-gray-400 rounded hover:bg-japura-bg text-sm font-medium text-japura-dark transition-colors"
      title="Desacoplar tela para outro monitor"
    >
      <span className="flex items-center justify-center w-[18px] h-[18px] shrink-0">
        <ExternalLink size={16} strokeWidth={2} />
      </span>
      <span>Desacoplar</span>
    </button>
  );
}
