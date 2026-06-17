import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Regions } from './pages/Regions';
import { Assets } from './pages/Assets';
import { Simulation } from './pages/Simulation';
import { Analytics } from './pages/Analytics';
import { Admin } from './pages/Admin';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Render the selected view
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'regions':
        return <Regions />;
      case 'assets':
        return <Assets />;
      case 'simulation':
        return <Simulation />;
      case 'analytics':
        return <Analytics />;
      case 'admin':
        return <Admin />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg relative flex overflow-hidden">
      {/* Background Matrix-grid Scan overlay */}
      <div className="absolute inset-0 pointer-events-none cyber-grid-overlay opacity-30 z-0" />
      
      {/* Glowing background circles for modern dark visual aesthetics */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Cyber Grid Scanner laser bar */}
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan/15 to-transparent pointer-events-none animate-cyber-scan z-10" />

      {/* Sidebar Navigation */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Main Container */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 z-10
        ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}
      `}>
        {/* Header Navigation */}
        <Navbar 
          currentPage={currentPage} 
          setSidebarOpen={setSidebarOpen} 
          sidebarOpen={sidebarOpen} 
          theme={theme}
          setTheme={setTheme}
        />

        {/* Viewport Content */}
        <main className="flex-grow p-4 lg:p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {renderPage()}
        </main>

        {/* Global Footer */}
        <footer className="py-4 px-6 border-t border-cyber-border/40 bg-[#0a0f1c]/20 text-center font-digital text-[10px] text-slate-600 tracking-widest flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>OMNICIVILIZATION ANALYTICS SUB-NETWORK [SECURE TERMINAL]</span>
          <span>SYSTEM RUNTIME STATUS: 100% RELIABILITY RATING</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
