import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

type AuthMode = 'login' | 'signup'
type UserRole = 'candidate' | 'recruiter' | 'client'

const roleConfig = {
  candidate: {
    title: 'Candidate',
    gradient: 'from-blue-500 to-cyan-500',
    redirectPath: '/candidate/dashboard',
  },
  recruiter: {
    title: 'Recruiter',
    gradient: 'from-emerald-500 to-teal-500',
    redirectPath: '/recruiter',
  },
  client: {
    title: 'Client',
    gradient: 'from-purple-500 to-pink-500',
    redirectPath: '/client',
  },
}

export default function AuthPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Get initial mode from URL query parameter, default to 'login'
  const urlMode = searchParams.get('mode')
  const initialMode = (urlMode === 'signup' ? 'signup' : 'login') as AuthMode
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [isLoading, setIsLoading] = useState(false)
  
  // Role selection state (only for signup)
  const [selectedRole, setSelectedRole] = useState<UserRole>('candidate')
  
  // Sync mode with URL parameter when URL changes
  useEffect(() => {
    const currentUrlMode = searchParams.get('mode')
    if (currentUrlMode === 'signup' || currentUrlMode === 'login') {
      const newMode = currentUrlMode as AuthMode
      if (mode !== newMode) {
        setMode(newMode)
      }
    }
  }, [searchParams, mode])
  
  // Helper to change mode and update URL
  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode)
    setSearchParams({ mode: newMode }, { replace: true })
  }
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    company: '',
    phone: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'role') {
      setSelectedRole(value as UserRole)
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const { signIn, signUp, userRole } = useAuth();

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
      if (mode === 'signup') {
        // SIGNUP: Create account with the selected role
        const { error } = await signUp(formData.email, formData.password, {
          name: formData.fullName,
          role: selectedRole,
          company: formData.company || undefined,
          phone: formData.phone || undefined
        })
        
        if (error) {
          const errorMsg = error || ''
          
          if (errorMsg.includes('already registered') || 
              errorMsg.includes('User already registered') ||
              errorMsg.includes('already exists') ||
              errorMsg.includes('email address is already') ||
              errorMsg.includes('already been registered')) {
            toast.error('This email is already registered. Please use the login page to sign in.')
          } else {
            toast.error(errorMsg || 'Signup failed. Please try again.')
          }
          setIsLoading(false)
          return
        }
        
        // Role is already stored by AuthContext - just verify
        const storedRole = localStorage.getItem('user_role') || selectedRole
        
        console.log('✅ Signup successful! Role:', storedRole, 'Redirecting to:', roleConfig[storedRole as UserRole]?.redirectPath)
        toast.success(`Account created successfully as ${roleConfig[storedRole as UserRole]?.title || selectedRole}!`)
        setIsLoading(false)
        navigate(roleConfig[storedRole as UserRole]?.redirectPath || roleConfig[selectedRole].redirectPath)
      } else {
        // LOGIN: Authenticate and redirect based on user's role
        const { error } = await signIn(formData.email, formData.password)
        
        if (error) {
          toast.error(error || 'Login failed. Please check your credentials.')
          setIsLoading(false)
          return
        }
        
        // Get user's role from JWT token (stored by AuthContext during login)
        // AuthContext extracts role from token and stores it in localStorage
        const roleFromStorage = localStorage.getItem('user_role') as UserRole
        const roleFromContext = userRole as UserRole
        
        // Use role from context (from JWT token) or localStorage, then default to candidate
        const finalRole: UserRole = (roleFromContext || roleFromStorage || 'candidate') as UserRole
        
        // Ensure role is valid (must be one of the three roles)
        const validRole: UserRole = (['candidate', 'recruiter', 'client'].includes(finalRole) 
          ? finalRole 
          : 'candidate') as UserRole
        
        console.log('🚀 Login: User role from token:', validRole, 'Redirecting to:', roleConfig[validRole].redirectPath)
        toast.success(`Login successful as ${roleConfig[validRole].title}!`)
        setIsLoading(false)
        navigate(roleConfig[validRole].redirectPath)
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
      setIsLoading(false)
    }
  }

  // Fixed blue color scheme for auth page
  const fixedGradient = 'from-blue-500 to-cyan-500'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-br ${fixedGradient} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob`} />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br ${fixedGradient} rounded-full mix-blend-multiply filter blur-3xl opacity-5`} />
      </div>

      {/* Centered Content */}
      <div className={`relative z-10 w-full ${mode === 'signup' ? 'max-w-2xl' : 'max-w-md'}`}>
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-purple-500 to-pink-500 p-0.5 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold">
              <span className={`bg-gradient-to-r ${fixedGradient} bg-clip-text text-transparent`}>
                Infiverse
              </span>
              <span className="text-white"> HR</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === 'login' ? (
              <>Welcome <span className={`bg-gradient-to-r ${fixedGradient} bg-clip-text text-transparent`}>Back!</span></>
            ) : (
              <>Create <span className={`bg-gradient-to-r ${fixedGradient} bg-clip-text text-transparent`}>Account</span></>
            )}
          </h1>
          <p className="text-gray-400">
            {mode === 'login'
              ? 'Sign in to continue to your dashboard'
              : 'Join the AI-powered recruitment platform'}
          </p>
        </div>

        {/* Form Card */}
        <div className={`bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl`}>
           {/* Mode Toggle */}
           <div className="flex bg-slate-900/60 rounded-2xl p-1.5 mb-6">
             <button
               type="button"
               onClick={() => handleModeChange('login')}
               className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                 mode === 'login'
                   ? `bg-gradient-to-r ${fixedGradient} text-white shadow-lg`
                   : 'text-gray-400 hover:text-white'
               }`}
             >
               Sign In
             </button>
             <button
               type="button"
               onClick={() => handleModeChange('signup')}
               className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                 mode === 'signup'
                   ? `bg-gradient-to-r ${fixedGradient} text-white shadow-lg`
                   : 'text-gray-400 hover:text-white'
               }`}
             >
               Sign Up
             </button>
           </div>

          <form onSubmit={handleSubmit}>
            {/* ========== SIGNUP FORM ========== */}
            {mode === 'signup' && (
              <div className="space-y-4 mb-4">
                {/* Role Selection - Only in Signup */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Role <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="role"
                    value={selectedRole}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-all`}
                    required
                  >
                    <option value="candidate">Candidate</option>
                    <option value="recruiter">Recruiter (HR)</option>
                    <option value="client">Client</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-all"
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
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-all"
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
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  {/* Company - Only for recruiter/client */}
                  {(selectedRole === 'recruiter' || selectedRole === 'client') && (
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
                        className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
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
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-all"
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
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========== LOGIN FORM ========== */}
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
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-all"
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
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            )}

            {/* Terms Checkbox - Signup only */}
            {mode === 'signup' && (
              <div className="flex items-start gap-3 mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-1 rounded border-slate-600 bg-slate-900/60 text-blue-500 focus:ring-offset-0"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I agree to the{' '}
                  <button type="button" className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent font-medium">
                    Terms
                  </button>{' '}
                  and{' '}
                  <button type="button" className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent font-medium">
                    Privacy Policy
                  </button>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-6 bg-gradient-to-r ${fixedGradient} text-white font-bold rounded-xl hover:opacity-90 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6`}
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
               onClick={() => handleModeChange(mode === 'login' ? 'signup' : 'login')}
               className="font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
             >
               {mode === 'login' ? 'Sign up' : 'Sign in'}
             </button>
           </p>
        </div>
      </div>
    </div>
  )
}
