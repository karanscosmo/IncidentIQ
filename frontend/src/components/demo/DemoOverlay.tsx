import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlayCircle, ArrowRight, X, Sparkles } from 'lucide-react';

export default function DemoOverlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Check if demo was launched
    const demoMode = localStorage.getItem('demoMode');
    if (demoMode === 'true') {
      setIsActive(true);
    }
  }, [location]);

  const closeDemo = () => {
    setIsActive(false);
    localStorage.removeItem('demoMode');
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-surface/90 backdrop-blur-xl border border-primary/30 shadow-[0_0_50px_rgba(99,102,241,0.2)] rounded-2xl p-6 flex flex-col gap-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
              <PlayCircle className="w-5 h-5 text-on-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                IncidentIQ Interactive Demo
                <span className="bg-secondary/20 text-secondary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Live</span>
              </h3>
              <p className="text-sm text-on-surface-variant">Follow the guided tour to see how the platform works end-to-end.</p>
            </div>
          </div>
          <button onClick={closeDemo} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 mt-2">
          
          {/* Step 1 */}
          <div className={`flex-1 flex flex-col items-center p-3 rounded-xl border transition-all ${step === 1 ? 'border-primary bg-primary/10' : 'border-outline-variant opacity-50'}`}>
            <span className="text-[10px] uppercase font-bold text-primary mb-1">Step 1</span>
            <span className="text-sm font-semibold text-center mb-3">Pre-deployment Risk</span>
            <button 
              onClick={() => {
                setStep(2);
                navigate('/risk');
              }}
              className="w-full py-1.5 bg-primary text-on-primary text-xs rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Start Pipeline Check
            </button>
          </div>

          <ArrowRight className="w-5 h-5 text-outline-variant flex-shrink-0" />

          {/* Step 2 */}
          <div className={`flex-1 flex flex-col items-center p-3 rounded-xl border transition-all ${step === 2 ? 'border-error bg-error/10' : 'border-outline-variant opacity-50'}`}>
            <span className="text-[10px] uppercase font-bold text-error mb-1">Step 2</span>
            <span className="text-sm font-semibold text-center mb-3">Live Anomaly</span>
            <button 
              onClick={() => {
                setStep(3);
                navigate('/dashboard');
              }}
              className="w-full py-1.5 bg-error text-on-error text-xs rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Trigger Alert
            </button>
          </div>

          <ArrowRight className="w-5 h-5 text-outline-variant flex-shrink-0" />

          {/* Step 3 */}
          <div className={`flex-1 flex flex-col items-center p-3 rounded-xl border transition-all ${step === 3 ? 'border-secondary bg-secondary/10' : 'border-outline-variant opacity-50'}`}>
            <span className="text-[10px] uppercase font-bold text-secondary mb-1">Step 3</span>
            <span className="text-sm font-semibold text-center mb-3">AI Resolution</span>
            <button 
              onClick={() => {
                setStep(1);
                navigate('/copilot', { state: { initialQuery: 'ALERT: payment-gateway DB connection timeouts. Worker threads failing with unhandled Exception: ConnectionPoolExhausted.' }});
              }}
              className="w-full py-1.5 bg-secondary text-background text-xs rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Auto-Resolve
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
