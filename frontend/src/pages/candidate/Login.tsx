import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function CandidateLogin() {
  const navigate = useNavigate()
  const [loginId, setLoginId] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!loginId.trim()) {
      toast.error('Please enter your Email or Candidate ID')
      return
    }

    // Store in localStorage for demo purposes
    localStorage.setItem('candidate_id', loginId)
    toast.success('Login successful!')
    navigate('/candidate/profile')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Candidate Portal</h2>
          <p className="text-gray-400">Login to access your profile and applications</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email or Candidate ID
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="Enter your email or candidate ID"
              className="input-field"
              required
            />
            <p className="text-gray-500 text-xs mt-2">
              Demo: Use any email or ID to login
            </p>
          </div>

          <button type="submit" className="w-full btn-primary mb-4">
            Login
          </button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              New candidate?{' '}
              <button
                type="button"
                onClick={() => navigate('/candidate/profile')}
                className="text-blue-400 hover:text-blue-300"
              >
                Create Profile
              </button>
            </p>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Access</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/candidate/applied-jobs')}
              className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm transition-colors"
            >
              View Applied Jobs
            </button>
            <button
              onClick={() => navigate('/candidate/interviews')}
              className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm transition-colors"
            >
              Check Interviews & Tasks
            </button>
            <button
              onClick={() => navigate('/candidate/feedback')}
              className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm transition-colors"
            >
              View Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
