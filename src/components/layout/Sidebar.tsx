'use client';

import { motion } from 'framer-motion';
import { Home, LayoutDashboard, ShoppingCart, Package } from 'lucide-react';

type ViewType = 'home' | 'dashboard' | 'import' | 'pricing';

interface MenuItem {
  label: string;
  view: ViewType;
  icon: React.ReactNode;
}

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const menuItems: MenuItem[] = [
  { label: 'Home', view: 'home', icon: <Home size={18} strokeWidth={1.5} /> },
  { label: 'Dashboard', view: 'dashboard', icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
  { label: 'Cockpit Compras', view: 'pricing', icon: <ShoppingCart size={18} strokeWidth={1.5} /> },
  { label: 'Importação', view: 'import', icon: <Package size={18} strokeWidth={1.5} /> },
];

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen w-64 text-white flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-[#827f7f]/30">
        <h1 className="text-2xl font-black text-white tracking-tight">
          JAPURÁ PNEUS
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <li key={item.view}>
                <motion.button
                  onClick={() => setCurrentView(item.view)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all relative flex items-center gap-3 ${
                    isActive
                      ? 'bg-[#3E3F40] text-white shadow-lg'
                      : 'text-white/70 hover:bg-[#3E3F40]/50 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#827f7f] rounded-r"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-[#827f7f]/30">
        <p className="text-xs text-[#827f7f] font-medium">Maira - Inovação</p>
      </div>
    </motion.aside>
  );
}
