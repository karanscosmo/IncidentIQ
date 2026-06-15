import { useState, useEffect } from 'react'
import { History, ShieldAlert, ArrowRightLeft, Activity, GitCommit, Database } from 'lucide-react'
import { incidentService } from '../../services/api'

interface Incident {
  id: string;
  title: string;
  similarity: string;
  date: string;
  status: string;
  tags: string[];
  resolution: string;
  root_cause: string;
}

export default function SimilarIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await incidentService.search('database connection pool worker failure', 5)
        const parsed = response.data.results.map((res: any) => {
          return {
            id: res.id,
            title: res.title,
            similarity: res.similarity,
            date: res.date,
            status: 'Resolved',
            tags: ['System', 'Database', 'Memory'], 
            resolution: res.resolution,
            root_cause: res.root_cause || res.title
          }
        })
        setIncidents(parsed)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchIncidents()
  }, [])

  const currentIncident = {
    id: "INC-ACTIVE",
    symptoms: "ALERT: payment-gateway DB connection timeouts. Worker threads failing with unhandled Exception: ConnectionPoolExhausted.",
    time: "Just now",
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface mb-1">Similar Incidents</h2>
          <p className="text-on-surface-variant font-body-md">Hindsight AI automatically correlating your live incident against the historical memory bank.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading && <div className="text-on-surface-variant p-4 flex items-center gap-2"><Activity className="animate-spin w-4 h-4"/> Fetching similar incidents from Hindsight...</div>}
        
        {incidents.map(inc => (
          <div key={inc.id} className="glass-panel p-0 rounded-xl border border-outline-variant overflow-hidden hover:border-primary/50 transition-colors">
            
            {/* Header row */}
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <History className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-on-surface">Historical Correlated Match Found</h3>
                    <p className="text-[12px] text-on-surface-variant">Hindsight Vector Search completed.</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <span className="status-dot bg-emerald-400"></span>
                  <span className="text-[12px] font-bold text-emerald-400 uppercase tracking-wider">{inc.similarity} Match</span>
               </div>
            </div>

            {/* Side by side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-variant">
              
              {/* Current Incident */}
              <div className="p-6 bg-surface-container/30 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-error">
                    <Activity className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Live Incident</span>
                  </div>
                  <span className="font-mono text-[10px] bg-error/10 text-error px-2 py-0.5 rounded border border-error/20">{currentIncident.id}</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider mb-1 block">Symptoms</span>
                    <p className="text-[13px] text-on-surface leading-relaxed p-3 bg-surface border border-outline-variant rounded-lg">
                      {currentIncident.symptoms}
                    </p>
                  </div>
                </div>

                {/* Arrow indicator for desktop */}
                <div className="hidden md:flex absolute top-1/2 -right-[15px] w-[30px] h-[30px] bg-surface border border-outline-variant rounded-full items-center justify-center z-10 shadow-lg">
                  <ArrowRightLeft className="w-4 h-4 text-on-surface-variant" />
                </div>
              </div>

              {/* Historical Incident */}
              <div className="p-6 bg-primary/5 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Database className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Hindsight Memory</span>
                  </div>
                  <span className="font-mono text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/30">{inc.id}</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] text-primary font-semibold uppercase tracking-wider mb-1 block flex items-center gap-1">
                      <GitCommit className="w-3 h-3" /> Root Cause Match
                    </span>
                    <p className="text-[13px] text-on-surface leading-relaxed p-3 bg-surface-container border border-primary/20 rounded-lg">
                      {inc.root_cause}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider mb-1 block flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Historical Resolution Applied
                    </span>
                    <p className="text-[13px] text-on-surface leading-relaxed p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      {inc.resolution}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        ))}

        {!loading && incidents.length === 0 && (
          <div className="text-on-surface-variant p-4">No similar incidents found in Hindsight memory.</div>
        )}
      </div>
    </div>
  )
}
