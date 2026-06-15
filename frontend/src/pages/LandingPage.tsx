import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, BrainCircuit, Activity } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center font-display">
      
      {/* 3D Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700" />
      <div className="absolute top-[20%] right-[20%] w-[20vw] h-[20vw] bg-tertiary/20 rounded-full blur-[90px] mix-blend-screen animate-pulse delay-1000" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none mask-image-radial" style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }} />

      <main className="relative z-10 text-center max-w-5xl mx-auto px-6 py-24 flex flex-col items-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 text-primary-fixed mb-8 backdrop-blur-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-default">
          <BrainCircuit className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wide">AI-Powered SRE Copilot</span>
        </div>

        {/* Hero Text */}
        <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter leading-tight bg-gradient-to-br from-on-surface via-primary to-secondary bg-clip-text text-transparent drop-shadow-2xl">
          The System That <br className="hidden md:block" />
          <span className="italic font-serif">Never Forgets</span> A Failure.
        </h1>
        
        <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mb-12 leading-relaxed font-light">
          IncidentIQ combines agentic workflows with persistent vector memory to dramatically reduce Mean Time to Resolution and prevent repeat outages.
        </p>

        {/* CTA Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-background bg-primary hover:bg-primary-fixed transition-all duration-300 rounded-full shadow-[0_0_40px_rgba(192,193,255,0.4)] hover:shadow-[0_0_60px_rgba(192,193,255,0.6)] hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span>Launch Platform</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Floating 3D Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full perspective-1000">
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
      </main>

    </div>
  );
}
