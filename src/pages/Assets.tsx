import React, { useState } from 'react';
import { Cpu, Power, Search, Filter, Terminal, AlertCircle } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'Energy' | 'Defense' | 'Climate' | 'Compute';
  region: string;
  health: number;
  status: 'ONLINE' | 'DEGRADING' | 'CRITICAL' | 'OFFLINE' | 'REBOOTING';
  uptime: string;
}

const initialAssets: Asset[] = [
  { id: 'qfr-01', name: 'Quantum Fusion Reactor QF-1', type: 'Energy', region: 'Neo-Tokyo Sector 4', health: 98, status: 'ONLINE', uptime: '99.99%' },
  { id: 'odp-08', name: 'Orbital Defense Platform ODP-8', type: 'Defense', region: 'Orbital Ring Station 7', health: 91, status: 'ONLINE', uptime: '99.85%' },
  { id: 'tcr-04', name: 'Tachyon Climate Regulator TCR-4', type: 'Climate', region: 'Olympus Mons Dome B', health: 76, status: 'DEGRADING', uptime: '98.24%' },
  { id: 'hcc-12', name: 'Hyperloop Transit Controller HCC-12', type: 'Compute', region: 'New Berlin Hub-1', health: 42, status: 'CRITICAL', uptime: '95.12%' },
  { id: 'qcc-09', name: 'Quantum Compute Cluster QCC-9', type: 'Compute', region: 'Neo-Tokyo Sector 4', health: 100, status: 'ONLINE', uptime: '100.00%' },
  { id: 'dsw-03', name: 'Deep Sea Water Purifier DSW-3', type: 'Climate', region: 'Atlantis Ocean Trench', health: 85, status: 'ONLINE', uptime: '99.40%' },
  { id: 'sgp-15', name: 'Shield Grid Projector SGP-15', type: 'Defense', region: 'New Berlin Hub-1', health: 0, status: 'OFFLINE', uptime: '89.50%' },
];

