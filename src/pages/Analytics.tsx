import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download, RefreshCw, BarChart2, Eye, Database } from 'lucide-react';
import { CustomTooltip, ChartGradients } from '../components/CyberChart';

// Historical datasets
const generateData = (hoursCount: number) => {
  return Array.from({ length: hoursCount }, (_, i) => {
    const timeLabel = hoursCount === 24 
      ? `${String(i).padStart(2, '0')}:00` 
      : `Epoch Day ${i + 1}`;
    
    return {
      time: timeLabel,
      biosphere: 92 + Math.sin(i * 0.5) * 3 + Math.random(),
      cyberAlerts: Math.max(0, 15 + Math.cos(i * 0.8) * 10 + Math.random() * 8),
      solarEM: Math.max(0, 50 + Math.sin(i * 0.3) * 25 + Math.random() * 10),
      energyStorage: 80 + Math.cos(i * 0.4) * 15 + Math.random() * 2
    };
  });
};

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [activeMetrics, setActiveMetrics] = useState({
    biosphere: true,
    cyberAlerts: false,
    solarEM: true,
    energyStorage: false
  });
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setDiagnosticLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 4)]);
  };

  const chartData = generateData(
    timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30
  );

  const toggleMetric = (key: keyof typeof activeMetrics) => {
    setActiveMetrics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    addLog(`TOGGLED ANALYTICS PLOT VARIABLE: [${key.toUpperCase()}]`);
  };

  const triggerExport = () => {
    if (exporting) return;
    setExporting(true);
    setExportProgress(0);
    addLog(`INITIATED TELEMETRY EXPORT IN CSV FORMAT FOR RANGE: [${timeRange.toUpperCase()}]`);
    
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          addLog('EXPORT COMPLETED: Saved omnicivilization_telemetry_manifest.csv (3.4 MB)');
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Date Filters and Variables selection */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Metric Config panel */}
        <div className="cyber-panel p-5 space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2 border-b border-cyber-border pb-3">
            <BarChart2 className="w-4 h-4 text-cyber-cyan" />
            Query Variables
          </h2>

          <div className="space-y-3 font-digital text-xs">
            {/* Biosphere */}
            <label className="flex items-center gap-3 p-2.5 rounded bg-slate-950/60 border border-cyber-border/40 hover:border-cyber-green/40 cursor-pointer select-none transition-all">
              <input
                type="checkbox"
                checked={activeMetrics.biosphere}
                onChange={() => toggleMetric('biosphere')}
                className="w-4 h-4 rounded text-cyber-green bg-[#05070d] border-cyber-border focus:ring-cyber-green accent-cyber-green"
              />
              <div className="flex-1">
                <span className="text-slate-200 block font-semibold">Biosphere Stability</span>
                <span className="text-[10px] text-slate-500">Environmental health indexes</span>
              </div>
            </label>

            {/* Cyber Alerts */}
            <label className="flex items-center gap-3 p-2.5 rounded bg-slate-950/60 border border-cyber-border/40 hover:border-cyber-red/40 cursor-pointer select-none transition-all">
              <input
                type="checkbox"
                checked={activeMetrics.cyberAlerts}
                onChange={() => toggleMetric('cyberAlerts')}
                className="w-4 h-4 rounded text-cyber-red bg-[#05070d] border-cyber-border focus:ring-cyber-red accent-cyber-red"
              />
              <div className="flex-1">
                <span className="text-slate-200 block font-semibold">Cyber Threat Warnings</span>
                <span className="text-[10px] text-slate-500">Intrusion defense triggers</span>
              </div>
            </label>

            {/* Solar EM */}
            <label className="flex items-center gap-3 p-2.5 rounded bg-slate-950/60 border border-cyber-border/40 hover:border-cyber-cyan/40 cursor-pointer select-none transition-all">
              <input
                type="checkbox"
                checked={activeMetrics.solarEM}
                onChange={() => toggleMetric('solarEM')}
                className="w-4 h-4 rounded text-cyber-cyan bg-[#05070d] border-cyber-border focus:ring-cyber-cyan accent-cyber-cyan"
              />
              <div className="flex-1">
                <span className="text-slate-200 block font-semibold">Solar EM Radiation</span>
                <span className="text-[10px] text-slate-500">Star storm intensity sensor</span>
              </div>
            </label>

            {/* Energy Storage */}
            <label className="flex items-center gap-3 p-2.5 rounded bg-slate-950/60 border border-cyber-border/40 hover:border-cyber-purple/40 cursor-pointer select-none transition-all">
              <input
                type="checkbox"
                checked={activeMetrics.energyStorage}
                onChange={() => toggleMetric('energyStorage')}
                className="w-4 h-4 rounded text-cyber-purple bg-[#05070d] border-cyber-border focus:ring-cyber-purple accent-cyber-purple"
              />
              <div className="flex-1">
                <span className="text-slate-200 block font-semibold">Battery Reserve Grid</span>
                <span className="text-[10px] text-slate-500">Capacitance grid reserves</span>
              </div>
            </label>
          </div>
        </div>

        {/* Chart View Panel */}
        <div className="cyber-panel p-5 xl:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyber-border pb-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyber-cyan animate-pulse" />
                Variable Analysis Engine
              </h2>
              <p className="text-[10px] text-slate-500 font-digital mt-0.5">COMPARE AND TREND CRITICAL PARAMETERS</p>
            </div>
            
            {/* Timeframe tab bar */}
            <div className="flex gap-2 font-digital text-xs">
              {(['24h', '7d', '30d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setTimeRange(r);
                    addLog(`UPDATED RANGE RESOLUTION GRID: [${r.toUpperCase()}]`);
                  }}
                  className={`px-3 py-1.5 rounded border transition-all
                    ${timeRange === r 
                      ? 'bg-slate-900 border-cyber-cyan text-cyber-cyan font-bold text-glow-cyan' 
                      : 'bg-transparent border-cyber-border text-slate-400 hover:text-slate-200'
                    }
                  `}
                >
                  {r === '24h' ? '24 Hours' : r === '7d' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <ChartGradients />
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" tickLine={false} style={{ fontSize: '9px', fontFamily: 'Share Tech Mono' }} />
                <YAxis stroke="#64748b" tickLine={false} style={{ fontSize: '9px', fontFamily: 'Share Tech Mono' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontFamily: 'Share Tech Mono', marginTop: '10px' }} />
                
                {activeMetrics.biosphere && (
                  <Area 
                    name="Biosphere Stability" 
                    type="monotone" 
                    dataKey="biosphere" 
                    stroke="#00f5d4" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#gradientGreen)" 
                  />
                )}

                {activeMetrics.cyberAlerts && (
                  <Area 
                    name="Cyber Alerts" 
                    type="monotone" 
                    dataKey="cyberAlerts" 
                    stroke="#ff007f" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#gradientRed)" 
                  />
                )}

                {activeMetrics.solarEM && (
                  <Area 
                    name="Solar EM Radiation" 
                    type="monotone" 
                    dataKey="solarEM" 
                    stroke="#00f2fe" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#gradientCyan)" 
                  />
                )}

                {activeMetrics.energyStorage && (
                  <Area 
                    name="Battery Reserve Capacity" 
                    type="monotone" 
                    dataKey="energyStorage" 
                    stroke="#9b5de5" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#gradientPurple)" 
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Export Panel & Analytics logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CSV Exporter */}
        <div className="cyber-panel p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-cyber-green" />
              Telemetry Data Export
            </h2>
            <p className="text-[10px] text-slate-500 font-digital mt-0.5">SECURE ARCHIVAL PROTOCOLS</p>
          </div>
          
          <div className="space-y-4 font-digital text-xs">
            <p className="text-slate-400">
              Trigger a secure decryption of historical database logs. Compiles civilization stability scores, thermal dynamics, and shield grid status arrays into standard format.
            </p>
            
            {exporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-cyber-cyan animate-pulse">
                  <span>PACKING TELEMETRY DATA FRAMES...</span>
                  <span>{exportProgress}%</span>
                </div>
                <div className="w-full bg-[#05070d] h-2 rounded border border-cyber-border/40 overflow-hidden">
                  <div 
                    className="h-full bg-cyber-cyan transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={triggerExport}
              disabled={exporting}
              className="px-4 py-2 bg-slate-900 border border-cyber-border hover:border-cyber-green text-slate-300 hover:text-cyber-green rounded font-bold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'EXPORTING...' : 'INITIATE CSV DOWNLOAD'}
            </button>
          </div>
        </div>

        {/* Analytics Logs console */}
        <div className="cyber-panel p-5 space-y-3 border-cyber-cyan/15">
          <div className="flex items-center gap-2 border-b border-cyber-border pb-2 text-xs font-semibold text-slate-400 uppercase tracking-widest font-digital">
            <RefreshCw className="w-4 h-4 text-cyber-cyan animate-spin" style={{ animationDuration: '6s' }} />
            Query Engine Status Logs
          </div>
          <div className="bg-[#05070d]/80 rounded p-4 font-digital text-xs text-cyber-cyan/90 h-32 overflow-y-auto space-y-1.5 border border-cyber-border/40 select-none">
            {diagnosticLogs.length > 0 ? (
              diagnosticLogs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-slate-600 shrink-0">QL&gt;</span>
                  <span className={index === 0 ? 'text-white' : 'opacity-85'}>{log}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-600 italic">No queries executed in this session. Ready for telemetry filters.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
