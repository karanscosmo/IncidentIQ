import { useState, useEffect } from 'react'
import { History, ShieldAlert } from 'lucide-react'
import { incidentService } from '../../services/api'

interface Incident {
  id: string;
  title: string;
  similarity: string;
  date: string;
  status: string;
  tags: string[];
  resolution: string;
}

export default function SimilarIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await incidentService.search('incident', 5)
        const parsed = response.data.results.map((res: any, idx: number) => {
          return {
            id: res.id,
            title: res.title,
            similarity: res.similarity,
            date: res.date,
            status: 'Resolved',
            tags: ['System', 'Database', 'Memory'], // Mocked tags since backend doesn't provide them yet
            resolution: res.resolution
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

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="font-h1 text-h1 text-on-surface mb-1">Similar Incidents</h2>
        <p className="text-on-surface-variant font-body-md">AI-correlated historical incidents based on current active alerts.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading && <div className="text-on-surface-variant p-4">Fetching similar incidents from Hindsight...</div>}
        {incidents.map(inc => (
          <div key={inc.id} className="glass-panel p-6 rounded-xl border border-outline-variant flex flex-col md:flex-row gap-6 hover:bg-surface-container-low transition-colors">
            
            <div className="md:w-1/4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] bg-primary-container/20 text-primary px-2 py-1 rounded border border-primary/30">
                  {inc.id}
                </span>
                <span className="text-[12px] text-on-surface-variant">{inc.date}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <History className="w-4 h-4" />
                <span className="font-label-md text-[13px]">{inc.similarity} Match</span>
              </div>
            </div>

            <div className="md:w-2/4 space-y-3">
              <h3 className="text-[16px] font-semibold text-on-surface">{inc.title}</h3>
              <div className="flex gap-2">
                {inc.tags.map(tag => (
                  <span key={tag} className="text-[11px] bg-surface-container border border-outline-variant px-2 py-1 rounded text-on-surface-variant">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:w-1/4 bg-surface-container/50 p-4 rounded-lg border border-outline-variant/50">
              <p className="text-[11px] font-label-md uppercase text-on-surface-variant mb-2 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Historical Resolution
              </p>
              <p className="text-[13px] text-on-surface leading-snug">{inc.resolution}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
