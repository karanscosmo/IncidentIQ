import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './features/dashboard/Dashboard'
import Copilot from './features/incident/Copilot'
import MemoryExplorer from './features/memory/MemoryExplorer'
import SimilarIncidents from './features/incident/SimilarIncidents'
import DeploymentRisk from './features/deployment/DeploymentRisk'
import Postmortems from './features/postmortem/Postmortems'
import Settings from './pages/Settings'
import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="copilot" element={<Copilot />} />
        <Route path="memory" element={<MemoryExplorer />} />
        <Route path="similar" element={<SimilarIncidents />} />
        <Route path="risk" element={<DeploymentRisk />} />
        <Route path="postmortems" element={<Postmortems />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
