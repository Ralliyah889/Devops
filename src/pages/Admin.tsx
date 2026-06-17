import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Key, Terminal, Server, Send } from 'lucide-react';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export const Admin: React.FC = () => {
  // Config States
  const [thermalLimit, setThermalLimit] = useState(85);
  const [encryption, setEncryption] = useState('Kyber-1024-Quantum');
  const [scalingCap, setScalingCap] = useState(45);
  const [alertsEnabled, setAlertsEnabled] = useState({
    thermal: true,
    cyber: true,
    power: false
  });

  // Modal State
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [authKey, setAuthKey] = useState('');
  const [authError, setAuthError] = useState(false);
  const [systemLocked, setSystemLocked] = useState(false);

  // Terminal States
  const [cmdInput, setCmdInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { text: 'OmniCivilization Terminal v1.0.84', type: 'output' },
    { text: 'Type "help" for a list of valid directive overrides.', type: 'output' },
    { text: 'SECURE CONNECTIONS ACTIVATED OVER LINK-8.', type: 'success' }
  ]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    const inputCmd = cmdInput.trim().toLowerCase();
    const newHistory: TerminalLine[] = [...terminalHistory, { text: `root@omni:~# ${cmdInput}`, type: 'input' }];

    setCmdInput('');

    // Process basic mock shell commands
    setTimeout(() => {
      switch (inputCmd) {
        case 'help':
          newHistory.push(
            { text: 'Available commands:', type: 'output' },
            { text: '  status    - Displays global grid diagnostics.', type: 'output' },
            { text: '  decrypt   - Resolves active quantum anomaly.', type: 'output' },
            { text: '  alert     - Triggers mock alert diagnostic.', type: 'output' },
            { text: '  clear     - Clears the terminal output screen.', type: 'output' }
          );
          break;
        case 'status':
          newHistory.push(
            { text: 'GLOBAL METRIC STATUS SUMMARY:', type: 'output' },
            { text: `  - Neural Nodes: ${scalingCap}/${scalingCap} Online`, type: 'output' },
            { text: `  - Thermal Boundary Limit: ${thermalLimit}°C`, type: 'output' },
            { text: `  - Quantum Cryptography: ${encryption}`, type: 'output' },
            { text: '  - Database Integrity: 100% Verified', type: 'success' }
          );
          break;
        case 'decrypt':
          newHistory.push(
            { text: 'INITIATING DECRYPTION PROTOCOL [KYBER-SYNC]...', type: 'output' },
            { text: 'DECRYPT SUCCESS: Re-allocated grid power vectors.', type: 'success' }
          );
          break;
        case 'alert':
          newHistory.push(
            { text: 'TEST DIAL ALERT SEQUENCE ACTIVATED.', type: 'error' },
            { text: 'Broadcast warning packet dispatched to Tokyo/Berlin sectors.', type: 'output' }
          );
          break;
        case 'clear':
          setTerminalHistory([]);
          return;
        default:
          newHistory.push({ text: `SYNTAX ERROR: Command "${cmdInput}" not recognized by secure terminal shell.`, type: 'error' });
      }
      setTerminalHistory(newHistory);
    }, 50);
  };

  const handleOverrideTrigger = () => {
    if (authKey === 'ADMIN-70D') {
      setSystemLocked(true);
      setShowOverrideModal(false);
      setAuthError(false);
      setAuthKey('');
      setTerminalHistory(prev => [
        ...prev,
        { text: 'EMERGENCY: SYSTEM SHUTDOWN PROTOCOL TRIPPED BY AUTHORIZED DEPUTY OVERRIDE KEY.', type: 'error' }
      ]);
    } else {
      setAuthError(true);
    }
  };

  const handleSystemRestore = () => {
    setSystemLocked(false);
    setTerminalHistory(prev => [
      ...prev,
      { text: 'SYSTEM OVERRIDE CLEARED: Re-initializing normal grid synchronization.', type: 'success' }
    ]);
  };

  return (
    <div className="space-y-6 relative">
      {/* Lockdown Status Notification Banner */}
      {systemLocked && (
        <div className="bg-cyber-red/20 border border-cyber-red rounded p-4 flex flex-col sm:flex-row justify-between items-center gap-4 animate-pulse">
          <div className="flex items-center gap-3 font-digital text-sm text-cyber-red font-bold">
            <AlertTriangle className="w-5 h-5" />
            OMNICIVILIZATION SYSTEM LOCKED IN EMERGENCY SAFE MODE
          </div>
          <button
            onClick={handleSystemRestore}
            className="px-3 py-1.5 rounded bg-slate-900 border border-cyber-red hover:border-cyber-green text-cyber-red hover:text-cyber-green font-digital text-xs font-bold transition-all"
          >
            DISARM SAFE MODE
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Threshold limits settings */}
        <div className="cyber-panel p-5 space-y-6">
          <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2 border-b border-cyber-border pb-3">
            <Server className="w-4 h-4 text-cyber-cyan" />
            Alert Threshold Adjustments
          </h2>

          <div className="space-y-5 font-digital text-xs">
            {/* Thermal Shutdown slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>THERMAL SHUTDOWN LIMIT:</span>
                <span className="text-cyber-yellow font-bold">{thermalLimit}°C</span>
              </div>
              <input
                type="range"
                min="60"
                max="120"
                value={thermalLimit}
                onChange={(e) => setThermalLimit(parseInt(e.target.value))}
                className="w-full accent-cyber-yellow cursor-pointer bg-slate-900 appearance-none h-1"
              />
              <span className="text-[9px] text-slate-500 block">Sets absolute core thermal cooling valve trigger limit.</span>
            </div>

            {/* Scale Limit slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>NODE SCALING CAP:</span>
                <span className="text-cyber-purple font-bold">{scalingCap} Clusters</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={scalingCap}
                onChange={(e) => setScalingCap(parseInt(e.target.value))}
                className="w-full accent-cyber-purple cursor-pointer bg-slate-900 appearance-none h-1"
              />
              <span className="text-[9px] text-slate-500 block">Upper bounds limit on active container clusters.</span>
            </div>

            {/* Cryptographic Selection */}
            <div className="space-y-2">
              <span className="text-slate-300 block">ENCRYPTION PROTOCOL ALGORITHM:</span>
              <select
                value={encryption}
                onChange={(e) => setEncryption(e.target.value)}
                className="w-full bg-[#05070d] border border-cyber-border rounded px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
              >
                <option value="Kyber-1024-Quantum">KYBER-1024-QUANTUM (Recommended)</option>
                <option value="AES-256-GCM">AES-256-GCM (Legacy Security)</option>
                <option value="ChaCha20-Poly1305">CHACHA20-POLY1305</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <span className="text-slate-300 block uppercase">Critical Alarm Dispatches</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 p-2.5 rounded bg-slate-950/60 border border-cyber-border/40 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertsEnabled.thermal}
                    onChange={(e) => setAlertsEnabled(prev => ({ ...prev, thermal: e.target.checked }))}
                    className="w-3.5 h-3.5 text-cyber-cyan bg-[#05070d] border-cyber-border accent-cyber-cyan"
                  />
                  <span>Thermal Alarm</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded bg-slate-950/60 border border-cyber-border/40 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertsEnabled.cyber}
                    onChange={(e) => setAlertsEnabled(prev => ({ ...prev, cyber: e.target.checked }))}
                    className="w-3.5 h-3.5 text-cyber-cyan bg-[#05070d] border-cyber-border accent-cyber-cyan"
                  />
                  <span>Breach Alert</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded bg-slate-950/60 border border-cyber-border/40 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertsEnabled.power}
                    onChange={(e) => setAlertsEnabled(prev => ({ ...prev, power: e.target.checked }))}
                    className="w-3.5 h-3.5 text-cyber-cyan bg-[#05070d] border-cyber-border accent-cyber-cyan"
                  />
                  <span>Power Sync</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Console Terminal shell emulator */}
        <div className="cyber-panel p-5 space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2 border-b border-cyber-border pb-3">
            <Terminal className="w-4 h-4 text-cyber-purple" />
            Security Override Shell
          </h2>

          <div className="flex flex-col bg-[#05070d]/90 rounded border border-cyber-border/60 p-4 h-80 font-digital text-xs select-none">
            {/* Terminal screen */}
            <div className="flex-1 overflow-y-auto space-y-1.5 mb-3 pr-2">
              {terminalHistory.map((line, index) => (
                <div 
                  key={index} 
                  className={`
                    ${line.type === 'input' ? 'text-white' : ''}
                    ${line.type === 'output' ? 'text-slate-400' : ''}
                    ${line.type === 'error' ? 'text-cyber-red font-semibold' : ''}
                    ${line.type === 'success' ? 'text-cyber-green font-semibold' : ''}
                  `}
                >
                  {line.text}
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleTerminalSubmit} className="flex gap-2 border-t border-cyber-border/40 pt-2">
              <span className="text-cyber-purple shrink-0 self-center">root@omni:~#</span>
              <input
                type="text"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                placeholder="Type command (e.g. status, decrypt, alert)..."
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-white font-mono tracking-wide placeholder-slate-600"
              />
              <button
                type="submit"
                className="p-1 text-slate-400 hover:text-cyber-purple transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Emergency Lock override triggers */}
      <div className="cyber-panel p-5 space-y-4 border-cyber-red/20 bg-gradient-to-br from-cyber-bg-card to-[#1a0b12]/30">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-cyber-red animate-pulse" />
          <div>
            <h3 className="text-sm font-bold font-digital tracking-wide text-white uppercase">Emergency Core Lock protocols</h3>
            <p className="text-xs text-slate-400 font-digital mt-0.5">DISPATCH SAFETY DEPUTY SHIELDS OVER PLANETARY CORE DOME MODULES</p>
          </div>
        </div>

        <div className="font-digital text-xs space-y-3">
          <p className="text-slate-400 max-w-2xl">
            In the event of a catastrophic grid collapse, solar surge damage, or cyber intelligence mutiny, invoke an immediate safety lockout. Safely isolates energy storage arrays, discharges containment zones, and suspends simulations.
          </p>

          <button
            onClick={() => setShowOverrideModal(true)}
            disabled={systemLocked}
            className="px-4 py-2.5 bg-cyber-red/20 hover:bg-cyber-red/30 border border-cyber-red text-cyber-red hover:text-white rounded font-bold font-digital tracking-wider transition-all disabled:opacity-50 shadow-neon-red uppercase"
          >
            INITIATE OMNI SHUTDOWN LOCK
          </button>
        </div>
      </div>

      {/* Modal dialog for authorization validation */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="cyber-panel border-cyber-red max-w-md w-full p-6 space-y-4 bg-cyber-bg-card relative">
            <h3 className="text-base font-bold font-digital text-cyber-red uppercase tracking-wider flex items-center gap-2 border-b border-cyber-border pb-2">
              <Key className="w-5 h-5" />
              Enter Authorized Override Key
            </h3>

            <p className="text-xs font-digital text-slate-400">
              Triggering this override will deploy electromagnetic static shells around all sectors. Input safety passkey <code className="bg-slate-900 border border-cyber-border px-1.5 py-0.5 rounded text-white text-glow-red font-mono">ADMIN-70D</code> to confirm override action.
            </p>

            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Enter auth code (ADMIN-70D)..."
                value={authKey}
                onChange={(e) => {
                  setAuthKey(e.target.value);
                  setAuthError(false);
                }}
                className="w-full bg-[#05070d] border border-cyber-border rounded px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyber-red font-digital tracking-wider"
              />
              {authError && (
                <span className="text-[10px] text-cyber-red font-digital font-bold block">
                  ERR: SECURITY AUTHENTICATION KEY NOT RECOGNIZED BY CENTRAL HUB.
                </span>
              )}
            </div>

            <div className="flex gap-2 justify-end font-digital text-xs">
              <button
                onClick={() => {
                  setShowOverrideModal(false);
                  setAuthError(false);
                  setAuthKey('');
                }}
                className="px-3.5 py-2 rounded bg-slate-950 border border-cyber-border hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleOverrideTrigger}
                className="px-3.5 py-2 rounded bg-cyber-red/20 hover:bg-cyber-red/30 border border-cyber-red text-cyber-red hover:text-white font-bold transition-all shadow-neon-red"
              >
                CONFIRM OVERRIDE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
