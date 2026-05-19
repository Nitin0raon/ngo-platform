import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, RoleRoute, PublicRoute } from './components/ProtectedRoute'

// Existing pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import ProgramsPage from './pages/ProgramsPage'
import CreateProgramPage from './pages/CreateProgramPage'
import NotificationsPage from './pages/NotificationsPage'
import NotFoundPage from './pages/NotFoundPage'

// New pages
import NGOLandingPage from './pages/NGOLandingPage'
import VolunteerLandingPage from './pages/VolunteerLandingPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* ── Public ── */}
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* ── Protected (any logged-in user) ── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/programs"
          element={
            <ProtectedRoute>
              <ProgramsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW: Settings (both roles) */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW: Role-based landing */}
        <Route
          path="/ngo-home"
          element={
            <RoleRoute role="ngo">
              <NGOLandingPage />
            </RoleRoute>
          }
        />

        <Route
          path="/volunteer-home"
          element={
            <RoleRoute role="volunteer">
              <VolunteerLandingPage />
            </RoleRoute>
          }
        />

        {/* ── NGO only ── */}
        <Route
          path="/create-program"
          element={
            <RoleRoute role="ngo">
              <CreateProgramPage />
            </RoleRoute>
          }
        />

        {/* ── 404 ── */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </AuthProvider>
  )
}