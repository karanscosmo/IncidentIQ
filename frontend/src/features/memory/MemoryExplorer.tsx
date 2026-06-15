import { useState, useEffect } from 'react'
import { Database, Search, Filter, ArrowRight, BrainCircuit } from 'lucide-react'
import { incidentService } from '../../services/api'

interface Memory {
  id: string;
  type: string;
  title: string;
  root_cause: string;
  resolution: string;
  similarity: string;
  date: string;
  size: string;
  impact: string;
}

export default function MemoryExplorer() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchMemories = async (searchQuery: string) => {
    setLoading(true)
    try {
      const q = searchQuery.trim() || 'incident'
      const response = await incidentService.search(q, 10)
      
      const parsed = response.data.results.map((res: any, idx: number) => {
        const text = res.text || ''
        const idMatch = text.match(/Incident:\s*([\w-]+)/i)
        const titleMatch = text.match(/Title:\s*(.+)/i)
        const rootCauseMatch = text.match(/Root Cause:\s*(.+)/i)
        const resolutionMatch = text.match(/Resolution:\s*(.+)/i)
        
        return {
          id: idMatch ? idMatch[1] : `MEM-${Math.floor(Math.random()*1000)}`,
          type: 'Incident',
          title: titleMatch ? titleMatch[1] : text.slice(0, 40) + '...',
          root_cause: rootCauseMatch ? rootCauseMatch[1] : 'Unknown',
          resolution: resolutionMatch ? resolutionMatch[1] : 'Unknown',
          similarity: `${99 - (idx * 3)}%`,
          date: new Date().toISOString().split('T')[0],
          size: `${(text.length / 1024).toFixed(1)}kb`,
          impact: text.toLowerCase().includes('oom') || text.toLowerCase().includes('outage') ? 'Critical' : 'High'
        }
      })
      
      setMemories(parsed)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemories('incident')
  }, [])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchMemories(query)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface mb-1">Memory Explorer</h2>
          <p className="text-on-surface-variant font-body-md">Browse and search raw Hindsight embeddings.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-surface-container-low border border-outline-variant rounded-lg flex items-center px-3 py-2 w-64 focus-within:border-primary transition-colors">
            <Search className="w-4 h-4 text-on-surface-variant mr-2" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Semantic search (Press Enter)..." 
              className="bg-transparent border-none outline-none text-body-sm w-full"
            />
          </div>
          <button className="px-3 py-2 bg-surface-container border border-outline-variant rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border-l-2 border-l-primary">
          <div className="w-10 h-10 rounded bg-primary-container/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-h2 font-h2 text-on-surface">{loading ? '...' : memories.length}</p>
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant">Memories Found</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-secondary-container/20 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-h2 font-h2 text-on-surface">34k</p>
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant">Vector Dimensions</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-6 py-3 font-label-md text-[11px] uppercase text-on-surface-variant">Memory ID</th>
              <th className="px-6 py-3 font-label-md text-[11px] uppercase text-on-surface-variant">Title</th>
              <th className="px-6 py-3 font-label-md text-[11px] uppercase text-on-surface-variant">Root Cause</th>
              <th className="px-6 py-3 font-label-md text-[11px] uppercase text-on-surface-variant">Resolution</th>
              <th className="px-6 py-3 font-label-md text-[11px] uppercase text-on-surface-variant">Similarity</th>
              <th className="px-6 py-3 font-label-md text-[11px] uppercase text-on-surface-variant">Timestamp</th>
              <th className="px-6 py-3 font-label-md text-[11px] uppercase text-on-surface-variant">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {memories.map((mem) => (
              <tr key={mem.id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4">
                  <span className="font-mono text-[12px] bg-surface-container px-2 py-1 rounded text-primary">{mem.id}</span>
                </td>
                <td className="px-6 py-4 text-[13px] font-medium text-on-surface">
                  {mem.title}
                </td>
                <td className="px-6 py-4 text-[12px] text-on-surface-variant max-w-xs truncate">
                  {mem.root_cause}
                </td>
                <td className="px-6 py-4 text-[12px] text-on-surface-variant max-w-xs truncate">
                  {mem.resolution}
                </td>
                <td className="px-6 py-4 text-[12px] font-medium text-emerald-400">
                  {mem.similarity}
                </td>
                <td className="px-6 py-4 text-[12px] text-on-surface-variant">
                  {mem.date}
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[12px] font-medium">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
