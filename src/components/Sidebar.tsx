import React from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Shield, 
  Cpu, 
  LineChart, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Terminal,
  Activity
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  isOpen, 
  setIsOpen 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-cyber-cyan' },
    { id: 'regions', label: 'Regions', icon: Globe, color: 'text-cyber-blue' },
    { id: 'assets', label: 'Infrastructure Assets', icon: Shield, color: 'text-cyber-green' },
    { id: 'simulation', label: 'Simulation Center', icon: Cpu, color: 'text-cyber-purple' },
    { id: 'analytics', label: 'Analytics', icon: LineChart, color: 'text-cyber-pink' },
    { id: 'admin', label: 'Admin', icon: Settings, color: 'text-cyber-red' },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-cyber-bg-card border-r border-cyber-border transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-20'} 
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-cyber-border bg-[#0a0f1c]/90">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded bg-cyber-cyan/10 border border-cyber-cyan/35 flex items-center justify-center animate-pulse-fast">
              <Activity className="w-5 h-5 text-cyber-cyan" />
            </div>
            {isOpen && (
              <span className="font-bold text-sm tracking-widest text-glow-cyan text-cyber-cyan uppercase font-digital">
                OMNICIVILIZATION
              </span>
            )}
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex p-1.5 rounded bg-slate-900 border border-cyber-border hover:border-cyber-cyan text-slate-400 hover:text-cyber-cyan transition-colors"
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  // Close on mobile
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 relative group
                  ${isActive 
                    ? 'bg-slate-900 border border-slate-800 text-white font-semibold' 
                    : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200 border border-transparent'
                  }
                `}
              >
                {/* Active neon highlight bar */}
                {isActive && (
                  <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-gradient-to-b ${item.color.replace('text-', 'from-').replace('text-', 'to-')} bg-current`} style={{ backgroundColor: 'currentColor' }} />
                )}

                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? item.color : 'text-slate-400 group-hover:text-slate-200'}`} />
                
                {isOpen ? (
                  <span className="truncate">{item.label}</span>
                ) : (
                  <div className="absolute left-16 px-2 py-1 bg-cyber-bg-card border border-cyber-border text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Diagnostics footer in Sidebar */}
        <div className="p-4 border-t border-cyber-border bg-[#0a0f1c]/40 font-digital text-[11px] text-slate-500 space-y-1">
          {isOpen ? (
            <>
              <div className="flex justify-between items-center">
                <span>SYSTEM STATUS:</span>
                <span className="text-cyber-green font-semibold animate-pulse-fast">NOMINAL</span>
              </div>
              <div className="flex justify-between items-center">
                <span>AI SYNC RATE:</span>
                <span className="text-cyber-cyan">99.84%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>DB CONNECTIONS:</span>
                <span className="text-cyber-pink">12,042/s</span>
              </div>
            </>
          ) : (
            <div className="flex justify-center text-cyber-green font-bold animate-pulse-fast">
              <Terminal className="w-4 h-4" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
