'use client';

import { ExternalLink } from 'lucide-react';

interface DetachButtonProps {
  currentView: string;
}

export default function DetachButton({ currentView }: DetachButtonProps) {
  const handleDetach = () => {
    // Cria uma URL com o parâmetro da view atual e detach=true para ocultar sidebar
    const url = `${window.location.origin}?view=${currentView}&detach=true`;
    
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
      className="flex items-center gap-2 px-4 py-2 bg-japura-dark hover:bg-japura-black text-white rounded-lg transition-colors text-sm font-semibold shadow-sm"
      title="Desacoplar tela para outro monitor"
    >
      <ExternalLink size={16} />
      <span>Desacoplar</span>
    </button>
  );
}
