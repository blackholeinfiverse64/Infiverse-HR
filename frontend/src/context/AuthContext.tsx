import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, signIn, signUp, signOut, isSupabaseConfigured } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: { name: string; role: string }) => Promise<{ error: any }>
  signOut: () => Promise<void>
  userRole: string | null
  userName: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Always use localStorage-based auth (Supabase is optional)
    // This prevents ERR_NAME_NOT_RESOLVED errors when Supabase is not configured
    try {
      const storedAuth = localStorage.getItem('isAuthenticated')
      if (storedAuth === 'true') {
        // Create a mock user from localStorage
        const mockUser = {
          id: localStorage.getItem('user_id') || 'local-user',
          email: localStorage.getItem('user_email') || '',
        } as User
        setUser(mockUser)
      }
      setLoading(false)
      
      // Optionally try Supabase if configured (but don't block on it)
      if (isSupabaseConfigured()) {
        // Try to get Supabase session in background (non-blocking)
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            setSession(session)
            setUser(session.user)
          }
        }).catch(() => {
          // Silently fail - we're using localStorage auth
          console.debug('Supabase not available, using localStorage auth')
        })

        // Listen for auth changes (non-blocking)
        // IMPORTANT: Never override role from localStorage during auth state changes
        // This prevents role conflicts during signup/login
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setSession(session)
            setUser(session.user)
            // Only update user_id, never override role during auth state changes
            // Role should only be set during explicit signup/login actions
            if (session.user.id) {
              localStorage.setItem('user_id', session.user.id)
            }
          } else {
            // User signed out
            setSession(null)
            setUser(null)
          }
        })

        return () => subscription.unsubscribe()
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      // Fallback to localStorage auth on any error
      const storedAuth = localStorage.getItem('isAuthenticated')
      if (storedAuth === 'true') {
        const mockUser = {
          id: localStorage.getItem('user_id') || 'local-user',
          email: localStorage.getItem('user_email') || '',
        } as User
        setUser(mockUser)
      }
      setLoading(false)
    }
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await signIn(email, password)
    return { error }
  }

  const handleSignUp = async (email: string, password: string, userData: { name: string; role: string }) => {
    const { error } = await signUp(email, password, userData)
    return { error }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      // Clear all localStorage items
      localStorage.removeItem('user_role')
      localStorage.removeItem('user_email')
      localStorage.removeItem('user_name')
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('candidate_id')
      localStorage.removeItem('backend_candidate_id')
      localStorage.removeItem('auth_token')
    } catch (error) {
      console.error('Sign out error:', error)
      // Even if signOut fails, clear localStorage
      localStorage.clear()
    }
  }

  const userRole = user?.user_metadata?.role || localStorage.getItem('user_role')
  const userName = user?.user_metadata?.name || localStorage.getItem('user_name')

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      userRole,
      userName,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
