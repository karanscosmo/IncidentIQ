import { 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Database, 
  LineChart, 
  AlertTriangle,
  PlayCircle
} from 'lucide-react'

export default function Dashboard() {
  return (
    <>
      {/* Header Row */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface mb-1">Executive Overview</h2>
          <p className="text-on-surface-variant font-body-md text-body-md">Real-time system stability and incident response latency.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-container-high transition-colors flex items-center gap-2">
            <Calendar className="w-[18px] h-[18px]" />
            Last 14 Days
          </button>
          <button className="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-container-high transition-colors flex items-center gap-2">
            <Download className="w-[18px] h-[18px]" />
            Export
          </button>
        </div>
      </div>

      {/* KPIs Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="glass-panel p-4 rounded-xl flex flex-col border-l-4 border-l-error active-glow">
          <span className="text-on-surface-variant font-label-md text-[11px] uppercase mb-1">Active Incidents</span>
          <span className="text-h1 font-h1 text-error">3</span>
          <div className="mt-2 flex items-center gap-1 text-error text-[11px]">
            <TrendingUp className="w-[14px] h-[14px]" />
            +1 vs yesterday
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col">
          <span className="text-on-surface-variant font-label-md text-[11px] uppercase mb-1">Incidents Resolved</span>
          <span className="text-h1 font-h1 text-on-surface">142</span>
          <div className="mt-2 flex items-center gap-1 text-emerald-400 text-[11px]">
            <TrendingUp className="w-[14px] h-[14px]" />
            12% increase
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col">
          <span className="text-on-surface-variant font-label-md text-[11px] uppercase mb-1">Memory Stored</span>
          <span className="text-h1 font-h1 text-on-surface">1.2k</span>
          <div className="mt-2 flex items-center gap-1 text-on-surface-variant text-[11px]">
            <Database className="w-[14px] h-[14px]" />
            Vector embeddings
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col">
          <span className="text-on-surface-variant font-label-md text-[11px] uppercase mb-1">Similar Matches</span>
          <span className="text-h1 font-h1 text-primary">89</span>
          <div className="mt-2 flex items-center gap-1 text-primary text-[11px]">
            <LineChart className="w-[14px] h-[14px]" />
            AI correlation
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col border-l-4 border-l-tertiary">
          <span className="text-on-surface-variant font-label-md text-[11px] uppercase mb-1">Deployment Risks</span>
          <span className="text-h1 font-h1 text-tertiary">2</span>
          <div className="mt-2 flex items-center gap-1 text-tertiary text-[11px]">
            <AlertTriangle className="w-[14px] h-[14px]" />
            High impact
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col">
          <span className="text-on-surface-variant font-label-md text-[11px] uppercase mb-1">Avg Resolution</span>
          <span className="text-h1 font-h1 text-on-surface">14m</span>
          <div className="mt-2 flex items-center gap-1 text-emerald-400 text-[11px]">
            <TrendingDown className="w-[14px] h-[14px]" />
            -4m reduction
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Chart & Health Section */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-h3 text-h3 text-on-surface">Incident Trend</h3>
                <p className="text-body-sm text-on-surface-variant">Last 14 days frequency and duration analysis</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="text-[11px] font-label-md uppercase text-on-surface-variant">Count</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="text-[11px] font-label-md uppercase text-on-surface-variant">MTTR</span>
                </div>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-[300px] w-full flex items-end justify-between gap-2 px-2 relative">
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
                <div className="border-t border-outline"></div>
                <div className="border-t border-outline"></div>
                <div className="border-t border-outline"></div>
                <div className="border-t border-outline"></div>
              </div>
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 300">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#c0c1ff" stopOpacity="0.2"></stop>
                    <stop offset="100%" stopColor="#c0c1ff" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,250 Q100,180 200,220 T400,100 T600,150 T800,80 V300 H0 Z" fill="url(#chartGradient)"></path>
                <path d="M0,250 Q100,180 200,220 T400,100 T600,150 T800,80" fill="none" stroke="#c0c1ff" strokeLinecap="round" strokeWidth="3"></path>
                <circle cx="200" cy="220" fill="#c0c1ff" r="4"></circle>
                <circle className="drop-shadow-lg" cx="400" cy="100" fill="#fff" r="6"></circle>
                <circle cx="600" cy="150" fill="#c0c1ff" r="4"></circle>
              </svg>
              <div className="absolute top-[80px] left-[380px] bg-surface-container-highest border border-outline-variant p-2 rounded shadow-xl pointer-events-none">
                <p className="text-[10px] font-bold text-on-surface mb-1">MAY 14, 2024</p>
                <p className="text-[12px] text-primary">Incidents: 12</p>
                <p className="text-[12px] text-secondary">MTTR: 8.4m</p>
              </div>
            </div>
            <div className="flex justify-between mt-4 px-2 text-on-surface-variant font-label-md text-[10px]">
              <span>MAY 01</span>
              <span>MAY 04</span>
              <span>MAY 08</span>
              <span>MAY 11</span>
              <span>MAY 14</span>
            </div>
          </div>

          {/* System Health List */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
              <h3 className="font-h3 text-h3 text-on-surface">System Health</h3>
              <span className="text-body-sm text-on-surface-variant">4 Dependencies</span>
            </div>
            <div className="divide-y divide-outline-variant">
              <div className="px-6 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">dns</span>
                  </div>
                  <div>
                    <p className="font-label-md text-[13px] text-on-surface">API Gateway</p>
                    <p className="text-[11px] text-on-surface-variant">Cluster: us-east-1</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="status-dot bg-emerald-400"></span>
                  <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">Healthy</span>
                </div>
              </div>

              <div className="px-6 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">payments</span>
                  </div>
                  <div>
                    <p className="font-label-md text-[13px] text-on-surface">Payment Service</p>
                    <p className="text-[11px] text-on-surface-variant">P99 Latency: 450ms (+150ms)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="status-dot bg-tertiary"></span>
                  <span className="text-[11px] font-medium text-tertiary uppercase tracking-wider">Warning</span>
                </div>
              </div>

              <div className="px-6 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-error text-[18px]">cached</span>
                  </div>
                  <div>
                    <p className="font-label-md text-[13px] text-on-surface">Redis Cache</p>
                    <p className="text-[11px] text-on-surface-variant">Memory Usage: 98.4%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="status-dot bg-error animate-pulse"></span>
                  <span className="text-[11px] font-medium text-error uppercase tracking-wider">Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar / Timeline */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* AI Insight Panel */}
          <div className="ai-border glass-panel rounded-xl p-5 bg-gradient-to-br from-primary-container/5 to-secondary-container/5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h3 className="font-h3 text-h3 text-primary">Copilot Insight</h3>
            </div>
            <p className="text-body-sm text-on-surface mb-4 leading-relaxed">
              Detected recurring <span className="font-mono text-[12px] bg-surface-container px-1 py-0.5 rounded text-secondary">OOM_KILLED</span> patterns in the Redis Cluster. Based on <span className="font-semibold">INC-882 (Jan 12)</span>, this is likely caused by an unbounded cache growth in the Promotion Engine.
            </p>
            <div className="bg-surface-container-highest/40 p-3 rounded-lg border border-outline-variant/30">
              <p className="text-[11px] font-label-md uppercase text-on-surface-variant mb-2">Recommended Action</p>
              <div className="flex items-start gap-3">
                <PlayCircle className="text-primary w-[18px] h-[18px]" />
                <p className="text-[12px] text-on-surface font-medium">Execute Runbook: "Redis Cluster Memory Eviction"</p>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-h3 text-h3 text-on-surface">Incident Log</h3>
              <button className="text-primary text-[12px] font-semibold hover:underline">View All</button>
            </div>
            <div className="space-y-8 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-outline-variant"></div>
              
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-error flex items-center justify-center z-10 border-4 border-surface">
                  <span className="material-symbols-outlined text-on-error text-[12px]" style={{ fontVariationSettings: "'wght' 700" }}>priority_high</span>
                </div>
                <p className="text-[10px] font-mono text-on-surface-variant mb-1">10:24 AM - ACTIVE</p>
                <p className="font-label-md text-[13px] text-on-surface font-semibold mb-1">INC-1036: Memory Leak</p>
                <p className="text-[11px] text-on-surface-variant leading-snug">Spike in non-heap memory on worker-nodes-04 group.</p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-tertiary flex items-center justify-center z-10 border-4 border-surface">
                  <span className="material-symbols-outlined text-on-tertiary text-[12px]">database</span>
                </div>
                <p className="text-[10px] font-mono text-on-surface-variant mb-1">09:15 AM - STABILIZING</p>
                <p className="font-label-md text-[13px] text-on-surface font-semibold mb-1">INC-1035: Database Deadlock</p>
                <p className="text-[11px] text-on-surface-variant leading-snug">Lock contention on 'orders_v3' table during peak load.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
