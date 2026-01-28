/**
 * @package @japbase/ui
 * @component DetachButton
 * 
 * Botão para desacoplar módulos em janelas separadas.
 * Permite que módulos sejam visualizados independentemente do Hub.
 */

'use client';

import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface DetachButtonProps {
  /** View atual para construir URL de desacoplamento */
  currentView: string;
}

export function DetachButton({ currentView }: DetachButtonProps) {
  const handleDetach = () => {
    const url = `${window.location.origin}${window.location.pathname}?view=${currentView}&detach=true`;
    window.open(url, '_blank', 'width=1400,height=900');
  };

  return (
    <motion.button
      onClick={handleDetach}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 bg-japura-primary text-white rounded-lg hover:bg-japura-dark transition-colors text-sm font-medium"
      title="Desacoplar em nova janela"
    >
      <ExternalLink size={16} />
      Desacoplar
    </motion.button>
  );
}
