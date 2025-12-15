import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import SplashScreen from './components/SplashScreen'
import RoleSelection from './pages/RoleSelection'
import AuthPage from './pages/auth/AuthPage'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute'

// Layouts
import CandidateLayout from './components/layouts/CandidateLayout'
import RecruiterLayout from './components/layouts/RecruiterLayout'
import ClientLayout from './components/layouts/ClientLayout'

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard'
import CandidateProfile from './pages/candidate/Profile'
import JobSearch from './pages/candidate/JobSearch'
import AppliedJobs from './pages/candidate/AppliedJobs'
import InterviewTaskPanel from './pages/candidate/InterviewTaskPanel'
import CandidateFeedback from './pages/candidate/Feedback'

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard'
import JobCreation from './pages/recruiter/JobCreation'
import ApplicantsMatching from './pages/recruiter/ApplicantsMatching'
import FeedbackForm from './pages/recruiter/FeedbackForm'
import AutomationPanel from './pages/recruiter/AutomationPanel'

// Client Pages
import ClientDashboard from './pages/client/Dashboard'
import ShortlistReview from './pages/client/ShortlistReview'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown')
    if (splashShown) {
      setShowSplash(false)
    }
  }, [])

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true')
    setShowSplash(false)
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Public Routes - redirect to dashboard if already logged in */}
              <Route path="/" element={<PublicRoute><RoleSelection /></PublicRoute>} />
              <Route path="/auth/:role" element={<PublicRoute><AuthPage /></PublicRoute>} />

              {/* Candidate Routes - Protected for 'candidate' role only */}
              <Route path="/candidate" element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/candidate/dashboard" replace />} />
                <Route path="dashboard" element={<CandidateDashboard />} />
                <Route path="profile" element={<CandidateProfile />} />
                <Route path="jobs" element={<JobSearch />} />
                <Route path="applied-jobs" element={<AppliedJobs />} />
                <Route path="interviews" element={<InterviewTaskPanel />} />
                <Route path="feedback" element={<CandidateFeedback />} />
              </Route>

              {/* Recruiter Routes - Protected for 'recruiter' role only */}
              <Route path="/recruiter" element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterLayout />
                </ProtectedRoute>
              }>
                <Route index element={<RecruiterDashboard />} />
                <Route path="create-job" element={<JobCreation />} />
                <Route path="jobs" element={<RecruiterDashboard />} />
                <Route path="candidates" element={<RecruiterDashboard />} />
                <Route path="screening" element={<RecruiterDashboard />} />
                <Route path="applicants/:jobId" element={<ApplicantsMatching />} />
                <Route path="feedback/:candidateId" element={<FeedbackForm />} />
                <Route path="automation" element={<AutomationPanel />} />
                <Route path="reports" element={<RecruiterDashboard />} />
              </Route>

              {/* Client Routes - Protected for 'client' role only */}
              <Route path="/client" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ClientDashboard />} />
                <Route path="jobs" element={<ClientDashboard />} />
                <Route path="shortlisted" element={<ClientDashboard />} />
                <Route path="shortlist/:jobId" element={<ShortlistReview />} />
                <Route path="interviews" element={<ClientDashboard />} />
                <Route path="hired" element={<ClientDashboard />} />
                <Route path="analytics" element={<ClientDashboard />} />
                <Route path="settings" element={<ClientDashboard />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                className: 'dark:bg-gray-900 dark:text-gray-100',
                style: {
                  background: 'var(--toast-bg, #ffffff)',
                  color: 'var(--toast-color, #1f2937)',
                  border: '2px solid var(--toast-border, #e5e7eb)',
                  borderRadius: '12px',
                  padding: '16px',
                  fontWeight: '600',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </BrowserRouter>
        )}
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
