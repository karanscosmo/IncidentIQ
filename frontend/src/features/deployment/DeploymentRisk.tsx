import { useState } from 'react'
import { AlertTriangle, ShieldCheck, Activity, Send, Database } from 'lucide-react'
import { cn } from '../../utils/utils'
import { deploymentService } from '../../services/api'

interface RiskResult {
  risk_score: string;
  confidence: string;
  similar_incidents: string[];
  recommended_precautions: string[];
}

export default function DeploymentRisk() {
  const [service, setService] = useState('')
  const [version, setVersion] = useState('')
  const [changes, setChanges] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<RiskResult | null>(null)

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!service || !changes) return
    
    setAnalyzing(true)
    try {
      const response = await deploymentService.predictRisk(service, version, changes)
      setResult(response.data)
    } catch (error) {
      console.error('Failed to predict risk:', error)
      // Removed mock fallback to strictly comply with "no mock data" rule
      alert((error as any).response?.data?.detail || 'Failed to predict risk. Ensure backend is running and all API keys are valid.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-h1 text-h1 text-on-surface mb-1">Deployment Risk Predictor</h2>
            <p className="text-on-surface-variant font-body-md">Analyze planned changes against historical incident memory.</p>
          </div>
          <button 
            type="button"
            onClick={() => {
              setService('payment-gateway');
              setVersion('v3.2.1-rc.4');
              setChanges('- Bumped postgres driver version\n- Removed explicit connection timeouts in worker threads\n- Updated JWT signing algorithm');
            }}
            className="px-4 py-1.5 bg-secondary-container/20 text-secondary border border-secondary/30 rounded-full text-xs font-semibold hover:bg-secondary-container/40 transition-colors flex items-center gap-2"
          >
            <Activity className="w-3.5 h-3.5" />
            Auto-fill Demo PR
          </button>
        </div>

        <form onSubmit={handlePredict} className="glass-panel p-6 rounded-xl space-y-4 border border-outline-variant">
          <div>
            <label className="block text-[11px] font-label-md uppercase text-on-surface-variant mb-2">Target Service</label>
            <input 
              required
              type="text" 
              value={service}
              onChange={e => setService(e.target.value)}
              placeholder="e.g. auth-service"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-2 px-3 text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-label-md uppercase text-on-surface-variant mb-2">Version / Tag</label>
            <input 
              type="text" 
              value={version}
              onChange={e => setVersion(e.target.value)}
              placeholder="v2.4.0"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-2 px-3 text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-label-md uppercase text-on-surface-variant mb-2">Change Summary (or Paste PR diff)</label>
            <textarea 
              required
              rows={5}
              value={changes}
              onChange={e => setChanges(e.target.value)}
              placeholder="- Updated JWT signing algorithm\n- Bumped postgres driver version\n- Added new /validate endpoint"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-2 px-3 text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none font-mono"
            />
          </div>
          <button 
            type="submit" 
            disabled={analyzing}
            className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-[13px] flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {analyzing ? <Activity className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {analyzing ? 'Analyzing against Memory Bank...' : 'Predict Risk'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-xl border border-outline-variant min-h-[400px] flex flex-col relative overflow-hidden">
          {!result && !analyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant opacity-60">
              <ShieldCheck className="w-12 h-12 mb-4" />
              <p className="font-medium text-[14px]">Enter deployment details to analyze risk.</p>
            </div>
          )}

          {analyzing && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-outline-variant"></div>
                <div className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-spin absolute inset-0"></div>
              </div>
              <p className="text-primary font-medium text-sm animate-pulse">Querying Hindsight Memory Bank...</p>
            </div>
          )}

          {result && !analyzing && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={cn(
                "p-4 rounded-lg flex items-center justify-between border",
                result.risk_score === 'High' ? "bg-error-container/10 border-error text-error" : "bg-emerald-500/10 border-emerald-500 text-emerald-400"
              )}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6" />
                  <div>
                    <p className="text-[11px] font-label-md uppercase tracking-wider opacity-80">Risk Score</p>
                    <p className="text-h2 font-bold">{result.risk_score} Risk</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-label-md uppercase tracking-wider opacity-80">AI Confidence</p>
                  <p className="text-[16px] font-bold">{result.confidence}</p>
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-label-md uppercase text-on-surface-variant mb-3 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  Correlated Past Failures
                </h4>
                <ul className="space-y-2">
                  {result.similar_incidents.map((inc: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm text-on-surface bg-surface-container p-3 rounded border border-outline-variant">
                      <span className="text-error mt-0.5">•</span> {inc}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[12px] font-label-md uppercase text-on-surface-variant mb-3">Recommended Precautions</h4>
                <ul className="space-y-2">
                  {result.recommended_precautions.map((prec: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm text-on-surface bg-surface-container p-3 rounded border border-outline-variant">
                      <ShieldCheck className="w-4 h-4 text-primary mt-0.5" /> {prec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
