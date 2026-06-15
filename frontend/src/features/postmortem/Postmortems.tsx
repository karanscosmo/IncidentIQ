import { useState } from 'react'
import { FileText, Download, Clock, Plus, X, Activity } from 'lucide-react'
import { workflowService } from '../../services/api'

interface Postmortem {
  id: string;
  incident: string;
  title: string;
  date: string;
  author: string;
  status: string;
  content?: string;
}

export default function Postmortems() {
  const [postmortems, setPostmortems] = useState<Postmortem[]>([
    {
      id: 'PM-1035',
      incident: 'INC-1035',
      title: 'Database Deadlock Event',
      date: 'Generated 2 hours ago',
      author: 'AI Agent (Postmortem)',
      status: 'Review Pending'
    }
  ])
  
  const [showModal, setShowModal] = useState(false)
  const [incidentText, setIncidentText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [viewPostmortem, setViewPostmortem] = useState<Postmortem | null>(null)

  const handleGenerate = async () => {
    if (!incidentText) return
    setGenerating(true)
    try {
      const response = await workflowService.resolveIncident(incidentText)
      const state = response.data.state
      
      const newPm: Postmortem = {
        id: `PM-${Math.floor(Math.random() * 10000)}`,
        incident: `INC-NEW`,
        title: state.analysis?.substring(0, 40) + '...' || 'New Incident Postmortem',
        date: new Date().toLocaleDateString(),
        author: 'AI Agent',
        status: 'Generated',
        content: state.postmortem
      }
      
      setPostmortems([newPm, ...postmortems])
      setShowModal(false)
      setIncidentText('')
    } catch (err) {
      console.error(err)
      alert("Failed to generate postmortem. Check backend connection.")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface mb-1">Postmortems</h2>
          <p className="text-on-surface-variant font-body-md">Auto-generated blameless postmortems powered by memory context.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md flex items-center gap-2 hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Generate New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {postmortems.map(pm => (
          <div 
            key={pm.id} 
            onClick={() => setViewPostmortem(pm)}
            className="glass-panel p-6 rounded-xl border border-outline-variant flex flex-col hover:-translate-y-1 transition-transform cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <FileText className="text-primary w-5 h-5" />
                <span className="font-mono text-[12px] text-on-surface-variant">{pm.id}</span>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                pm.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-tertiary/10 text-tertiary border border-tertiary/20'
              }`}>
                {pm.status}
              </span>
            </div>
            
            <h3 className="text-[16px] font-semibold text-on-surface mb-2">{pm.title}</h3>
            <p className="text-[12px] text-on-surface-variant flex items-center gap-1 mb-6">
              <Clock className="w-3.5 h-3.5" /> {pm.date}
            </p>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-outline-variant">
              <div className="text-[11px] text-on-surface-variant">
                By: <span className="text-on-surface">{pm.author}</span>
              </div>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-surface glass-panel border border-outline-variant p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-on-surface">Generate Postmortem</h3>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">Paste the incident summary or logs to trigger the LangGraph workflow and generate a complete postmortem.</p>
            <textarea 
              value={incidentText}
              onChange={e => setIncidentText(e.target.value)}
              className="w-full h-32 bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface outline-none focus:border-primary mb-4"
              placeholder="Describe the incident..."
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface"
              >
                Cancel
              </button>
              <button 
                onClick={handleGenerate}
                disabled={generating || !incidentText}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                {generating ? <Activity className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {generating ? 'Running Agents...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewPostmortem && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
         <div className="bg-surface glass-panel border border-outline-variant p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
           <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-4">
             <div>
                <h3 className="text-xl font-bold text-on-surface">{viewPostmortem.title}</h3>
                <p className="text-sm text-on-surface-variant">{viewPostmortem.id} • {viewPostmortem.date}</p>
             </div>
             <button onClick={() => setViewPostmortem(null)} className="text-on-surface-variant hover:text-on-surface">
               <X className="w-6 h-6" />
             </button>
           </div>
           <div className="prose prose-invert max-w-none text-on-surface text-sm whitespace-pre-wrap">
             {viewPostmortem.content || "No content available. This is a historic mock."}
           </div>
         </div>
       </div>
      )}
    </div>
  )
}
