import { Outlet, NavLink } from 'react-router-dom'
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
  Sparkles
} from 'lucide-react'
import { cn } from '../../utils/utils'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/copilot', label: 'Incident Copilot', icon: Bot },
  { path: '/memory', label: 'Memory Explorer', icon: Database },
  { path: '/similar', label: 'Similar Incidents', icon: History },
  { path: '/risk', label: 'Deployment Risk', icon: AlertTriangle, badge: 2 },
  { path: '/postmortems', label: 'Postmortems', icon: FileText },
]

export default function MainLayout() {
  return (
    <div className="bg-surface select-none min-h-screen text-on-surface">
      {/* Sidebar Navigation */}
      <aside className="h-screen w-sidebar-width fixed left-0 top-0 border-r border-outline-variant bg-surface flex flex-col py-4 px-3 z-50">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Bolt className="text-on-primary w-5 h-5" />
          </div>
          <div>
            <h1 className="font-h2 text-h2 font-bold text-primary tracking-tighter">IncidentIQ</h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">AI SRE Copilot</p>
          </div>
        </div>
        
        <button className="mb-6 w-full py-2.5 px-4 bg-primary text-on-primary rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all">
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
          <div className="flex items-center gap-3 px-3 py-4 mt-2">
            <img 
              className="w-8 h-8 rounded-full border border-outline-variant" 
              alt="User" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnO0aWMZxlA7BBXK2kY7rsea94ZXsfr5CIf-KsluKI3qaP59ev-7ubJGt3a_T-hhdhIwBmyT8KiNiMzYDwFATZTu5U3l2BxKxcb35bJ8aK5Of_i5t60GAExLHwusT7s3fU466phoHHOjhVwn0KR7Jk46oIbn9_EmQKoy7gXZGrHv_W_s0dJYfI3-CDOQBTx-BzMvwhjaZtwCpOfuBDi_4NxVKCTpOfQ4GJSk3RtyyD0U2PVl_oVw8MWDSsRZM43eMoMMrjibn30Q"
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-[12px] font-semibold text-on-surface truncate">Alex Rivera</p>
              <p className="text-[10px] text-on-surface-variant truncate">Lead SRE</p>
            </div>
          </div>
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
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <Bell className="w-[22px] h-[22px]" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <HelpCircle className="w-[22px] h-[22px]" />
            </button>
            <div className="h-6 w-[1px] bg-outline-variant mx-2"></div>
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-secondary-container/20 text-secondary border border-secondary-container/30">
              <Sparkles className="w-3.5 h-3.5" />
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
        <button className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-2xl flex items-center justify-center active-glow hover:scale-110 transition-transform">
          <Bot className="w-8 h-8" />
        </button>
        <div className="absolute -top-2 -right-2 bg-error text-on-error w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-surface">
          3
        </div>
      </div>

      {/* Background Atmospheric Effect */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20 bg-gradient-to-br from-primary-container/5 to-secondary-container/5" />
    </div>
  )
}
