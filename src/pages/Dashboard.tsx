import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { 
  Activity, 
  Zap, 
  ShieldAlert, 
  Server, 
  Cpu, 
  AlertTriangle,
  RefreshCw,
  Terminal,
  Info,
  X
} from 'lucide-react';
import { CustomTooltip, ChartGradients } from '../components/CyberChart';

// Seed mock data for Charts
const healthData = [
  { time: '00:00', health: 94, latency: 45 },
  { time: '04:00', health: 95, latency: 40 },
  { time: '08:00', health: 91, latency: 62 },
  { time: '12:00', health: 96, latency: 35 },
  { time: '16:00', health: 88, latency: 80 },
  { time: '20:00', health: 97, latency: 30 },
  { time: '24:00', health: 95, latency: 38 },
];

const loadData = [
  { time: '00:00', load: 45, nodes: 12 },
  { time: '04:00', load: 50, nodes: 12 },
  { time: '08:00', load: 78, nodes: 15 },
  { time: '12:00', load: 85, nodes: 18 },
  { time: '16:00', load: 60, nodes: 14 },
  { time: '20:00', load: 92, nodes: 20 },
  { time: '24:00', load: 65, nodes: 14 },
];

const riskData = [
  { name: 'Cyber Warfare', value: 35, color: '#ff007f' },
  { name: 'Seismic Fluctuations', value: 20, color: '#ffb703' },
  { name: 'Orbital Debris', value: 15, color: '#00bbf9' },
  { name: 'Atmospheric Degradation', value: 30, color: '#9b5de5' },
];

const resourceData = [
  { time: 'Q1', cpu: 65, memory: 75, bandwidth: 40 },
  { time: 'Q2', cpu: 70, memory: 80, bandwidth: 50 },
  { time: 'Q3', cpu: 85, memory: 90, bandwidth: 75 },
  { time: 'Q4', cpu: 75, memory: 85, bandwidth: 60 },
];

const kpiStats = [
  { 
    label: 'Biosphere Integrity', 
    value: '94.2%', 
    change: '+0.12%', 
    status: 'nominal', 
    icon: Activity, 
    color: 'text-cyber-green', 
    shadow: 'shadow-neon-green',
    description: 'Percentage of environmental support systems working at optimal levels across populated biodomes.'
  },
  { 
    label: 'Quantum Shield Grid', 
    value: '88.7%', 
    change: '-0.45%', 
    status: 'warning', 
    icon: ShieldAlert, 
    color: 'text-cyber-yellow', 
    shadow: 'shadow-neon-yellow',
    description: 'Electromagnetic deflector integrity guarding against solar radiation and space debris.'
  },
  { 
    label: 'Primary Fusion output', 
    value: '1,424 GW', 
    change: '+5.4%', 
    status: 'nominal', 
    icon: Zap, 
    color: 'text-cyber-cyan', 
    shadow: 'shadow-neon-cyan',
    description: 'Power generation rate of core quantum fusion reactors supplying the planetary grid.'
  },
  { 
    label: 'Neural Compute Nodes', 
    value: '99.98%', 
    change: '0.00%', 
    status: 'nominal', 
    icon: Cpu, 
    color: 'text-cyber-purple', 
    shadow: 'shadow-neon-purple',
    description: 'Active telemetry and automation nodes currently synced with the central command network.'
  }
];

interface LogItem {
  timestamp: string;
  category: 'SYSTEM' | 'SECURITY' | 'INFRASTRUCTURE' | 'SIMULATION' | 'ADMIN';
  message: string;
}

