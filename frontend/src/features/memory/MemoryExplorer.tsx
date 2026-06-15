import { useState, useEffect } from 'react'
import { Database, Search, Filter, ArrowRight, BrainCircuit, X, Activity, Server, Clock, Code, AlertTriangle, Lightbulb } from 'lucide-react'
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
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)

  const fetchMemories = async (searchQuery: string) => {
    setLoading(true)
    try {
      const q = searchQuery.trim() || 'incident'
      const response = await incidentService.search(q, 10)
      setMemories(response.data.results)
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
    <div className="space-y-6 relative h-[calc(100vh-140px)] overflow-y-auto overflow-x-hidden p-2">
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
          <div className="w-10 h-10 rounded bg-secondary-container/20 flex items-center justify-center border border-secondary/30">
            <BrainCircuit className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-emerald-400">Connected</p>
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant">Hindsight SDK v1.2</p>
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
              <tr 
                key={mem.id} 
                className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                onClick={() => setSelectedMemory(mem)}
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-[12px] bg-primary/10 border border-primary/20 px-2 py-1 rounded text-primary group-hover:bg-primary/20 transition-colors">{mem.id}</span>
                </td>
                <td className="px-6 py-4 text-[13px] font-medium text-on-surface">
                  {mem.title}
                </td>
                <td className="px-6 py-4 text-[12px] text-on-surface-variant max-w-[200px] truncate">
                  {mem.root_cause}
                </td>
                <td className="px-6 py-4 text-[12px] text-on-surface-variant max-w-[200px] truncate">
                  {mem.resolution}
                </td>
                <td className="px-6 py-4 text-[12px] font-bold text-emerald-400">
                  {mem.similarity}
                </td>
                <td className="px-6 py-4 text-[12px] text-on-surface-variant">
                  {mem.date}
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
            {memories.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                  No memories found. The knowledge base might be empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Memory Detail Drawer Overlay */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-background/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedMemory(null)}
          ></div>
          <div className="relative w-[600px] bg-surface border-l border-outline-variant shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-mono text-lg font-bold text-on-surface flex items-center gap-2">
                    {selectedMemory.id}
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider font-sans">
                      {selectedMemory.similarity} Match
                    </span>
                  </h3>
                  <p className="text-sm text-on-surface-variant">{selectedMemory.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMemory(null)}
                className="p-2 hover:bg-surface-container rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface">
              
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant">
                  <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs uppercase font-bold tracking-wider">Stored At</span>
                  </div>
                  <p className="text-sm text-on-surface font-medium">{selectedMemory.date}</p>
                </div>
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant">
                  <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs uppercase font-bold tracking-wider">Impact Level</span>
                  </div>
                  <p className="text-sm text-error font-bold">{selectedMemory.impact}</p>
                </div>
              </div>

              {/* Core Incident Data */}
              <div className="space-y-4">
                
                <div className="bg-error/5 border border-error/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-error mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="text-sm font-bold uppercase tracking-wider">Symptoms / Issue</h4>
                  </div>
                  <p className="text-sm text-on-surface leading-relaxed">
                    System alarms triggered for high error rates. The symptoms matched historical anomalies related to connection pooling and thread starvation.
                  </p>
                </div>

                <div className="bg-secondary-container/10 border border-secondary/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-secondary mb-2">
                    <Server className="w-4 h-4" />
                    <h4 className="text-sm font-bold uppercase tracking-wider">Root Cause</h4>
                  </div>
                  <p className="text-sm text-on-surface leading-relaxed">
                    {selectedMemory.root_cause}
                  </p>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Lightbulb className="w-4 h-4" />
                    <h4 className="text-sm font-bold uppercase tracking-wider">Resolution & Learning</h4>
                  </div>
                  <p className="text-sm text-on-surface leading-relaxed">
                    {selectedMemory.resolution}
                  </p>
                </div>
              </div>

              {/* Raw Memory View */}
              <div className="mt-8">
                <div className="flex items-center gap-2 text-on-surface-variant mb-3">
                  <Code className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Raw Vector DB Document</h4>
                </div>
                <pre className="bg-[#0d1117] border border-outline-variant p-4 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto">
{JSON.stringify({
  id: selectedMemory.id,
  metadata: {
    source: "postmortem_agent",
    timestamp: selectedMemory.date,
    vector_dims: 1536,
    confidence_score: selectedMemory.similarity,
    category: "infrastructure",
    impact: selectedMemory.impact
  },
  pageContent: `Root Cause: ${selectedMemory.root_cause}\nResolution: ${selectedMemory.resolution}`
}, null, 2)}
                </pre>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
