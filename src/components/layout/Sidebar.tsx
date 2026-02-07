'use client';

import { 
  LayoutDashboard, 
  FileCheck, 
  Anchor, 
  BarChart3, 
  BookOpen, 
  ArrowLeftRight,
  Target,
  DollarSign,
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
  { id: 'pricing', label: 'JapPricing', icon: DollarSign },
  { id: 'distribution', label: 'JapDistribution', icon: ArrowLeftRight },
  { id: 'sales', label: 'JapSales', icon: Target },
];

export default function Sidebar({ currentView, setCurrentView, isExpanded, setIsExpanded }: SidebarProps) {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 220 : 56 }}
      className="h-full flex-shrink-0 bg-japura-black text-white flex flex-col border-r border-japura-dark transition-all duration-200 relative z-50"
    >
      {/* Logo + Toggle - flexível */}
      <div className={`h-16 flex items-center border-b border-japura-dark relative shrink-0 ${isExpanded ? 'justify-between px-3' : 'justify-center px-0'}`}>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-baseline gap-1"
            >
              <h1 className="text-lg font-semibold text-white tracking-tight leading-none">JAPURÁ</h1>
              <span className="text-[10px] font-medium text-japura-grey tracking-wider">PNEUS</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={handleToggle}
          className={`flex items-center justify-center w-8 h-8 shrink-0 bg-japura-dark hover:bg-white/20 rounded transition-colors z-10 ${isExpanded ? '' : 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}`}
          title={isExpanded ? 'Colapsar barra lateral' : 'Expandir barra lateral'}
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                w-full flex items-center ${isExpanded ? 'px-2' : 'px-2 justify-center'} py-2 rounded transition-colors
                ${isActive 
                  ? 'bg-japura-dark text-white font-medium' 
                  : 'text-japura-grey hover:bg-japura-dark/50 hover:text-white'}
              `}
              title={!isExpanded ? item.label : ''}
            >
              <Icon size={16} className={isExpanded ? 'mr-2 shrink-0' : 'shrink-0'} />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-xs whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className={`p-2 border-t border-japura-dark ${isExpanded ? '' : 'flex justify-center'}`}>
        <span className="text-[10px] text-japura-grey">v2.0</span>
      </div>
    </motion.aside>
  );
}
