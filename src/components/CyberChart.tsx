import React from 'react';

// Custom Tooltip component for Recharts
export const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0b0f19]/90 border border-slate-700/80 backdrop-blur-md px-3 py-2.5 rounded shadow-xl font-digital text-xs space-y-1 relative">
        {/* Neon cyan top border strip */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-cyan shadow-neon-cyan" />
        <p className="text-slate-400 font-semibold border-b border-slate-800 pb-1 mb-1">
          TIME: {label}
        </p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex justify-between items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: item.color || item.fill }}
              />
              {item.name}:
            </span>
            <span className="font-bold font-mono" style={{ color: item.color || item.fill }}>
              {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Reusable Area Chart Neon Gradients definition
export const ChartGradients: React.FC = () => {
  return (
    <defs>
      {/* Cyan gradient */}
      <linearGradient id="gradientCyan" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4}/>
        <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0}/>
      </linearGradient>

      {/* Purple gradient */}
      <linearGradient id="gradientPurple" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#9b5de5" stopOpacity={0.4}/>
        <stop offset="95%" stopColor="#9b5de5" stopOpacity={0.0}/>
      </linearGradient>

      {/* Green gradient */}
      <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#00f5d4" stopOpacity={0.4}/>
        <stop offset="95%" stopColor="#00f5d4" stopOpacity={0.0}/>
      </linearGradient>

      {/* Red gradient */}
      <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ff007f" stopOpacity={0.4}/>
        <stop offset="95%" stopColor="#ff007f" stopOpacity={0.0}/>
      </linearGradient>
    </defs>
  );
};
