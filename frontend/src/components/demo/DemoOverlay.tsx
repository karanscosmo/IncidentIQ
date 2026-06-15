import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlayCircle, X, Loader2 } from 'lucide-react';

export default function DemoOverlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [currentAction, setCurrentAction] = useState('Initializing Demo Sequence...');
  const sequenceRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const demoMode = localStorage.getItem('demoMode');
    if (demoMode === 'true') {
      setIsActive(true);
      startSequence();
    }
    return () => clearSequence();
  }, [location.pathname === '/' ? location : null]); // only re-trigger if on landing

  const clearSequence = () => {
    sequenceRef.current.forEach(clearTimeout);
    sequenceRef.current = [];
  };

  const startSequence = () => {
    clearSequence();
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const schedule = (ms: number, actionStr: string, fn: () => void) => {
      const t = setTimeout(() => {
        setCurrentAction(actionStr);
        fn();
      }, ms);
      timeouts.push(t);
    };

    // [0:00] Dashboard View
    schedule(0, 'Viewing Dashboard Metrics...', () => navigate('/dashboard'));
    
    // [0:03] Deployment Risk
    schedule(3000, 'Navigating to Deployment Risk Predictor...', () => navigate('/risk'));
    
    // [0:05] Auto-fill Risk
    schedule(5000, 'Populating PR diff and service details...', () => window.dispatchEvent(new CustomEvent('AUTOPLAY_RISK_FILL')));
    
    // [0:06] Analyze Risk
    schedule(6000, 'Analyzing risk against memory bank...', () => window.dispatchEvent(new CustomEvent('AUTOPLAY_RISK_SUBMIT')));
    
    // [0:10] Incident Copilot
    schedule(10000, 'Anomaly Detected! Opening Incident Copilot...', () => navigate('/copilot'));
    
    // [0:12] Auto-fill Copilot
    schedule(12000, 'Pasting anomaly logs...', () => window.dispatchEvent(new CustomEvent('AUTOPLAY_COPILOT_FILL')));
    
    // [0:13] Resolve Incident
    schedule(13000, 'Agent generating root cause & resolution...', () => window.dispatchEvent(new CustomEvent('AUTOPLAY_COPILOT_SUBMIT')));
    
    // [0:20] Similar Incidents
    schedule(20000, 'Viewing mathematically correlated past incidents...', () => navigate('/similar'));
    
    // [0:23] Memory Explorer
    schedule(23000, 'Exploring Vector DB Knowledge Graph...', () => navigate('/memory'));
    
    // [0:26] Postmortems
    schedule(26000, 'Reviewing Auto-generated Postmortem...', () => navigate('/postmortems'));
    
    // [0:30] End
    schedule(30000, 'Demo Complete!', () => {
      setTimeout(() => closeDemo(), 2000);
    });

    sequenceRef.current = timeouts;
  };

  const closeDemo = () => {
    clearSequence();
    setIsActive(false);
    localStorage.removeItem('demoMode');
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-full max-w-lg px-4 animate-in slide-in-from-bottom-10 fade-in duration-500 pointer-events-none">
      <div className="bg-surface/90 backdrop-blur-xl border border-primary/50 shadow-[0_0_50px_rgba(99,102,241,0.3)] rounded-full px-6 py-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <PlayCircle className="w-5 h-5 text-on-primary" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
              Autoplay Recording Mode
            </h3>
            <p className="text-xs text-primary font-medium flex items-center gap-1.5 mt-0.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              {currentAction}
            </p>
          </div>
        </div>
        <button onClick={closeDemo} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors group">
          <X className="w-5 h-5 group-hover:text-error" />
        </button>
      </div>
    </div>
  );
}
