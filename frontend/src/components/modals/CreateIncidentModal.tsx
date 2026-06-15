import { useState } from 'react';
import { X, Send, Activity, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateIncidentModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    
    // In a real app we would POST this to the backend.
    // For the demo, we just navigate to Copilot and auto-fill it by using state.
    onClose();
    // We can pass the description in navigation state to auto-fill the copilot input
    navigate('/copilot', { state: { initialQuery: description } });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-surface border border-outline-variant rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-error-container/20 flex items-center justify-center border border-error/30">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-on-surface">Declare New Incident</h2>
              <p className="text-xs text-on-surface-variant">Manually report an anomaly to the AI Copilot.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                setService('payment-gateway');
                setDescription('ALERT: payment-gateway DB connection timeouts. Worker threads failing with unhandled Exception: ConnectionPoolExhausted.');
              }}
              className="text-[10px] font-semibold bg-secondary-container/20 text-secondary border border-secondary/30 px-3 py-1.5 rounded-full hover:bg-secondary-container/40 transition-colors uppercase tracking-wider flex items-center gap-2"
            >
              <Activity className="w-3.5 h-3.5" />
              Auto-fill Demo Alert
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-label-md uppercase text-on-surface-variant mb-2">Impacted Service</label>
            <input 
              type="text" 
              value={service}
              onChange={e => setService(e.target.value)}
              placeholder="e.g. auth-service"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-2.5 px-3 text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-label-md uppercase text-on-surface-variant mb-2">Incident Description / Logs</label>
            <textarea 
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the issue or paste the failing logs..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-2.5 px-3 text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 bg-surface-container text-on-surface rounded-lg font-label-md text-sm hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2.5 bg-error text-on-error rounded-lg font-label-md text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
              Report Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
