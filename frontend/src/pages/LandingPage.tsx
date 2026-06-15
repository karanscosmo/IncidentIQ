import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, BrainCircuit, Activity, Server, Zap, Database, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center font-display">
      
      {/* 3D Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700" />
      <div className="absolute top-[20%] right-[20%] w-[20vw] h-[20vw] bg-tertiary/20 rounded-full blur-[90px] mix-blend-screen animate-pulse delay-1000" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none mask-image-radial" style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }} />

      <main className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center mt-12 mb-32 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 text-primary-fixed mb-8 backdrop-blur-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-default">
            <BrainCircuit className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">AI-Powered SRE Copilot</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter leading-tight bg-gradient-to-br from-on-surface via-primary to-secondary bg-clip-text text-transparent drop-shadow-2xl">
            The System That <br className="hidden md:block" />
            <span className="italic font-serif">Never Forgets</span> A Failure.
          </h1>
          
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mb-12 leading-relaxed font-light">
            IncidentIQ combines agentic workflows with persistent vector memory to dramatically reduce Mean Time to Resolution and prevent repeat outages.
          </p>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-background bg-primary hover:bg-primary-fixed transition-all duration-300 rounded-full shadow-[0_0_40px_rgba(192,193,255,0.4)] hover:shadow-[0_0_60px_rgba(192,193,255,0.6)] hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span>Launch Platform</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => navigate('/incident-copilot')}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-secondary bg-secondary-container/20 border border-secondary/30 hover:bg-secondary-container/40 transition-all duration-300 rounded-full hover:-translate-y-1"
            >
              <Activity className="w-5 h-5" />
              <span>Interactive Demo</span>
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full perspective-1000 mb-40">
          {[
            { icon: ShieldAlert, title: "Risk Prediction", desc: "Analyze PRs against past outages" },
            { icon: Activity, title: "Live Resolution", desc: "Auto-correlate active anomalies" },
            { icon: BrainCircuit, title: "Hindsight Memory", desc: "Persistent vector knowledge base" }
          ].map((feature, i) => (
            <div 
              key={i}
              className="glass-panel p-8 rounded-2xl border border-outline-variant/30 text-left hover:-translate-y-2 hover:rotate-y-12 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 ease-out transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center mb-6 border border-primary/20 text-primary transform translate-z-10">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-2 transform translate-z-10">{feature.title}</h3>
              <p className="text-on-surface-variant leading-relaxed transform translate-z-10">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Architecture Section */}
        <div className="w-full text-center mb-40">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-on-surface">LangGraph + Hindsight Architecture</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-16">
            IncidentIQ orchestrates specialized AI agents through a state machine, constantly retrieving and writing to a persistent semantic memory bank.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="glass-panel p-6 rounded-xl border border-outline-variant text-center flex flex-col items-center">
              <Server className="w-10 h-10 text-error mb-4" />
              <h4 className="font-semibold text-lg mb-2 text-on-surface">1. Telemetry Alert</h4>
              <p className="text-sm text-on-surface-variant">System detects an anomaly or a developer pushes a risky PR.</p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl border border-primary/50 text-center flex flex-col items-center shadow-[0_0_30px_rgba(192,193,255,0.1)]">
              <Database className="w-10 h-10 text-primary mb-4" />
              <h4 className="font-semibold text-lg mb-2 text-on-surface">2. Semantic Retrieval</h4>
              <p className="text-sm text-on-surface-variant">Hindsight DB retrieves the closest mathematical matches of past incidents.</p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-secondary/50 text-center flex flex-col items-center shadow-[0_0_30px_rgba(202,193,255,0.1)]">
              <Zap className="w-10 h-10 text-secondary mb-4" />
              <h4 className="font-semibold text-lg mb-2 text-on-surface">3. Agent Execution</h4>
              <p className="text-sm text-on-surface-variant">LangGraph orchestrates Root Cause, Resolution, and Postmortem nodes.</p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-emerald-500/50 text-center flex flex-col items-center shadow-[0_0_30px_rgba(52,211,153,0.1)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-4" />
              <h4 className="font-semibold text-lg mb-2 text-on-surface">4. Memory Ingestion</h4>
              <p className="text-sm text-on-surface-variant">The newly resolved incident is vectorized and stored for future use.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="w-full glass-panel border border-primary/20 rounded-3xl p-12 text-center relative overflow-hidden bg-gradient-to-br from-primary-container/10 to-transparent">
          <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] bg-primary/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
          <h2 className="text-4xl font-bold mb-6 text-on-surface">Ready to upgrade your incident response?</h2>
          <p className="text-xl text-on-surface-variant mb-8 max-w-xl mx-auto">
            Stop losing institutional knowledge. Let AI document your failures and predict your next outage.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-on-surface text-surface hover:bg-on-surface-variant transition-colors rounded-full font-semibold text-lg inline-flex items-center gap-2"
          >
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </main>

      <footer className="w-full text-center py-8 text-on-surface-variant border-t border-outline-variant/30 mt-20 relative z-10">
        <p className="text-sm font-medium">Built with Hindsight Cloud & LangGraph</p>
      </footer>
    </div>
  );
}
