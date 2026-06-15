import { FileText, Download, Clock } from 'lucide-react'

export default function Postmortems() {
  const postmortems = [
    {
      id: 'PM-1035',
      incident: 'INC-1035',
      title: 'Database Deadlock Event',
      date: 'Generated 2 hours ago',
      author: 'AI Agent (Postmortem)',
      status: 'Review Pending'
    },
    {
      id: 'PM-882',
      incident: 'INC-882',
      title: 'Redis Out of Memory Outage',
      date: 'Jan 13, 2024',
      author: 'Alex Rivera',
      status: 'Approved'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface mb-1">Postmortems</h2>
          <p className="text-on-surface-variant font-body-md">Auto-generated blameless postmortems powered by memory context.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md flex items-center gap-2 hover:opacity-90 transition-all">
          <FileText className="w-4 h-4" />
          Generate New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {postmortems.map(pm => (
          <div key={pm.id} className="glass-panel p-6 rounded-xl border border-outline-variant flex flex-col hover:-translate-y-1 transition-transform cursor-pointer">
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
    </div>
  )
}
