import { useState, useEffect } from 'react'
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
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { dashboardService } from '../../services/api'

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    active_incidents: 0,
    resolved_incidents: 0,
    memory_stored: 0,
    similar_matches: 0,
    deployment_risks: 0,
    avg_resolution_mins: 0
  })

  const [insight, setInsight] = useState({
    insight: 'Loading Hindsight insight...',
    action: '...'
  })

  const [health, setHealth] = useState<any>(null)

  useEffect(() => {
    dashboardService.getMetrics().then(res => {
      setMetrics(res.data)
    }).catch(err => console.error("Failed to fetch metrics", err))

    dashboardService.getInsight().then(res => {
      setInsight(res.data)
    }).catch(err => console.error("Failed to fetch insight", err))

    dashboardService.getHealth().then(res => {
      setHealth(res.data)
    }).catch(err => console.error("Failed to fetch health", err))
  }, [])

  const chartData = [
    { name: 'May 01', incidents: 4, mttr: 15 },
    { name: 'May 04', incidents: 7, mttr: 18 },
    { name: 'May 08', incidents: 3, mttr: 12 },
    { name: 'May 11', incidents: 9, mttr: 22 },
    { name: 'May 14', incidents: 12, mttr: 8.4 },
  ];

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
          <span className="text-h1 font-h1 text-error">{metrics.active_incidents}</span>
          <div className="mt-2 flex items-center gap-1 text-error text-[11px]">
            <TrendingUp className="w-[14px] h-[14px]" />
            Live Data
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col">
          <span className="text-on-surface-variant font-label-md text-[11px] uppercase mb-1">Incidents Resolved</span>
          <span className="text-h1 font-h1 text-on-surface">{metrics.resolved_incidents}</span>
          <div className="mt-2 flex items-center gap-1 text-emerald-400 text-[11px]">
            <TrendingUp className="w-[14px] h-[14px]" />
            Total Mended
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col border-l-4 border-l-primary/50">
          <span className="text-on-surface-variant font-label-md text-[11px] uppercase mb-1">Memory Stored</span>
          <span className="text-h1 font-h1 text-on-surface">{metrics.memory_stored}</span>
          <div className="mt-2 flex items-center gap-1 text-primary text-[11px] font-bold tracking-wider uppercase">
            <Database className="w-[12px] h-[12px]" />
            In Hindsight
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col border-l-4 border-l-secondary/50">
          <span className="text-on-surface-variant font-label-md text-[11px] uppercase mb-1">Similar Matches</span>
          <span className="text-h1 font-h1 text-secondary">{metrics.similar_matches}</span>
          <div className="mt-2 flex items-center gap-1 text-secondary text-[11px] font-bold tracking-wider uppercase">
            <LineChart className="w-[12px] h-[12px]" />
            From History
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col border-l-4 border-l-tertiary">
          <span className="text-on-surface-variant font-label-md text-[11px] uppercase mb-1">Deployment Risks</span>
          <span className="text-h1 font-h1 text-tertiary">{metrics.deployment_risks}</span>
          <div className="mt-2 flex items-center gap-1 text-tertiary text-[11px]">
            <AlertTriangle className="w-[14px] h-[14px]" />
            High impact
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col">
          <span className="text-on-surface-variant font-label-md text-[11px] uppercase mb-1">Avg Resolution</span>
          <span className="text-h1 font-h1 text-on-surface">{metrics.avg_resolution_mins}m</span>
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
                  <span className="text-[11px] font-label-md uppercase text-on-surface-variant">Incidents</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="text-[11px] font-label-md uppercase text-on-surface-variant">MTTR</span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMttr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: '#475569', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="incidents" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncidents)" />
                  <Area type="monotone" dataKey="mttr" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorMttr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* System Health List */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
              <h3 className="font-h3 text-h3 text-on-surface">Core Infrastructure Health</h3>
              <span className="text-body-sm text-on-surface-variant">Live Integration Status</span>
            </div>
            <div className="divide-y divide-outline-variant">
              
              <div className="px-6 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center border border-primary/30">
                    <Database className="text-primary w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-label-md text-[13px] text-on-surface">Hindsight Vector Database</p>
                    <p className="text-[11px] text-on-surface-variant">Bank ID: {health?.hindsight_memory_bank || 'loading...'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {health?.hindsight_connected ? (
                    <><span className="status-dot bg-emerald-400"></span><span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">Connected</span></>
                  ) : (
                    <><span className="status-dot bg-error animate-pulse"></span><span className="text-[11px] font-medium text-error uppercase tracking-wider">Offline</span></>
                  )}
                </div>
              </div>

              <div className="px-6 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-secondary-container/20 flex items-center justify-center border border-secondary/30">
                    <PlayCircle className="text-secondary w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-label-md text-[13px] text-on-surface">LangGraph Orchestrator</p>
                    <p className="text-[11px] text-on-surface-variant">5-Agent Multi-Step Workflow</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="status-dot bg-emerald-400"></span>
                  <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">Healthy</span>
                </div>
              </div>

              <div className="px-6 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-tertiary/20 flex items-center justify-center border border-tertiary/30">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">psychology</span>
                  </div>
                  <div>
                    <p className="font-label-md text-[13px] text-on-surface">OpenAI GPT-4o-mini</p>
                    <p className="text-[11px] text-on-surface-variant">LLM Inference Engine</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {health?.llm_connected ? (
                    <><span className="status-dot bg-emerald-400"></span><span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">Connected</span></>
                  ) : (
                    <><span className="status-dot bg-error animate-pulse"></span><span className="text-[11px] font-medium text-error uppercase tracking-wider">API Key Missing</span></>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Sidebar / Timeline */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* AI Insight Panel */}
          <div className="border border-primary/40 glass-panel rounded-xl p-5 bg-gradient-to-br from-primary-container/10 to-secondary-container/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h3 className="font-h3 text-h3 text-primary">Hindsight AI Insight</h3>
            </div>
            <p className="text-[13px] text-on-surface mb-4 leading-relaxed font-medium">
              {insight.insight}
            </p>
            <div className="bg-surface-container-highest/60 p-3 rounded-lg border border-primary/20">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">Recommended Action</p>
              <div className="flex items-start gap-3">
                <PlayCircle className="text-secondary w-[16px] h-[16px] mt-0.5" />
                <p className="text-[12px] text-on-surface font-medium">{insight.action}</p>
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
