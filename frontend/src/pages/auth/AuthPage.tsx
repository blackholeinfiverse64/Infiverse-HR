import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { signIn as supabaseSignIn, signOut } from '../../lib/supabase'

type AuthMode = 'login' | 'signup'

const roleConfig = {
  candidate: {
    title: 'Candidate',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    focusRing: 'focus:ring-blue-500',
    checkboxColor: 'text-blue-500 focus:ring-blue-500',
    shadowColor: 'hover:shadow-blue-500/25',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    redirectPath: '/candidate/profile',
  },
  recruiter: {
    title: 'Recruiter',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
    focusRing: 'focus:ring-emerald-500',
    checkboxColor: 'text-emerald-500 focus:ring-emerald-500',
    shadowColor: 'hover:shadow-emerald-500/25',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    redirectPath: '/recruiter',
  },
  client: {
    title: 'Client',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/30',
    focusRing: 'focus:ring-purple-500',
    checkboxColor: 'text-purple-500 focus:ring-purple-500',
    shadowColor: 'hover:shadow-purple-500/25',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    redirectPath: '/client',
  },
}

export default function AuthPage() {
  const { role } = useParams<{ role: string }>()
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    company: '',
    phone: '',
  })

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.candidate

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    if (mode === 'signup') {
      if (!formData.fullName.trim()) {
        toast.error('Please enter your full name')
        setIsLoading(false)
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        setIsLoading(false)
        return
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters')
        setIsLoading(false)
        return
      }
    }

    try {
      // Get the expected role from URL parameter - this is the role-specific page
      const expectedRole = role || 'candidate'
      
      if (mode === 'signup') {
        setIsSigningUp(true) // Flag to prevent role checks during signup
        
        // Enforce role-based signup - user can only signup with the role of the page they're on
        const { error, data } = await signUp(formData.email, formData.password, {
          name: formData.fullName,
          role: expectedRole, // Use the role from the URL, not a form selection
        })
        
        if (error) {
          // Handle specific Supabase errors
          const errorMsg = error.message || ''
          
          if (errorMsg.includes('already registered') || 
              errorMsg.includes('User already registered') ||
              errorMsg.includes('already exists') ||
              errorMsg.includes('email address is already')) {
            // Check if the existing user has a different role
            // Try to get user info to check role
            try {
              const { data: loginData } = await supabaseSignIn(formData.email, formData.password)
              if (loginData?.user?.user_metadata?.role) {
                const existingRole = loginData.user.user_metadata.role
                if (existingRole !== expectedRole) {
                  toast.error(`This email is registered as a ${existingRole}. Please use the ${existingRole} ${mode === 'signup' ? 'signup' : 'login'} page.`)
                } else {
                  toast.error('This email is already registered. Please use the login page instead.')
                }
                await signOut() // Sign out the test login
              } else {
                toast.error('This email is already registered. Please use the login page instead.')
              }
            } catch {
              toast.error('This email is already registered. Please use the login page instead.')
            }
          } else {
            toast.error(errorMsg || 'Signup failed. Please try again.')
          }
          setIsSigningUp(false)
          setIsLoading(false)
          return
        }
        
        // Only proceed if signup was successful
        if (!data?.user) {
          setIsSigningUp(false)
          toast.error('Signup failed. Please try again.')
          setIsLoading(false)
          return
        }
        
        // Verify the role was set correctly during signup
        const createdUserRole = data.user.user_metadata?.role || expectedRole
        
        // Enforce role match - user must signup with the role of the page
        if (createdUserRole !== expectedRole) {
          setIsSigningUp(false)
          toast.error(`Account created but role mismatch. Please contact support.`)
          setIsLoading(false)
          return
        }
        
        // Set the role from the page URL (expectedRole)
        localStorage.setItem('user_role', expectedRole)
        localStorage.setItem('user_email', formData.email)
        localStorage.setItem('user_name', formData.fullName)
        localStorage.setItem('isAuthenticated', 'true')
        
        setIsSigningUp(false)
        toast.success(`Account created successfully as ${expectedRole}! Please check your email to verify.`)
        setIsLoading(false)
        navigate(config.redirectPath)
      } else {
        // Login - STRICT role-based authentication
        // User must login through the correct role page
        const { error, data } = await supabaseSignIn(formData.email, formData.password)
        
        if (error) {
          toast.error(error.message || 'Login failed')
          setIsLoading(false)
          return
        }
        
        // Get user's actual role from Supabase
        const userRole = data?.user?.user_metadata?.role
        
        // STRICT CHECK: User's role MUST match the page role
        if (!userRole) {
          // If no role in metadata, use the page role (for backward compatibility)
          localStorage.setItem('user_role', expectedRole)
          localStorage.setItem('user_email', formData.email)
          localStorage.setItem('user_name', (data?.user?.user_metadata as any)?.name || formData.email.split('@')[0])
          localStorage.setItem('isAuthenticated', 'true')
          toast.success('Login successful!')
          setIsLoading(false)
          navigate(config.redirectPath)
          return
        }
        
        // Enforce role match - user MUST login through their role's page
        if (userRole !== expectedRole) {
          // Role mismatch - sign them out immediately
          await signOut()
          toast.error(`This account is registered as a ${userRole}. Please use the ${userRole} login page at /auth/${userRole}.`)
          setIsLoading(false)
          return
        }
        
        // Role matches - proceed with login
        localStorage.setItem('user_role', userRole)
        localStorage.setItem('user_email', formData.email)
        localStorage.setItem('user_name', (data?.user?.user_metadata as any)?.name || formData.email.split('@')[0])
        localStorage.setItem('isAuthenticated', 'true')
        
        toast.success(`Login successful as ${userRole}!`)
        setIsLoading(false)
        navigate(config.redirectPath)
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-br ${config.gradient} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob`} />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br ${config.gradient} rounded-full mix-blend-multiply filter blur-3xl opacity-5`} />
      </div>

      {/* Centered Content */}
      <div className={`relative z-10 w-full ${mode === 'signup' ? 'max-w-2xl' : 'max-w-md'}`}>
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-purple-500 to-pink-500 p-0.5 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold">
              <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                Infiverse
              </span>
              <span className="text-white"> HR</span>
            </span>
          </Link>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === 'login' ? (
              <>Welcome <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>Back!</span></>
            ) : (
              <>Create <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>Account</span></>
            )}
          </h1>
          <p className="text-gray-400">
            {mode === 'login'
              ? 'Sign in to continue to your dashboard'
              : 'Join the AI-powered recruitment platform'}
          </p>
        </div>

        {/* Form Card */}
        <div className={`bg-slate-800/60 backdrop-blur-xl border ${config.borderColor} rounded-3xl p-8 shadow-2xl`}>
          {/* Mode Toggle */}
          <div className="flex bg-slate-900/60 rounded-2xl p-1.5 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                mode === 'login'
                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                mode === 'signup'
                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ========== SIGNUP FORM - 2 COLUMNS ========== */}
            {mode === 'signup' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 ${config.focusRing} transition-all`}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 ${config.focusRing} transition-all`}
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 ${config.focusRing} transition-all`}
                  />
                </div>

                {/* Company - Only for recruiter/client */}
                {(role === 'recruiter' || role === 'client') ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Acme Inc."
                      className={`w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 ${config.focusRing} transition-all`}
                    />
                  </div>
                ) : (
                  <div className="hidden md:block" />
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 ${config.focusRing} transition-all`}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 ${config.focusRing} transition-all`}
                    required
                  />
                </div>
              </div>
            )}

            {/* ========== LOGIN FORM - SINGLE COLUMN ========== */}
            {mode === 'login' && (
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 ${config.focusRing} transition-all`}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 ${config.focusRing} transition-all`}
                    required
                  />
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className={`text-sm font-medium bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            )}

            {/* Terms Checkbox - Signup only */}
            {mode === 'signup' && (
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className={`w-4 h-4 mt-1 rounded border-slate-600 bg-slate-900/60 ${config.checkboxColor} focus:ring-offset-0`}
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I agree to the{' '}
                  <button type="button" className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent font-medium`}>
                    Terms
                  </button>{' '}
                  and{' '}
                  <button type="button" className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent font-medium`}>
                    Privacy Policy
                  </button>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-6 bg-gradient-to-r ${config.gradient} text-white font-bold rounded-xl hover:opacity-90 hover:shadow-lg ${config.shadowColor} transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-slate-800/60 text-gray-500 text-sm">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="flex justify-center">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-8 bg-slate-900/60 border border-slate-700 rounded-xl text-white hover:bg-slate-700/60 hover:border-slate-600 transition-all group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-medium text-sm">Continue with Google</span>
              </button>
            </div>
          </form>

          {/* Switch Mode */}
          <p className="text-center text-gray-400 text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className={`font-semibold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Back Link */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors mt-6 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to role selection
        </Link>
      </div>
    </div>
  )
}
