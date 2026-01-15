'use client';

type ViewType = 'dashboard' | 'import' | 'pricing';

interface MenuItem {
  label: string;
  view: ViewType;
}

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', view: 'dashboard' },
  { label: 'Cockpit Compras', view: 'pricing' },
  { label: 'Importação', view: 'import' },
];

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-jap-black text-jap-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-jap-silver">
        <h1 className="text-2xl font-bold">JAPURÁ PNEUS</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.view}>
              <button
                onClick={() => setCurrentView(item.view)}
                className={`w-full text-left px-4 py-3 rounded transition-colors ${
                  currentView === item.view
                    ? 'bg-jap-graphite text-jap-white'
                    : 'text-jap-white hover:bg-jap-graphite'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-jap-silver">
        <p className="text-sm text-jap-silver">Maira - Inovação</p>
      </div>
    </aside>
  );
}
