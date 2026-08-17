import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LabSettingsProvider } from './context/LabSettingsContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PhishingDetector from './pages/PhishingDetector'
import ReconLab from './pages/ReconLab'
import OwaspLab from './pages/OwaspLab'
import Bootcamp from './pages/Bootcamp'
import NetworkLab from './pages/NetworkLab'
import PasswordLab from './pages/PasswordLab'
import SocLab from './pages/SocLab'
import CtfLab from './pages/CtfLab'
import IncidentResponseLab from './pages/IncidentResponseLab'
import GenericModule from './pages/GenericModule'
import AdminDashboard from './pages/AdminDashboard'
import Contact from './pages/Contact'
import Leaderboard from './pages/Leaderboard'
import SimLab from './pages/SimLab'
import CyberPPT from './pages/CyberPPT'
import InfoLookup from './pages/InfoLookup'
import VmChecklist from './pages/VmChecklist'
import CheatSheet from './pages/CheatSheet'
import CyberWarRoom from './pages/CyberWarRoom'

export default function App() {
  return (
    <AuthProvider>
      <LabSettingsProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute trainerOnly>
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/war-room" element={
            <ProtectedRoute>
              <CyberWarRoom />
            </ProtectedRoute>
          } />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/phishing" element={<PhishingDetector />} />
                  <Route path="/recon" element={<ReconLab />} />
                  <Route path="/owasp" element={<OwaspLab />} />
                  <Route path="/bootcamp" element={<Bootcamp />} />
                  <Route path="/network" element={<NetworkLab />} />
                  <Route path="/password" element={<PasswordLab />} />
                  <Route path="/soc" element={<SocLab />} />
                  <Route path="/ir" element={<IncidentResponseLab />} />
                  <Route path="/ctf" element={<CtfLab />} />
                  <Route path="/ppt" element={<CyberPPT />} />
                  <Route path="/info" element={<InfoLookup />} />
                  <Route path="/checklist" element={<VmChecklist />} />
                  <Route path="/cheatsheet" element={<CheatSheet />} />
                  <Route path="/progress" element={<GenericModule moduleId="progress" />} />
                  <Route path="/lab/:labId" element={<SimLab />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
      </LabSettingsProvider>
    </AuthProvider>
  )
}