export const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([
    'SYSTEM: Asset manager ready.',
    'DIAGNOSTIC: Connected to orbital sensors.'
  ]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setDiagnosticLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 5)]);
  };

  const handleReboot = (id: string, name: string) => {
    // Set status to rebooting
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status: 'REBOOTING', health: 50 } : a));
    addLog(`INITIATED SYSTEM REBOOT: ${name}`);

    // Wait 3 seconds to complete reboot
    setTimeout(() => {
      setAssets(prev => prev.map(a => {
        if (a.id === id) {
          addLog(`REBOOT COMPLETE: ${name} is back online.`);
          return { ...a, status: 'ONLINE', health: 100 };
        }
        return a;
      }));
    }, 2500);
  };

  const handleMaintenance = (id: string, name: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        addLog(`MAINTENANCE TRIGGERED: Stabilized systems for ${name}.`);
        return { ...a, health: 95, status: 'ONLINE' };
      }
      return a;
    }));
  };

  // Filter Assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || asset.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="cyber-panel p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search assets by ID, name, or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#05070d] border border-cyber-border rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan transition-colors font-digital"
          />
        </div>

        {/* Filters dropdowns */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto font-digital text-xs">
          {/* Type Filter */}
          <div className="flex items-center gap-2 bg-[#05070d] border border-cyber-border px-3 py-1.5 rounded text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>TYPE:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border-none text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">ALL</option>
              <option value="Energy">ENERGY</option>
              <option value="Defense">DEFENSE</option>
              <option value="Climate">CLIMATE</option>
              <option value="Compute">COMPUTE</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-[#05070d] border border-cyber-border px-3 py-1.5 rounded text-slate-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">ALL</option>
              <option value="ONLINE">ONLINE</option>
              <option value="DEGRADING">DEGRADING</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="OFFLINE">OFFLINE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table view */}
      <div className="cyber-panel overflow-x-auto border-cyber-border/80">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-cyber-border bg-slate-950/80 font-digital text-xs text-slate-400 uppercase">
              <th className="px-6 py-4">Asset Code / Name</th>
              <th className="px-6 py-4">Region Location</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-center">Health</th>
              <th className="px-6 py-4">Diagnostic Status</th>
              <th className="px-6 py-4">Uptime</th>
              <th className="px-6 py-4 text-right">Overrides</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/40 text-xs">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-900/30 transition-colors">
                  {/* Name and ID */}
                  <td className="px-6 py-4 font-digital">
                    <div className="text-white font-semibold">{asset.name}</div>
                    <div className="text-slate-500 text-[10px] uppercase font-mono">{asset.id}</div>
                  </td>
                  {/* Region */}
                  <td className="px-6 py-4 text-slate-300 font-digital">
                    {asset.region}
                  </td>
                  {/* Type badge */}
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-digital uppercase border
                      ${asset.type === 'Energy' ? 'bg-cyber-cyan/10 border-cyber-cyan/35 text-cyber-cyan' : ''}
                      ${asset.type === 'Defense' ? 'bg-cyber-purple/10 border-cyber-purple/35 text-cyber-purple' : ''}
                      ${asset.type === 'Climate' ? 'bg-cyber-green/10 border-cyber-green/35 text-cyber-green' : ''}
                      ${asset.type === 'Compute' ? 'bg-cyber-pink/10 border-cyber-pink/35 text-cyber-pink' : ''}
                    `}>
                      {asset.type}
                    </span>
                  </td>
                  {/* Health Bar */}
                  <td className="px-6 py-4 text-center font-digital">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-slate-950 rounded-full h-1.5 border border-cyber-border/40 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            asset.health > 80 ? 'bg-cyber-green' : asset.health > 50 ? 'bg-cyber-yellow' : 'bg-cyber-red'
                          }`}
                          style={{ width: `${asset.health}%` }}
                        />
                      </div>
                      <span className={`font-semibold ${
                        asset.health > 80 ? 'text-cyber-green' : asset.health > 50 ? 'text-cyber-yellow' : 'text-cyber-red'
                      }`}>
                        {asset.health}%
                      </span>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4 font-digital font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        asset.status === 'ONLINE' ? 'bg-cyber-green animate-pulse-fast' :
                        asset.status === 'DEGRADING' ? 'bg-cyber-yellow' :
                        asset.status === 'CRITICAL' ? 'bg-cyber-red animate-pulse' :
                        asset.status === 'REBOOTING' ? 'bg-cyber-cyan animate-spin' : 'bg-slate-500'
                      }`} />
                      <span className={`text-[10px] ${
                        asset.status === 'ONLINE' ? 'text-cyber-green' :
                        asset.status === 'DEGRADING' ? 'text-cyber-yellow' :
                        asset.status === 'CRITICAL' ? 'text-cyber-red' :
                        asset.status === 'REBOOTING' ? 'text-cyber-cyan' : 'text-slate-500'
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                  </td>
                  {/* Uptime */}
                  <td className="px-6 py-4 text-slate-400 font-digital font-semibold">
                    {asset.uptime}
                  </td>
                  {/* Override controls */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 font-digital">
                      <button
                        onClick={() => handleReboot(asset.id, asset.name)}
                        disabled={asset.status === 'REBOOTING'}
                        className="px-2 py-1 rounded bg-slate-950 border border-cyber-border hover:border-cyber-cyan text-slate-400 hover:text-cyber-cyan text-[10px] font-semibold transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <Power className="w-3 h-3" />
                        Reboot
                      </button>
                      <button
                        onClick={() => handleMaintenance(asset.id, asset.name)}
                        disabled={asset.status === 'REBOOTING' || asset.health === 100}
                        className="px-2 py-1 rounded bg-slate-950 border border-cyber-border hover:border-cyber-green text-slate-400 hover:text-cyber-green text-[10px] font-semibold transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <Cpu className="w-3 h-3" />
                        Diagnose
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-500 font-digital">
                  NO ASSETS RECORDED UNDER FILTER PROTOCOLS
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Diagnostics Console Logs */}
      <div className="cyber-panel p-5 space-y-3 border-cyber-purple/10">
        <div className="flex items-center gap-2 border-b border-cyber-border pb-2 text-xs font-semibold text-slate-400 uppercase tracking-widest font-digital">
          <Terminal className="w-4 h-4 text-cyber-purple animate-pulse" />
          Diagnostics Console Output
        </div>
        <div className="bg-[#05070d]/80 rounded p-4 font-digital text-xs text-cyber-purple/85 h-32 overflow-y-auto space-y-1.5 border border-cyber-border/40">
          {diagnosticLogs.map((log, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-slate-600 shrink-0">DIAG&gt;</span>
              <span className={index === 0 ? 'text-white' : 'opacity-85'}>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