export const Dashboard: React.FC = () => {
  const [telemetryLogs, setTelemetryLogs] = useState<LogItem[]>([]);
  const [activeLogFilter, setActiveLogFilter] = useState<string>('ALL');
  const [warningDismissed, setWarningDismissed] = useState<boolean>(false);
  const [activeKpis, setActiveKpis] = useState(kpiStats);

  // Generate scrolling log list
  useEffect(() => {
    const logPool: Omit<LogItem, 'timestamp'>[] = [
      { category: 'SYSTEM', message: 'Syncing with Neo-Tokyo Grid core...' },
      { category: 'INFRASTRUCTURE', message: 'Purging plasma exhaust from Fusion Core-4...' },
      { category: 'SECURITY', message: 'Shield Node 12 corrected phase variance (+0.04mHz).' },
      { category: 'SIMULATION', message: 'AI Behavior Engine processing generation 84,204...' },
      { category: 'SYSTEM', message: 'Resource bandwidth scale delta detected.' },
      { category: 'ADMIN', message: 'Core temperature thresholds verified at 42.4°C.' },
      { category: 'SYSTEM', message: 'Biosphere Carbon Capture modules operating at peak.' },
      { category: 'SECURITY', message: 'Deflected cosmic particle cluster at sector 84-Alpha.' },
      { category: 'SYSTEM', message: 'Completed interplanetary telemetry cycle.' },
    ];

    // Seed logs
    const initialLogs = logPool.slice(0, 5).map((log, idx) => {
      const timeOffset = new Date(Date.now() - (5 - idx) * 5000);
      const timestamp = timeOffset.toLocaleTimeString('en-US', { hour12: false });
      return { ...log, timestamp };
    });
    setTelemetryLogs(initialLogs);

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      setTelemetryLogs(prev => [
        { ...randomLog, timestamp },
        ...prev.slice(0, 19)
      ]);

      // Modulate KPIs slightly for dynamic view
      setActiveKpis(prev => prev.map(kpi => {
        if (kpi.status === 'warning') return kpi;
        if (kpi.label.includes('Fusion')) {
          const delta = (Math.random() * 20 - 10).toFixed(1);
          const val = 1424 + Math.round(parseFloat(delta));
          return { ...kpi, value: `${val} GW` };
        }
        return kpi;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = telemetryLogs.filter(log => 
    activeLogFilter === 'ALL' || log.category === activeLogFilter
  );

  return (
    <div className="space-y-6">
      {/* Dynamic Scrolled Notice Banner */}
      {!warningDismissed && (
        <div className="bg-slate-950 border border-cyber-border rounded px-4 py-2 flex items-center justify-between gap-4 animate-pulse-fast">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-1.5 text-cyber-red shrink-0 text-xs font-digital font-bold tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              SYSTEM WARNINGS:
            </div>
            <div className="text-xs text-slate-400 font-digital overflow-x-hidden truncate">
              Shield Node 15 is operating at 78% efficiency. Thermal thresholds normal. Regional power redistribution scheduled for 04:00 UTC.
            </div>
          </div>
          <button 
            onClick={() => setWarningDismissed(true)}
            className="text-slate-500 hover:text-white transition-colors"
            title="Dismiss Warnings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className={`cyber-panel p-4 flex flex-col justify-between min-h-[110px] group hover:border-slate-700 transition-all duration-200 cursor-pointer relative`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">{kpi.label}</span>
                  <div className="group/tooltip relative">
                    <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-help" />
                    <div className="absolute left-0 top-full mt-2 w-48 p-2.5 rounded bg-slate-950/95 backdrop-blur border border-cyber-border text-[10px] text-slate-300 leading-relaxed hidden group-hover/tooltip:block z-50 shadow-2xl">
                      {kpi.description}
                    </div>
                  </div>
                </div>
                <Icon className={`w-4 h-4 ${kpi.color} group-hover:scale-110 transition-transform`} />
              </div>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-2xl font-bold font-digital tracking-wide text-white">{kpi.value}</span>
                <span className={`text-xs font-digital font-semibold ${kpi.change.startsWith('+') ? 'text-cyber-green' : kpi.change.startsWith('-') ? 'text-cyber-red' : 'text-slate-400'}`}>
                  {kpi.change}
                </span>
              </div>
              {/* LED status indicator */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${kpi.status === 'nominal' ? 'bg-cyber-green shadow-[0_0_4px_#00f5d4]' : 'bg-cyber-yellow shadow-[0_0_4px_#ffb703]'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Infrastructure Health Chart */}
        <div className="cyber-panel p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-cyber-border pb-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2">
                <Server className="w-4 h-4 text-cyber-green" />
                Infrastructure Health Status
              </h2>
              <p className="text-[10px] text-slate-500 font-digital mt-0.5">TELEMETRY GRID SENSOR FEED</p>
            </div>
            <button className="p-1 rounded bg-slate-900 border border-cyber-border text-slate-400 hover:text-cyber-green transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <ChartGradients />
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" tickLine={false} style={{ fontSize: '10px', fontFamily: 'Share Tech Mono' }} />
                <YAxis domain={[80, 100]} stroke="#64748b" tickLine={false} style={{ fontSize: '10px', fontFamily: 'Share Tech Mono' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontFamily: 'Share Tech Mono', marginTop: '10px' }} />
                <Area 
                  name="Global Stability Index" 
                  type="monotone" 
                  dataKey="health" 
                  stroke="#00f5d4" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#gradientGreen)" 
                />
                <Area 
                  name="Network Latency (ms)" 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#00f2fe" 
                  strokeWidth={1.5}
                  fillOpacity={1} 
                  fill="url(#gradientCyan)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Simulation Load Chart */}
        <div className="cyber-panel p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-cyber-border pb-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyber-purple" />
                Simulation Node Overload Index
              </h2>
              <p className="text-[10px] text-slate-500 font-digital mt-0.5">QUANTUM AI MULTI-AGENT THREADS</p>
            </div>
            <button className="p-1 rounded bg-slate-900 border border-cyber-border text-slate-400 hover:text-cyber-purple transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" tickLine={false} style={{ fontSize: '10px', fontFamily: 'Share Tech Mono' }} />
                <YAxis stroke="#64748b" tickLine={false} style={{ fontSize: '10px', fontFamily: 'Share Tech Mono' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontFamily: 'Share Tech Mono', marginTop: '10px' }} />
                <Line 
                  name="Compute Load" 
                  type="monotone" 
                  dataKey="load" 
                  stroke="#9b5de5" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, stroke: '#9b5de5', strokeWidth: 1, fill: '#070a13' }}
                  activeDot={{ r: 6, stroke: '#9b5de5', strokeWidth: 2 }} 
                />
                <Line 
                  name="Simulated Clusters" 
                  type="monotone" 
                  dataKey="nodes" 
                  stroke="#f15bb5" 
                  strokeWidth={2} 
                  dot={{ r: 3, stroke: '#f15bb5', strokeWidth: 1, fill: '#070a13' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Analysis Pie Chart */}
        <div className="cyber-panel p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-cyber-border pb-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-cyber-red" />
                Civilization Risk Threat Analysis
              </h2>
              <p className="text-[10px] text-slate-500 font-digital mt-0.5">CURRENT SECTOR RISK METRICS</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Threat Vector']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3 px-4">
              {riskData.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-digital font-bold text-white text-right">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Utilization Stacked Bar */}
        <div className="cyber-panel p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-cyber-border pb-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyber-cyan" />
                Resource Grid Utilization
              </h2>
              <p className="text-[10px] text-slate-500 font-digital mt-0.5">EPOCH RESOURCE METRICS</p>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" tickLine={false} style={{ fontSize: '10px', fontFamily: 'Share Tech Mono' }} />
                <YAxis stroke="#64748b" tickLine={false} style={{ fontSize: '10px', fontFamily: 'Share Tech Mono' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="rect" wrapperStyle={{ fontSize: '10px', fontFamily: 'Share Tech Mono', marginTop: '5px' }} />
                <Bar name="CPU cores" dataKey="cpu" stackId="a" fill="#00f2fe" />
                <Bar name="Quantum Memory" dataKey="memory" stackId="a" fill="#9b5de5" />
                <Bar name="Tachyon Bandwidth" dataKey="bandwidth" stackId="a" fill="#00f5d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Terminal Live Telemetry Feeds */}
      <div className="cyber-panel p-5 space-y-3 border-cyber-cyan/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyber-border pb-2 gap-2">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest font-digital">
            <Terminal className="w-4 h-4 text-cyber-cyan" />
            Live Secure Telemetry Log Ticker
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'SYSTEM', 'SECURITY', 'INFRASTRUCTURE', 'SIMULATION', 'ADMIN'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveLogFilter(cat)}
                className={`px-2 py-0.5 rounded text-[10px] font-digital transition-all duration-150 border
                  ${activeLogFilter === cat 
                    ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan' 
                    : 'bg-slate-900 border-cyber-border/40 text-slate-400 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[#05070d]/80 rounded p-4 font-digital text-xs text-cyber-cyan/85 h-40 overflow-y-auto space-y-1.5 border border-cyber-border/40 select-none shadow-inner">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-600 text-center py-8">NO TELEMETRY LOGS IN THIS CATEGORY</div>
          ) : (
            filteredLogs.map((log, index) => (
              <div key={index} className="flex gap-2 text-[11px]">
                <span className="text-slate-600 shrink-0 font-digital">SYS&gt;</span>
                <span className="text-slate-500 font-digital shrink-0">[{log.timestamp}]</span>
                <span className={`px-1 rounded font-digital text-[9px] mr-1 shrink-0
                  ${log.category === 'SECURITY' ? 'bg-cyber-red/10 border border-cyber-red/30 text-cyber-red' :
                    log.category === 'INFRASTRUCTURE' ? 'bg-cyber-green/10 border border-cyber-green/30 text-cyber-green' :
                    log.category === 'SIMULATION' ? 'bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple' :
                    log.category === 'ADMIN' ? 'bg-cyber-pink/10 border border-cyber-pink/30 text-cyber-pink' :
                    'bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan'
                  }`}
                >
                  {log.category}
                </span>
                <span className={index === 0 ? 'text-white font-semibold' : 'opacity-85'}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
