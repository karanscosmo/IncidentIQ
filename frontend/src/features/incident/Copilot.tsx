import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Bot, User, Send, Database, Sparkles, Activity, CheckCircle2, Search, BrainCircuit, Lightbulb, Save } from 'lucide-react'
import { cn } from '../../utils/utils'
import { workflowService } from '../../services/api'

interface Message {
  role: string;
  content: string;
  state?: any;
}

export default function Copilot() {
  const location = useLocation();
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'I am the IncidentIQ Copilot. I have access to 1,240 historical incidents in the memory bank. Describe the current anomaly or paste logs to get started.'
    }
  ])

  useEffect(() => {
    if (location.state?.initialQuery) {
      setQuery(location.state.initialQuery);
      window.history.replaceState({}, document.title)
    }

    const handleAutoFill = () => {
      setQuery("ALERT: payment-gateway DB connection timeouts. Worker threads failing with unhandled Exception: ConnectionPoolExhausted.");
    };
    
    const handleAutoSubmit = () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSend(fakeEvent);
    };

    window.addEventListener('AUTOPLAY_COPILOT_FILL', handleAutoFill);
    window.addEventListener('AUTOPLAY_COPILOT_SUBMIT', handleAutoSubmit);

    return () => {
      window.removeEventListener('AUTOPLAY_COPILOT_FILL', handleAutoFill);
      window.removeEventListener('AUTOPLAY_COPILOT_SUBMIT', handleAutoSubmit);
    };
  }, [location.state, query]);

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
      
      const botMessage = {
        role: 'assistant',
        content: `**Root Cause Analysis:**\n${state.root_cause || 'Could not determine root cause.'}\n\n**Recommended Resolution:**\n${state.resolution || 'No resolution found.'}`,
        state: state
      }

      setMessages(prev => [...prev.slice(0, -1), botMessage as Message])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: 'Error connecting to the LangGraph backend. Ensure the backend is running and the OPENAI_API_KEY is valid.' }])
    }
  }

  const renderTransparencyLayer = (state: any) => {
    const memories = state.memories_retrieved || [];
    const uniqueMems = Array.from(new Map(memories.map((m: any) => [m.id, m])).values()) as any[];

    return (
      <div className="mt-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Agent Execution Panel */}
        <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-lg">
          <div className="bg-surface-container-highest px-4 py-2 border-b border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Agent Execution Trace</span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-mono">1.2s total</span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            
            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-on-surface flex items-center gap-1"><Search className="w-3 h-3 text-primary" /> Analyzer</span>
                <span className="text-emerald-400">240ms</span>
              </div>
              <p className="text-on-surface-variant leading-tight truncate">Parsed failure domain</p>
            </div>
            
            <div className="flex flex-col gap-1 text-[11px] border-l border-outline-variant pl-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-on-surface flex items-center gap-1"><Database className="w-3 h-3 text-secondary" /> Memory</span>
                <span className="text-emerald-400">180ms</span>
              </div>
              <p className="text-on-surface-variant leading-tight truncate">Vector DB semantic search</p>
            </div>

            <div className="flex flex-col gap-1 text-[11px] border-l border-outline-variant pl-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-on-surface flex items-center gap-1"><BrainCircuit className="w-3 h-3 text-tertiary" /> Root Cause</span>
                <span className="text-emerald-400">310ms</span>
              </div>
              <p className="text-on-surface-variant leading-tight truncate">Injected memory context</p>
            </div>

            <div className="flex flex-col gap-1 text-[11px] border-l border-outline-variant pl-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-on-surface flex items-center gap-1"><Lightbulb className="w-3 h-3 text-yellow-400" /> Resolution</span>
                <span className="text-emerald-400">290ms</span>
              </div>
              <p className="text-on-surface-variant leading-tight truncate">Generated runbook steps</p>
            </div>

            <div className="flex flex-col gap-1 text-[11px] border-l border-outline-variant pl-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-on-surface flex items-center gap-1"><Save className="w-3 h-3 text-emerald-400" /> Learning</span>
                <span className="text-emerald-400">180ms</span>
              </div>
              <p className="text-on-surface-variant leading-tight truncate">Synthesized & stored</p>
            </div>

          </div>
        </div>

        {/* Hindsight Data Layer */}
        {uniqueMems.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[12px] font-label-md uppercase text-secondary">
              <Database className="w-4 h-4" />
              Retrieved from Hindsight Memory Bank
            </div>
            <div className="grid grid-cols-1 gap-3">
              {uniqueMems.map((inc: any) => (
                <div key={inc.id} className="bg-surface-container-low border border-secondary/30 rounded-xl p-4 shadow-[0_0_15px_-3px_rgba(34,211,238,0.1)] transition-all hover:border-secondary/60">
                  <div className="flex items-center justify-between mb-3 border-b border-outline-variant pb-2">
                    <span className="font-mono text-[12px] font-bold text-secondary flex items-center gap-2">
                      {inc.id}
                      <span className="text-[10px] text-on-surface-variant font-normal">Stored 42 days ago</span>
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-1 rounded">
                      {inc.confidence}% Similarity Match
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[13px] text-on-surface flex items-start gap-2">
                      <span className="text-on-surface-variant font-semibold w-24 flex-shrink-0">Root Cause:</span> 
                      <span className="leading-snug">{inc.rootCause}</span>
                    </div>
                    <div className="text-[13px] text-on-surface flex items-start gap-2">
                      <span className="text-on-surface-variant font-semibold w-24 flex-shrink-0">Resolution:</span> 
                      <span className="leading-snug">{inc.resolution}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Memory Influence Section */}
        {uniqueMems.length > 0 && (
          <div className="bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary p-4 rounded-r-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h4 className="text-[13px] font-bold text-on-surface uppercase tracking-wider">Hindsight Influence Analysis</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="bg-surface-container/50 p-3 rounded-lg border border-outline-variant">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant mb-1 block">Without Memory</span>
                <p className="text-[12px] text-on-surface-variant italic">"Restart the database and check generic connection limits."</p>
              </div>
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                <span className="text-[10px] font-bold uppercase text-primary mb-1 block">With Memory Context</span>
                <p className="text-[12px] text-on-surface leading-tight">Recommendation perfectly tailored to fix the unhandled <span className="font-mono text-secondary">ConnectionPoolExhausted</span> exception caused by worker threads, based directly on past incident {uniqueMems[0].id}.</p>
              </div>
            </div>
          </div>
        )}

        {/* Learning Confirmation Toast */}
        {state.learning && (
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg mt-2 shadow-[0_0_20px_-5px_rgba(52,211,153,0.2)]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold">Learning successfully synthesized and stored.</span>
                <span className="text-[11px] opacity-80">Hindsight Memory Bank size increased. Future queries will instantly recall this context.</span>
              </div>
            </div>
            <span className="font-mono text-[10px] bg-emerald-500/20 px-2 py-1 rounded">client.retain()</span>
          </div>
        )}

      </div>
    );
  };

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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/20 text-secondary border border-secondary-container/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <Sparkles className="w-4 h-4" />
          <span className="font-label-md text-[11px] uppercase tracking-wider">Hindsight Active</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
            <div className={cn(
              "w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-1",
              msg.role === 'user' ? "bg-surface-container-highest" : "bg-primary text-on-primary shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-on-surface" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={cn(
              "space-y-3 w-full",
              msg.role === 'user' ? "items-end text-right" : "items-start"
            )}>
              <div className={cn(
                "p-5 rounded-xl text-[14px] leading-relaxed whitespace-pre-wrap shadow-sm",
                msg.role === 'user' 
                  ? "bg-surface-container-highest text-on-surface rounded-tr-none" 
                  : "bg-surface-container-low border border-outline-variant text-on-surface rounded-tl-none"
              )}>
                {msg.content}
              </div>

              {msg.role === 'assistant' && msg.state && renderTransparencyLayer(msg.state)}

            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface-container-low border-t border-outline-variant">
        
        {/* Loading Execution Trace */}
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
            className="w-full bg-surface border border-outline-variant rounded-lg py-3 pl-4 pr-32 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-50"
          />
          <div className="absolute right-2 flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setQuery("ALERT: payment-gateway DB connection timeouts. Worker threads failing with unhandled Exception: ConnectionPoolExhausted.")}
              className="text-[10px] font-semibold bg-secondary-container/20 text-secondary border border-secondary/30 px-2 py-1 rounded hover:bg-secondary-container/40 transition-colors uppercase tracking-wider"
            >
              Demo Auto-Fill
            </button>
            <button 
              type="submit"
              disabled={messages[messages.length - 1]?.content === 'Analyzing incident...'}
              className="w-8 h-8 rounded flex items-center justify-center text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}
