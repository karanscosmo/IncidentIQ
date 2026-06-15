import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  Bolt,
  LayoutDashboard,
  Bot,
  Database,
  History,
  AlertTriangle,
  FileText,
  Settings,
  Search,
  Bell,
  HelpCircle,
  Sparkles,
  X
} from 'lucide-react'
import { cn } from '../../utils/utils'
import CreateIncidentModal from '../modals/CreateIncidentModal'
import DemoOverlay from '../demo/DemoOverlay'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/copilot', label: 'Incident Copilot', icon: Bot },
  { path: '/memory', label: 'Memory Explorer', icon: Database },
  { path: '/similar', label: 'Similar Incidents', icon: History },
  { path: '/risk', label: 'Deployment Risk', icon: AlertTriangle, badge: 2 },
  { path: '/postmortems', label: 'Postmortems', icon: FileText },
]

export default function MainLayout() {
  const navigate = useNavigate();
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="bg-surface select-none min-h-screen text-on-surface">
      {/* Sidebar Navigation */}
      <aside className="h-screen w-sidebar-width fixed left-0 top-0 border-r border-outline-variant bg-surface flex flex-col py-4 px-3 z-50">
        <div className="flex items-center gap-3 mb-8 px-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Bolt className="text-on-primary w-5 h-5" />
          </div>
          <div>
            <h1 className="font-h2 text-h2 font-bold text-primary tracking-tighter">IncidentIQ</h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">AI SRE Copilot</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsIncidentModalOpen(true)}
          className="mb-6 w-full py-2.5 px-4 bg-primary text-on-primary rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Incident
        </button>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg font-label-md text-label-md transition-colors",
                  isActive 
                    ? "text-primary font-bold bg-primary-container/10" 
                    : "text-on-surface-variant hover:bg-surface-container-high"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-error-container text-error text-[10px] px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-1 pt-4 border-t border-outline-variant">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg font-label-md text-label-md transition-colors",
                isActive 
                  ? "text-primary font-bold bg-primary-container/10" 
                  : "text-on-surface-variant hover:bg-surface-container-high"
              )
            }
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
          <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-3 py-4 mt-2 hover:bg-surface-container-high rounded-lg transition-colors text-left">
            <img 
              className="w-8 h-8 rounded-full border border-outline-variant" 
              alt="User" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnO0aWMZxlA7BBXK2kY7rsea94ZXsfr5CIf-KsluKI3qaP59ev-7ubJGt3a_T-hhdhIwBmyT8KiNiMzYDwFATZTu5U3l2BxKxcb35bJ8aK5Of_i5t60GAExLHwusT7s3fU466phoHHOjhVwn0KR7Jk46oIbn9_EmQKoy7gXZGrHv_W_s0dJYfI3-CDOQBTx-BzMvwhjaZtwCpOfuBDi_4NxVKCTpOfQ4GJSk3RtyyD0U2PVl_oVw8MWDSsRZM43eMoMMrjibn30Q"
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-[12px] font-semibold text-on-surface truncate">Alex Rivera</p>
              <p className="text-[10px] text-on-surface-variant truncate">Lead SRE</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-sidebar-width min-h-screen">
        {/* Top Navigation */}
        <header className="fixed top-0 right-0 w-[calc(100%-240px)] h-header-height z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-container-margin">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-1.5 pl-10 pr-4 text-body-sm font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="Search incidents, logs, or metrics... (Cmd+K)" 
                type="text" 
              />
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant relative"
            >
              <Bell className="w-[22px] h-[22px]" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface"></div>
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute top-12 right-12 w-80 bg-surface border border-outline-variant rounded-xl shadow-2xl p-4 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-2">
                  <span className="font-semibold text-sm">Notifications</span>
                  <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="space-y-3">
                  <div className="text-xs">
                    <span className="text-error font-semibold">Critical:</span> Database connection pool exhausted in payment-gateway.
                    <p className="text-[10px] text-on-surface-variant mt-1">2 mins ago</p>
                  </div>
                  <div className="text-xs border-t border-outline-variant pt-2">
                    <span className="text-primary font-semibold">Update:</span> Hindsight memory bank ingestion successful (1,240 vectors).
                    <p className="text-[10px] text-on-surface-variant mt-1">15 mins ago</p>
                  </div>
                  <div className="text-xs border-t border-outline-variant pt-2">
                    <span className="text-secondary font-semibold">Warning:</span> High memory usage in auth-service pods.
                    <p className="text-[10px] text-on-surface-variant mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant"
            >
              <HelpCircle className="w-[22px] h-[22px]" />
            </button>

            {/* Help Dropdown */}
            {isHelpOpen && (
              <div className="absolute top-12 right-0 w-64 bg-surface border border-outline-variant rounded-xl shadow-2xl p-4 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-2">
                  <span className="font-semibold text-sm">IncidentIQ Help</span>
                  <button onClick={() => setIsHelpOpen(false)}><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-2 text-sm text-on-surface-variant">
                  <a href="#" className="block hover:text-primary transition-colors">Documentation</a>
                  <a href="#" className="block hover:text-primary transition-colors">API Reference</a>
                  <a href="#" className="block hover:text-primary transition-colors">Keyboard Shortcuts</a>
                  <a href="#" className="block hover:text-primary transition-colors">Support Center</a>
                </div>
              </div>
            )}

            <div className="h-6 w-[1px] bg-outline-variant mx-2"></div>
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-secondary-container/20 text-secondary border border-secondary-container/30 cursor-help" title="Connected to LangGraph Agent Network">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-label-md text-[11px] uppercase tracking-wider">AI Live</span>
            </div>
          </div>
        </header>

        {/* Canvas */}
        <div className="pt-[calc(56px+24px)] px-container-margin pb-12">
          <Outlet />
        </div>
      </main>

      {/* Floating Copilot Chat Trigger */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <button 
          onClick={() => navigate('/copilot')}
          className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-2xl flex items-center justify-center active-glow hover:scale-110 transition-transform"
        >
          <Bot className="w-8 h-8" />
        </button>
        <div className="absolute -top-2 -right-2 bg-error text-on-error w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-surface">
          3
        </div>
      </div>

      {/* Background Atmospheric Effect */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20 bg-gradient-to-br from-primary-container/5 to-secondary-container/5" />

      {/* Components */}
      <CreateIncidentModal isOpen={isIncidentModalOpen} onClose={() => setIsIncidentModalOpen(false)} />
      <DemoOverlay />

    </div>
  )
}
