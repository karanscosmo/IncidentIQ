import { Database, Zap, CheckCircle2, Activity, ShieldCheck, AlertCircle, Box, Server, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { dashboardService } from '../services/api'

interface HealthData {
  status: string;
  hindsight_connected: boolean;
  hindsight_memory_bank: string;
  llm_connected: boolean;
  build_version: string;
  environment: string;
}

export default function Settings() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await dashboardService.getHealth()
        setHealth(res.data)
      } catch (err) {
        console.error("Failed to fetch system health", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !health) {
    return <div className="max-w-4xl flex justify-center py-20"><Activity className="w-8 h-8 text-primary animate-spin" /></div>
  }

  const isHealthy = health?.status === 'healthy'

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-outline-variant pb-6">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface mb-2 flex items-center gap-3">
            System Health
            {isHealthy ? (
              <span className="bg-emerald-500/10 text-emerald-400 text-sm px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Operational
              </span>
            ) : (
              <span className="bg-error/10 text-error text-sm px-3 py-1 rounded-full border border-error/20 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Degraded
              </span>
            )}
          </h2>
          <p className="text-on-surface-variant font-body-md">Live connectivity and environment metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Memory Bank Status */}
        <section className="glass-panel p-6 rounded-xl border border-outline-variant space-y-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${health?.hindsight_connected ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-h3 text-h3 text-on-surface">Hindsight Memory</h3>
              <p className="text-sm text-on-surface-variant">Vector Knowledge Base</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/50">
              <span className="text-sm text-on-surface-variant">Connection</span>
              {health?.hindsight_connected ? (
                <span className="text-sm text-emerald-400 font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Connected</span>
              ) : (
                <span className="text-sm text-error font-medium flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> Disconnected</span>
              )}
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/50">
              <span className="text-sm text-on-surface-variant">Active Bank</span>
              <span className="text-sm font-mono bg-surface-container px-2 py-1 rounded text-primary">{health?.hindsight_memory_bank || 'None'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/50">
              <span className="text-sm text-on-surface-variant">Latency</span>
              <span className="text-sm text-emerald-400">42ms</span>
            </div>
          </div>
        </section>

        {/* Agent Config */}
        <section className="glass-panel p-6 rounded-xl border border-outline-variant space-y-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${health?.llm_connected ? 'bg-secondary/20 text-secondary' : 'bg-error/20 text-error'}`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-h3 text-h3 text-on-surface">LangGraph Agents</h3>
              <p className="text-sm text-on-surface-variant">LLM Orchestration</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/50">
              <span className="text-sm text-on-surface-variant">Connection</span>
              {health?.llm_connected ? (
                <span className="text-sm text-emerald-400 font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Connected</span>
              ) : (
                <span className="text-sm text-error font-medium flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> Disconnected</span>
              )}
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/50">
              <span className="text-sm text-on-surface-variant">Active Model</span>
              <span className="text-sm font-mono bg-surface-container px-2 py-1 rounded text-secondary">gpt-4o</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/50">
              <span className="text-sm text-on-surface-variant">Workflow Status</span>
              <span className="text-sm text-emerald-400">Active</span>
            </div>
          </div>
        </section>

        {/* Environment Info */}
        <section className="glass-panel p-6 rounded-xl border border-outline-variant space-y-6 md:col-span-2">
           <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-surface-container-highest text-on-surface">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-h3 text-h3 text-on-surface">Environment Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/50">
              <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                <Box className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-semibold">Environment</span>
              </div>
              <p className="text-lg text-on-surface font-medium">{health?.environment}</p>
            </div>
            <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/50">
              <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-semibold">API Version</span>
              </div>
              <p className="text-lg text-on-surface font-mono">{health?.build_version}</p>
            </div>
            <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/50">
              <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-semibold">Last Sync</span>
              </div>
              <p className="text-lg text-on-surface font-medium">Just now</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
