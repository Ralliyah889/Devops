import React, { useState } from 'react';
import { Shield, Thermometer, Zap, Users } from 'lucide-react';

interface Region {
  id: string;
  name: string;
  coords: string;
  shields: number;
  temp: number;
  energy: number;
  population: number;
  threatLevel: 'STABLE' | 'WARNING' | 'CRITICAL';
  type: string;
}

const initialRegions: Region[] = [
  { id: 'tokyo', name: 'Neo-Tokyo Sector 4', coords: '35.6762° N, 139.6503° E', shields: 92, temp: 24, energy: 450, population: 42.5, threatLevel: 'STABLE', type: 'Megacity Core' },
  { id: 'olympus', name: 'Olympus Mons Dome B', coords: '18.6500° N, 226.2000° E', shields: 88, temp: -12, energy: 820, population: 8.2, threatLevel: 'WARNING', type: 'Mars Colony Base' },
  { id: 'atlantis', name: 'Atlantis Ocean Trench', coords: '31.2000° N, 64.3500° W', shields: 95, temp: 4, energy: 310, population: 3.4, threatLevel: 'STABLE', type: 'Sub-aquatic Dome' },
  { id: 'berlin', name: 'New Berlin Hub-1', coords: '52.5200° N, 13.4050° E', shields: 74, temp: 35, energy: 680, population: 18.9, threatLevel: 'CRITICAL', type: 'Industrial Matrix' },
  { id: 'orbit', name: 'Orbital Ring Station 7', coords: 'L4 Lagrange Point', shields: 99, temp: 18, energy: 1200, population: 0.8, threatLevel: 'STABLE', type: 'Space Elevator Ring' },
];

export const Regions: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>(initialRegions);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const adjustShields = (id: string, amt: number) => {
    setRegions(prev => prev.map(r => {
      if (r.id === id) {
        const newVal = Math.min(100, Math.max(0, r.shields + amt));
        let level = r.threatLevel;
        if (newVal > 80 && r.temp < 30) level = 'STABLE';
        return { ...r, shields: newVal, threatLevel: level };
      }
      return r;
    }));
  };

  const ventHeat = (id: string) => {
    setRegions(prev => prev.map(r => {
      if (r.id === id) {
        // Venting heat cools it down by 8 degrees and raises shields by 2%
        const newTemp = r.temp > 0 ? Math.max(0, r.temp - 8) : Math.max(-20, r.temp - 8);
        return { ...r, temp: newTemp, shields: Math.min(100, r.shields + 2) };
      }
      return r;
    }));
  };

  const overrideThreat = (id: string) => {
    setRegions(prev => prev.map(r => {
      if (r.id === id) {
        const nextThreat: Record<'STABLE' | 'WARNING' | 'CRITICAL', 'STABLE' | 'WARNING' | 'CRITICAL'> = {
          'STABLE': 'WARNING',
          'WARNING': 'CRITICAL',
          'CRITICAL': 'STABLE'
        };
        return { ...r, threatLevel: nextThreat[r.threatLevel] };
      }
      return r;
    }));
  };

  const filteredRegions = activeFilter === 'ALL' 
    ? regions 
    : regions.filter(r => r.threatLevel === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header and filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyber-border pb-4">
        <div>
          <p className="text-xs text-slate-500 font-digital uppercase tracking-widest">Planetary Grid Telemetry</p>
          <p className="text-[10px] text-slate-500 font-digital mt-0.5">MANAGE SHIELD FREQUENCIES AND CORE EXHAUST SYSTEM</p>
        </div>
        <div className="flex gap-2 font-digital text-xs">
          {['ALL', 'STABLE', 'WARNING', 'CRITICAL'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded border transition-all duration-150
                ${activeFilter === filter 
                  ? 'bg-slate-900 border-cyber-cyan text-cyber-cyan font-bold text-glow-cyan'
                  : 'bg-transparent border-cyber-border text-slate-400 hover:text-white'
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Regions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRegions.map((region) => (
          <div 
            key={region.id} 
            className={`cyber-panel p-5 space-y-4 border ${
              region.threatLevel === 'CRITICAL' 
                ? 'border-cyber-red/30' 
                : region.threatLevel === 'WARNING' 
                  ? 'border-cyber-yellow/30' 
                  : 'border-cyber-cyan/15'
            }`}
          >
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-cyber-border text-[9px] text-cyber-cyan font-digital uppercase">
                  {region.type}
                </span>
                <h3 className="text-base font-bold font-digital tracking-wide text-white mt-1.5">{region.name}</h3>
                <p className="text-[10px] text-slate-500 font-digital">{region.coords}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  region.threatLevel === 'CRITICAL' 
                    ? 'bg-cyber-red shadow-[0_0_8px_#ff007f] animate-pulse-fast' 
                    : region.threatLevel === 'WARNING' 
                      ? 'bg-cyber-yellow shadow-[0_0_8px_#ffb703]' 
                      : 'bg-cyber-green shadow-[0_0_8px_#00f5d4]'
                }`} />
                <span className={`text-[10px] font-digital font-bold ${
                  region.threatLevel === 'CRITICAL' 
                    ? 'text-cyber-red' 
                    : region.threatLevel === 'WARNING' 
                      ? 'text-cyber-yellow' 
                      : 'text-cyber-green'
                }`}>
                  {region.threatLevel}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded border border-cyber-border/40 font-digital text-xs">
              <div className="space-y-1">
                <div className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
                  <Shield className="w-3 h-3 text-cyber-cyan" />
                  Shield Output
                </div>
                <div className={`text-sm font-bold ${region.shields < 80 ? 'text-cyber-red' : 'text-cyber-cyan'}`}>
                  {region.shields}%
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-cyber-yellow" />
                  Core Temp
                </div>
                <div className={`text-sm font-bold ${region.temp > 30 ? 'text-cyber-red' : 'text-slate-200'}`}>
                  {region.temp}°C
                </div>
              </div>

              <div className="space-y-1 mt-2">
                <div className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyber-green" />
                  Power Output
                </div>
                <div className="text-sm font-bold text-cyber-green">
                  {region.energy} MW
                </div>
              </div>

              <div className="space-y-1 mt-2">
                <div className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
                  <Users className="w-3 h-3 text-cyber-purple" />
                  Population
                </div>
                <div className="text-sm font-bold text-slate-200">
                  {region.population}M
                </div>
              </div>
            </div>

            {/* Operations controls */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-slate-500 font-digital uppercase block">Sector Control Actions</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-digital">
                <button
                  onClick={() => adjustShields(region.id, 5)}
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-cyber-cyan transition-colors"
                >
                  Boost Shields
                </button>
                <button
                  onClick={() => ventHeat(region.id)}
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-cyber-border hover:border-cyber-green text-slate-300 hover:text-cyber-green transition-colors"
                >
                  Vent Heat Core
                </button>
              </div>
              <button
                onClick={() => overrideThreat(region.id)}
                className="w-full mt-1.5 py-1.5 rounded bg-slate-900/40 hover:bg-slate-900 border border-dashed border-cyber-border hover:border-cyber-red/60 text-slate-500 hover:text-cyber-red text-center transition-colors text-[11px] font-digital uppercase"
              >
                Toggle Threat Level Matrix
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
