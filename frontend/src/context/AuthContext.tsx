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
    // Only use Supabase if configured, otherwise use localStorage auth
    if (isSupabaseConfigured()) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }).catch(() => {
        // If Supabase fails, fall back to localStorage
        setLoading(false)
      })

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    } else {
      // Use localStorage-based auth if Supabase not configured
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
