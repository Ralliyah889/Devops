import React, { useState, useEffect } from 'react';
import { Menu, Bell, ShieldAlert, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setSidebarOpen: (isOpen: boolean) => void;
  sidebarOpen: boolean;
  theme: string;
  setTheme: (theme: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  setSidebarOpen,
  sidebarOpen,
  theme,
  setTheme
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatEpoch = () => {
    // Futuristic epoch time based on current time + 120 years
    const year = time.getFullYear() + 120;
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const date = String(time.getDate()).padStart(2, '0');
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    return `EPOCH [${year}.${month}.${date} - ${hours}:${minutes}:${seconds}]`;
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Core Command Center';
      case 'regions': return 'Planetary Regions Monitoring';
      case 'assets': return 'Infrastructure Assets Registry';
      case 'simulation': return 'Quantum Simulation Center';
      case 'analytics': return 'Unified Analytics Engine';
      case 'admin': return 'System Security & Override';
      default: return 'OmniCivilization Analytics';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 bg-cyber-bg-card backdrop-blur-md border-b border-cyber-border">
      {/* Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded text-slate-400 hover:text-white hover:bg-slate-900 border border-cyber-border/40"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold font-digital uppercase tracking-wider text-glow-cyan text-white">
            {getPageTitle()}
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest hidden sm:block">
            Secure Terminal Sync Status Active
          </p>
        </div>
      </div>

      {/* Telemetry Stats / Clock */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Epoch Clock (monospaced) */}
        <div className="hidden md:block px-3 py-1 bg-slate-900 border border-cyber-border/60 rounded font-digital text-xs text-cyber-cyan shadow-inner">
          {formatEpoch()}
        </div>

        {/* Global Threat Level Gauge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 border border-cyber-border/60 rounded">
          <ShieldAlert className="w-4 h-4 text-cyber-yellow animate-pulse" />
          <span className="text-[10px] text-slate-400 font-digital uppercase">Threat:</span>
          <span className="text-xs text-cyber-yellow font-digital font-bold tracking-wider">MODERATE</span>
        </div>

        {/* Sync Rate */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-2 w-2 rounded-full bg-cyber-green opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green"></span>
          </div>
          <span className="hidden md:inline text-[10px] text-slate-400 font-digital">COMMS LINK:</span>
          <span className="text-xs font-digital text-cyber-green font-bold">100% SECURE</span>
        </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-2 border-l border-cyber-border pl-4">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Theme"
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyber-cyan border border-cyber-border/40 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button className="relative p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyber-cyan border border-cyber-border/40 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyber-red rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full border border-cyber-purple/40 bg-cyber-purple/10 flex items-center justify-center text-xs text-cyber-purple font-digital font-bold shadow-neon-purple">
              ADM
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
