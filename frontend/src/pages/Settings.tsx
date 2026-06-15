import { Database, Key, Zap } from 'lucide-react'

export default function Settings() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="font-h1 text-h1 text-on-surface mb-1">Settings</h2>
        <p className="text-on-surface-variant font-body-md">Configure Hindsight Memory integration and agent behavior.</p>
      </div>

      <div className="space-y-6">
        
        {/* Memory Bank Config */}
        <section className="glass-panel p-6 rounded-xl border border-outline-variant space-y-6">
          <div className="flex items-center gap-2 border-b border-outline-variant pb-4">
            <Database className="w-5 h-5 text-primary" />
            <h3 className="font-h3 text-h3 text-on-surface">Hindsight Connection</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-label-md uppercase text-on-surface-variant mb-2">Memory Bank ID</label>
              <input 
                type="text" 
                defaultValue="incidentiq-prod"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-2 px-3 text-body-sm text-on-surface outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-label-md uppercase text-on-surface-variant mb-2">API Base URL</label>
              <input 
                type="text" 
                defaultValue="https://api.hindsight.cloud"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-2 px-3 text-body-sm text-on-surface-variant cursor-not-allowed"
                disabled
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-label-md uppercase text-on-surface-variant mb-2">Hindsight API Key</label>
              <div className="relative">
                <input 
                  type="password" 
                  defaultValue="************************"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-2 px-3 text-body-sm text-on-surface outline-none"
                />
                <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              </div>
            </div>
          </div>
        </section>

        {/* Agent Config */}
        <section className="glass-panel p-6 rounded-xl border border-outline-variant space-y-6">
          <div className="flex items-center gap-2 border-b border-outline-variant pb-4">
            <Zap className="w-5 h-5 text-tertiary" />
            <h3 className="font-h3 text-h3 text-on-surface">LangGraph Agents</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant">
              <div>
                <p className="font-semibold text-[14px] text-on-surface">Auto-Ingest Resolved Incidents</p>
                <p className="text-[12px] text-on-surface-variant">Learning Agent automatically writes to Hindsight memory bank on resolution.</p>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-on-primary rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant">
              <div>
                <p className="font-semibold text-[14px] text-on-surface">Require Manual Approval for Postmortems</p>
                <p className="text-[12px] text-on-surface-variant">Postmortem Agent waits for human-in-the-loop validation.</p>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-on-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
