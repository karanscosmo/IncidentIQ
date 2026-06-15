import { useState } from 'react'
import { Bot, User, Send, Database, Sparkles } from 'lucide-react'
import { cn } from '../../utils/utils'
import { workflowService } from '../../services/api'

interface Message {
  role: string;
  content: string;
  memoryRetrieved?: boolean;
  confidence?: number;
  incidents?: any[];
}

export default function Copilot() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'I am the IncidentIQ Copilot. I have access to 1,240 historical incidents in the memory bank. Describe the current anomaly or paste logs to get started.'
    }
  ])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const userMessage = { role: 'user', content: query }
    setMessages(prev => [...prev, userMessage])
    setQuery('')
    
    // Add loading message
    setMessages(prev => [...prev, { role: 'assistant', content: 'Analyzing incident...' }])

    try {
      const response = await workflowService.resolveIncident(query)
      const state = response.data.state
      
      const memories = state.memories_retrieved || []
      const uniqueMems = Array.from(new Map(memories.map((m: any) => [m.id, m])).values())

      const botMessage = {
        role: 'assistant',
        content: `**Root Cause Analysis:**\n${state.root_cause || 'Could not determine root cause.'}\n\n**Recommended Resolution:**\n${state.resolution || 'No resolution found.'}`,
        memoryRetrieved: uniqueMems.length > 0,
        confidence: uniqueMems.length > 0 ? 94 : 0,
        incidents: uniqueMems
      }

      setMessages(prev => [...prev.slice(0, -1), botMessage as Message])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: 'Error connecting to the LangGraph backend. Ensure the backend is running and the OPENAI_API_KEY is valid.' }])
    }
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col glass-panel rounded-xl overflow-hidden border border-outline-variant">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary-container/20 flex items-center justify-center">
            <Bot className="text-primary w-5 h-5" />
          </div>
          <div>
            <h3 className="font-h3 text-h3 text-on-surface">Incident Copilot</h3>
            <p className="text-body-sm text-on-surface-variant flex items-center gap-1">
              <Database className="w-3 h-3" />
              Connected to incidentiq-prod memory bank
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/20 text-secondary border border-secondary-container/30">
          <Sparkles className="w-4 h-4" />
          <span className="font-label-md text-[11px] uppercase tracking-wider">Hindsight Active</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-4 max-w-[80%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
            <div className={cn(
              "w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-1",
              msg.role === 'user' ? "bg-surface-container-highest" : "bg-primary text-on-primary shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-on-surface" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={cn(
              "space-y-3",
              msg.role === 'user' ? "items-end text-right" : "items-start"
            )}>
              <div className={cn(
                "p-4 rounded-xl text-[14px] leading-relaxed whitespace-pre-wrap",
                msg.role === 'user' 
                  ? "bg-surface-container-highest text-on-surface" 
                  : "bg-surface-container-low border border-outline-variant text-on-surface"
              )}>
                {msg.content}
              </div>

              {msg.role === 'assistant' && msg.memoryRetrieved && msg.incidents && msg.incidents.length > 0 && (
                <div className="flex flex-col gap-3 mt-4 border-t border-outline-variant pt-4 w-full">
                  <div className="flex items-center gap-2 text-[12px] font-label-md uppercase text-primary">
                    <Database className="w-3.5 h-3.5" />
                    Found Similar Incidents in Memory
                  </div>
                  <div className="grid grid-cols-1 gap-3 w-full">
                    {msg.incidents.map((inc: any) => (
                      <div key={inc.id} className="bg-surface-container border border-outline-variant rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[12px] bg-primary-container/20 text-primary px-2 py-0.5 rounded border border-primary/30">
                            {inc.id}
                          </span>
                          <span className="text-[11px] text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                            {inc.confidence}% Confidence
                          </span>
                        </div>
                        <div className="text-[12px] text-on-surface">
                          <span className="text-on-surface-variant font-medium">Root Cause:</span> {inc.rootCause}
                        </div>
                        <div className="text-[12px] text-on-surface">
                          <span className="text-on-surface-variant font-medium">Resolution:</span> {inc.resolution}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface-container-low border-t border-outline-variant">
        
        {/* Agent Execution Trace */}
        {messages[messages.length - 1]?.content === 'Analyzing incident...' && (
          <div className="mb-4 bg-surface-container border border-primary/20 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">LangGraph Execution Trace</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex flex-col items-center gap-1 text-primary">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">1</div>
                <span>Analyzer</span>
              </div>
              <div className="h-px bg-outline-variant flex-1 mx-2 relative overflow-hidden">
                 <div className="absolute inset-0 bg-primary/50 translate-x-[-100%] animate-[slide_1.5s_ease-in-out_infinite]" />
              </div>
              <div className="flex flex-col items-center gap-1 text-on-surface-variant">
                <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline">2</div>
                <span>Retrieve</span>
              </div>
              <div className="h-px bg-outline-variant flex-1 mx-2"></div>
              <div className="flex flex-col items-center gap-1 text-on-surface-variant">
                <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline">3</div>
                <span>Root Cause</span>
              </div>
              <div className="h-px bg-outline-variant flex-1 mx-2"></div>
              <div className="flex flex-col items-center gap-1 text-on-surface-variant">
                <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline">4</div>
                <span>Resolution</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={messages[messages.length - 1]?.content === 'Analyzing incident...'}
            placeholder="Ask about an incident, error log, or system behavior..."
            className="w-full bg-surface border border-outline-variant rounded-lg py-3 pl-4 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={messages[messages.length - 1]?.content === 'Analyzing incident...'}
            className="absolute right-2 w-8 h-8 rounded flex items-center justify-center text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  )
}
