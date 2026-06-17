import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Play, Pause, Square, AlertOctagon, Cpu, Zap, Activity } from 'lucide-react';
import { CustomTooltip, ChartGradients } from '../components/CyberChart';

interface SimData {
  tick: number;
  stability: number;
  entropy: number;
  nodes: number;
}

export const Simulation: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 5x
  const [gravity, setGravity] = useState(1.00); // Gs
  const [population, setPopulation] = useState(50); // million
  const [entropyRate, setEntropyRate] = useState(0.15); 
  const [scenario, setScenario] = useState('STANDARD_TELEMETRY');
  const [currentProgress, setCurrentProgress] = useState(45);
  
  const [simHistory, setSimHistory] = useState<SimData[]>(
    Array.from({ length: 15 }, (_, i) => ({
      tick: i,
      stability: 95 - (i * 0.4) + Math.random() * 2,
      entropy: 10 + (i * 0.8) + Math.random() * 1.5,
      nodes: 24 + Math.floor(Math.random() * 3)
    }))
  );

  const [logs, setLogs] = useState<string[]>([
    'SIMULATION STATE: Initialized quantum engine clusters.',
    'ENGINE: Set gravity coefficient constant to 1.00G.'
  ]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 5)]);
  };

  // Sim loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Increment progress bar
      setCurrentProgress(prev => {
        if (prev >= 100) {
          addLog(`SIMULATION EPOCH COMPLETED: Compiling datasets for scenario [${scenario}]`);
          return 0;
        }
        return prev + (speed * 1.5);
      });

      // Append data point
      setSimHistory(prev => {
        const last = prev[prev.length - 1];
        const nextTick = last.tick + 1;
        
        // Modulate metrics based on parameters
        let baseStability = last.stability;
        let baseEntropy = last.entropy;
        
        // Scenario modulations
        if (scenario === 'SOLAR_FLARE') {
          baseStability = Math.max(20, baseStability - 1.5 + (Math.random() * 0.6));
          baseEntropy = Math.min(100, baseEntropy + 2.1);
        } else if (scenario === 'CYBER_ATTACK') {
          baseStability = Math.max(30, baseStability - 2.0);
          baseEntropy = Math.min(100, baseEntropy + 1.2);
        } else if (scenario === 'GEOTHERMAL') {
          baseStability = Math.max(45, baseStability - 0.8);
          baseEntropy = Math.min(100, baseEntropy + 1.8);
        } else {
          // Standard telemetry
          baseStability = Math.min(100, Math.max(60, baseStability + (Math.random() * 0.6 - 0.3) - (entropyRate * 0.2)));
          baseEntropy = Math.min(100, Math.max(0, baseEntropy + (entropyRate * 0.8) + (Math.random() * 0.4 - 0.2)));
        }

        // Adjust for Gravity/Population
        const gravityImpact = Math.abs(1.00 - gravity) * 2;
        baseStability = Math.max(10, baseStability - gravityImpact);
        baseEntropy = Math.min(100, baseEntropy + (population * 0.01));

        return [
          ...prev.slice(1),
          {
            tick: nextTick,
            stability: parseFloat(baseStability.toFixed(1)),
            entropy: parseFloat(baseEntropy.toFixed(1)),
            nodes: 20 + Math.floor(population * 0.3) + (isRunning ? Math.floor(Math.random() * 4) : 0)
          }
        ];
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed, gravity, population, entropyRate, scenario]);

  const handleScenarioChange = (e: string) => {
    setScenario(e);
    addLog(`LOADED SIMULATION SCENARIO CONFIGURATION: [${e}]`);
    if (e === 'SOLAR_FLARE') {
      addLog('WARNING: High Solar EM flux radiation injected into biosphere shields.');
    } else if (e === 'CYBER_ATTACK') {
      addLog('CRITICAL: Malicious rogue program overrides core node permissions.');
    } else if (e === 'GEOTHERMAL') {
      addLog('ALERT: Tectonic temperature valves operating at 180% load.');
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    addLog('QUANTUM SIMULATOR STARTED: Computing generational paths.');
  };

  const handlePause = () => {
    setIsRunning(false);
    addLog('QUANTUM SIMULATOR PAUSED.');
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentProgress(0);
    setScenario('STANDARD_TELEMETRY');
    setSimHistory(
      Array.from({ length: 15 }, (_, i) => ({
        tick: i,
        stability: 94 + Math.random() * 4,
        entropy: 12 + Math.random() * 3,
        nodes: 24
      }))
    );
    addLog('SYSTEMRESET: Cleared all active neural simulation logs.');
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Scenario and Run Panel */}
        <div className="cyber-panel p-5 space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2 border-b border-cyber-border pb-3">
            <Cpu className="w-4 h-4 text-cyber-purple" />
            Simulation Control Desk
          </h2>

          {/* Start/Pause buttons */}
          <div className="flex gap-2">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex-1 py-2 px-3 bg-cyber-purple/20 hover:bg-cyber-purple/30 border border-cyber-purple/50 text-cyber-purple hover:text-white rounded font-digital text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-neon-purple"
              >
                <Play className="w-4 h-4 fill-current" />
                START ENGINE
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex-1 py-2 px-3 bg-cyber-yellow/20 hover:bg-cyber-yellow/30 border border-cyber-yellow/50 text-cyber-yellow hover:text-white rounded font-digital text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4 fill-current" />
                PAUSE SYSTEM
              </button>
            )}

            <button
              onClick={handleReset}
              className="py-2 px-3 bg-slate-900 border border-cyber-border hover:border-cyber-red text-slate-400 hover:text-cyber-red rounded font-digital text-xs font-bold transition-colors"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>

          {/* Engine Speed toggles */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 font-digital uppercase block">Quantum Clock Speed</span>
            <div className="flex gap-2 font-digital text-xs">
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSpeed(s);
                    addLog(`MODULATED SIMULATION CLOCK TIME RATIO TO ${s}X`);
                  }}
                  className={`flex-1 py-1 px-2.5 rounded border transition-all
                    ${speed === s 
                      ? 'bg-slate-900 border-cyber-purple text-cyber-purple font-bold text-glow-purple' 
                      : 'bg-transparent border-cyber-border text-slate-400 hover:text-slate-200'
                    }
                  `}
                >
                  {s}x Speed
                </button>
              ))}
            </div>
          </div>

          {/* Scenario selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 font-digital uppercase block">Active Environment Scenario</span>
            <select
              value={scenario}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className="w-full bg-[#05070d] border border-cyber-border rounded px-3 py-2 text-xs font-digital text-white focus:outline-none focus:border-cyber-purple"
            >
              <option value="STANDARD_TELEMETRY">STANDARD OPERATION PROTCOLS</option>
              <option value="SOLAR_FLARE">SOLAR FLARE EM RADIATION</option>
              <option value="CYBER_ATTACK">ROGUE AI CYBER INTRUSION</option>
              <option value="GEOTHERMAL">CORE PLATES TECTONIC OVERLOAD</option>
            </select>
          </div>
        </div>

        {/* Dynamic Parameter Tuning Sliders */}
        <div className="cyber-panel p-5 space-y-4 xl:col-span-2">
          <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2 border-b border-cyber-border pb-3">
            <Zap className="w-4 h-4 text-cyber-cyan" />
            Civilization Parameter Tuning
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-digital text-xs">
            {/* Gravity */}
            <div className="space-y-2 bg-[#05070d]/60 p-4 rounded border border-cyber-border/40">
              <div className="flex justify-between items-center text-slate-400">
                <span>GRAVITY DYNAMICS:</span>
                <span className="text-cyber-cyan font-bold">{gravity.toFixed(2)} Gs</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={gravity}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setGravity(val);
                  addLog(`UPDATED GRAVITY Telemetry coefficient target to ${val}G`);
                }}
                className="w-full accent-cyber-cyan cursor-pointer bg-slate-900 border-none rounded-lg appearance-none h-1"
              />
              <span className="text-[9px] text-slate-500 block">Alters structural load factor calculation.</span>
            </div>

            {/* Population */}
            <div className="space-y-2 bg-[#05070d]/60 p-4 rounded border border-cyber-border/40">
              <div className="flex justify-between items-center text-slate-400">
                <span>POPULATION MATRIX:</span>
                <span className="text-cyber-purple font-bold">{population}M Core</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={population}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setPopulation(val);
                  addLog(`DILATED POPULATION MATRIX MODEL VALUE: ${val} MILLION`);
                }}
                className="w-full accent-cyber-purple cursor-pointer bg-slate-900 border-none rounded-lg appearance-none h-1"
              />
              <span className="text-[9px] text-slate-500 block">Determines resource node demand bounds.</span>
            </div>

            {/* Entropy Coeff */}
            <div className="space-y-2 bg-[#05070d]/60 p-4 rounded border border-cyber-border/40">
              <div className="flex justify-between items-center text-slate-400">
                <span>ENTROPY COEFFICIENT:</span>
                <span className="text-cyber-pink font-bold">{entropyRate.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.00"
                step="0.05"
                value={entropyRate}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setEntropyRate(val);
                  addLog(`DIALED ENTROPY DECAY RATE MULTIPLIER: ${val}`);
                }}
                className="w-full accent-cyber-pink cursor-pointer bg-slate-900 border-none rounded-lg appearance-none h-1"
              />
              <span className="text-[9px] text-slate-500 block">Influences rate of structural breakdown.</span>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-digital text-slate-400">
              <span>ACTIVE MODEL ITERATION PATH:</span>
              <span className="text-cyber-cyan">{currentProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-[#05070d] h-2.5 rounded-full border border-cyber-border/40 overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-cyber-purple via-cyber-cyan to-cyber-green rounded-full transition-all duration-300 shadow-neon-cyan"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Graphs panel and Telemetry ticker */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Graphs panel */}
        <div className="cyber-panel p-5 xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-cyber-border pb-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyber-green" />
                Live Model Stability vs Entropy
              </h2>
              <p className="text-[10px] text-slate-500 font-digital mt-0.5">GENERATIONAL SIMULATION TELEMETRY PLOTS</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <ChartGradients />
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis dataKey="tick" stroke="#64748b" tickLine={false} style={{ fontSize: '10px', fontFamily: 'Share Tech Mono' }} />
                <YAxis stroke="#64748b" tickLine={false} style={{ fontSize: '10px', fontFamily: 'Share Tech Mono' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  name="Model Stability" 
                  type="monotone" 
                  dataKey="stability" 
                  stroke="#00f5d4" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#gradientGreen)" 
                />
                <Area 
                  name="Entropy Factor" 
                  type="monotone" 
                  dataKey="entropy" 
                  stroke="#ff007f" 
                  strokeWidth={1.5}
                  fillOpacity={1} 
                  fill="url(#gradientRed)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live logs console */}
        <div className="cyber-panel p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-cyber-border pb-2 text-xs font-semibold text-slate-400 uppercase tracking-widest font-digital">
            <AlertOctagon className="w-4 h-4 text-cyber-cyan animate-pulse" />
            Sim Engine Terminal Logs
          </div>
          <div className="bg-[#05070d]/80 rounded p-4 font-digital text-xs text-cyber-purple/90 h-64 overflow-y-auto space-y-1.5 border border-cyber-border/40 select-none">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-slate-600 shrink-0">SIM&gt;</span>
                <span className={index === 0 ? 'text-white' : 'opacity-80'}>{log}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
