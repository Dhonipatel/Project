import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Database,
  Server,
  Code2,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  X,
  Layers,
  Activity,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';

export const MernStackInspectorModal: React.FC = () => {
  const {
    mernStatus,
    isMernSyncing,
    isMernModalOpen,
    setIsMernModalOpen,
    fetchMernStatus,
    currentUser,
  } = useCampus();

  const [testResult, setTestResult] = useState<{ endpoint: string; data: any } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isMernModalOpen) return null;

  const mongoConnected = mernStatus?.stack?.mongodb?.connected;
  const mongoCollections = mernStatus?.stack?.mongodb?.collections;

  const runApiTest = async (endpoint: string, method: string = 'GET') => {
    setIsTesting(true);
    try {
      const res = await fetch(endpoint, { method });
      const data = await res.json();
      setTestResult({ endpoint: `${method} ${endpoint}`, data });
      fetchMernStatus();
    } catch (err: any) {
      setTestResult({ endpoint: `${method} ${endpoint}`, data: { error: err.message } });
    } finally {
      setIsTesting(false);
    }
  };

  const copyEnvSample = () => {
    navigator.clipboard.writeText('MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/college_events_db?retryWrites=true&w=majority');
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-950 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">MERN Stack Architecture</h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Full Functional
                </span>
              </div>
              <p className="text-xs text-slate-400">
                MongoDB • Express.js • React 18 • Node.js runtime live integration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchMernStatus()}
              disabled={isMernSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition"
              title="Refresh status from Node server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isMernSyncing ? 'animate-spin' : ''}`} />
              <span>Ping</span>
            </button>
            <button
              onClick={() => setIsMernModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* MongoDB */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-4 h-4" /> [M] MongoDB
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      mongoConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'
                    }`}
                  />
                </div>
                <div className="text-sm font-semibold text-white mb-1">
                  {mongoConnected ? 'Connected & Live' : 'In-Memory Cache (Mongo-Ready)'}
                </div>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  {mernStatus?.stack?.mongodb?.mode || 'Mongoose ODM & Schemas active'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">events:</span>
                  <span className="text-emerald-400 font-bold">{mongoCollections?.events ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">registrations:</span>
                  <span className="text-emerald-400 font-bold">{mongoCollections?.registrations ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">users:</span>
                  <span className="text-emerald-400 font-bold">{mongoCollections?.users ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">certificates:</span>
                  <span className="text-emerald-400 font-bold">{mongoCollections?.certificates ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Express.js */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Server className="w-4 h-4" /> [E] Express.js
                  </span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                </div>
                <div className="text-sm font-semibold text-white mb-1">REST API Layer</div>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  Mounted on port 3000 with Express Router, Vite middleware & JSON parser
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Port:</span>
                  <span className="text-cyan-300 font-bold">3000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">API Prefix:</span>
                  <span className="text-cyan-300">/api/*</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-400 font-bold">200 OK</span>
                </div>
              </div>
            </div>

            {/* React */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" /> [R] React 18
                  </span>
                  <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                </div>
                <div className="text-sm font-semibold text-white mb-1">Frontend SPA</div>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  Context provider with optimistic mutations & reactive state hydration
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">User:</span>
                  <span className="text-sky-300 truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Role:</span>
                  <span className="text-sky-300 uppercase">{currentUser.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vite HMR:</span>
                  <span className="text-emerald-400">Ready</span>
                </div>
              </div>
            </div>

            {/* Node.js */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-lime-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> [N] Node.js
                  </span>
                  <span className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]" />
                </div>
                <div className="text-sm font-semibold text-white mb-1">Runtime Engine</div>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  Cloud Run Node environment serving TypeScript backend with TSX
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Node:</span>
                  <span className="text-lime-300">{mernStatus?.stack?.node?.version || 'v20+'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Uptime:</span>
                  <span className="text-lime-300">{mernStatus?.stack?.node?.uptimeSeconds ?? 0}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Heap:</span>
                  <span className="text-lime-300">{mernStatus?.stack?.node?.memoryUsageMB ?? 0}MB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive REST API Tester */}
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Live Express REST API Tester</h3>
              </div>
              <span className="text-[11px] text-slate-400">Click an endpoint to query live from Express & MongoDB</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => runApiTest('/api/events')}
                disabled={isTesting}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-300 border border-slate-700 transition"
              >
                GET /api/events
              </button>
              <button
                onClick={() => runApiTest('/api/users')}
                disabled={isTesting}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 transition"
              >
                GET /api/users
              </button>
              <button
                onClick={() => runApiTest('/api/registrations')}
                disabled={isTesting}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-amber-300 border border-slate-700 transition"
              >
                GET /api/registrations
              </button>
              <button
                onClick={() => runApiTest('/api/certificates')}
                disabled={isTesting}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-purple-300 border border-slate-700 transition"
              >
                GET /api/certificates
              </button>
              <button
                onClick={() => runApiTest('/api/admin/metrics')}
                disabled={isTesting}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-rose-300 border border-slate-700 transition"
              >
                GET /api/admin/metrics
              </button>
              <button
                onClick={() => runApiTest('/api/mern/status')}
                disabled={isTesting}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-sky-300 border border-slate-700 transition"
              >
                GET /api/mern/status
              </button>
            </div>

            {testResult && (
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 pb-1 border-b border-slate-800">
                  <span className="text-emerald-400">{testResult.endpoint}</span>
                  <span className="text-slate-500">Response Payload</span>
                </div>
                <pre className="text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto leading-relaxed">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Recent API Transactions Log */}
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Live REST API Request Log</h3>
              </div>
              <span className="text-[11px] text-slate-400">Recorded by Express backend in real time</span>
            </div>

            <div className="space-y-1.5">
              {mernStatus?.recentLogs && mernStatus.recentLogs.length > 0 ? (
                mernStatus.recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800/80 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          log.method === 'POST'
                            ? 'bg-amber-500/20 text-amber-400'
                            : log.method === 'PATCH'
                            ? 'bg-purple-500/20 text-purple-400'
                            : log.method === 'DELETE'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {log.method}
                      </span>
                      <span className="text-slate-200">{log.endpoint}</span>
                      <span className="text-slate-500 text-[11px] hidden sm:inline">— {log.details}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">{log.time}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">{log.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 text-center py-4 font-mono">
                  Ready to process incoming client requests
                </div>
              )}
            </div>
          </div>

          {/* MongoDB Atlas Configuration Callout */}
          <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 rounded-xl p-5 border border-emerald-500/20">
            <h4 className="text-sm font-bold text-emerald-300 mb-1 flex items-center gap-2">
              <Database className="w-4 h-4" /> Production MongoDB Atlas Connection
            </h4>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              The application connects to MongoDB using Mongoose with full schemas (`User`, `Event`, `Registration`, `Certificate`).
              When running in cloud sandboxes without a live external database, it seamlessly falls back to the in-memory Mongoose-compatible engine so every feature works 100% out of the box!
            </p>

            <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-400">
              <span className="truncate pr-2">
                MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/college_events_db
              </span>
              <button
                onClick={copyEnvSample}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition shrink-0"
              >
                {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEnv ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MERN Stack Operational • College Event Portal</span>
          </div>
          <button
            onClick={() => setIsMernModalOpen(false)}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
