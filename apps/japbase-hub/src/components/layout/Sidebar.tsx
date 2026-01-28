/**
 * @app japbase-hub
 * @component Sidebar
 * 
 * Sidebar de navegação do JapBase Hub.
 * 
 * Responsável por:
 * - Navegação entre módulos
 * - Branding Japurá Pneus
 * - Estado de expansão/colapso
 */

'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileCheck, 
  Anchor, 
  BarChart3, 
  BookOpen, 
  Store, 
  ArrowLeftRight,
  Target,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'audit', label: 'JapAudit', icon: FileCheck },
  { id: 'import', label: 'JapImport', icon: Anchor },
  { id: 'view', label: 'JapView', icon: BarChart3 },
  { id: 'catalog', label: 'JapCatalog', icon: BookOpen },
  { id: 'market', label: 'JapMarket', icon: Store },
  { id: 'distribution', label: 'JapDistribution', icon: ArrowLeftRight },
  { id: 'sales', label: 'JapSales', icon: Target },
];

export default function Sidebar({ currentView, setCurrentView, isExpanded, setIsExpanded }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);
  
  // Sidebar expande ao passar o mouse se estiver colapsada manualmente
  const shouldExpand = isExpanded || (isHovered && isManuallyCollapsed);

  const handleToggle = () => {
    setIsManuallyCollapsed(!isManuallyCollapsed);
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: shouldExpand ? 280 : 80 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full flex-shrink-0 bg-japura-black text-white flex flex-col shadow-xl transition-all duration-300 relative z-50"
    >
      {/* Logo */}
      <div className="h-28 flex flex-col justify-center px-6 border-b border-gray-800 relative">
        <AnimatePresence>
          {shouldExpand && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-baseline gap-2"
            >
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">JAPURÁ</h1>
              <span className="text-xs font-bold text-gray-400 tracking-wider">PNEUS</span>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {shouldExpand && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[9px] font-medium text-gray-500 tracking-[0.2em] uppercase mt-2"
            >
              Desde 1973
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={handleToggle}
          className="absolute top-4 right-4 p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors z-10"
          title={isExpanded ? 'Colapsar' : 'Expandir'}
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                w-full flex items-center ${shouldExpand ? 'px-4' : 'px-3 justify-center'} py-3 rounded-lg transition-all duration-200 mb-1 group
                ${isActive 
                  ? 'bg-japura-dark text-white font-bold shadow-sm' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
              `}
              title={!shouldExpand ? item.label : ''}
            >
              <Icon size={20} className={shouldExpand ? 'mr-3' : ''} />
              <AnimatePresence>
                {shouldExpand && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>
      
      {/* Footer Sidebar */}
      <div className={`p-6 border-t border-gray-900 ${shouldExpand ? '' : 'flex justify-center'}`}>
        <AnimatePresence>
          {shouldExpand ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-gray-600 text-center"
            >
              v2.0 System
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-gray-600"
            >
              v2.0
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
