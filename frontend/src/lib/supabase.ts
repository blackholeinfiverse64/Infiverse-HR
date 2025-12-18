import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create Supabase client with fallback values if not configured
// This allows the app to run without Supabase (using localStorage auth instead)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && 
         import.meta.env.VITE_SUPABASE_ANON_KEY &&
         import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
         import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-key'
}

// Auth helper functions
export const signUp = async (email: string, password: string, userData: { name: string; role: string }) => {
  // Skip Supabase if not configured - use localStorage auth instead
  if (!isSupabaseConfigured()) {
    // Return mock success for localStorage-based auth
    return { 
      data: { 
        user: { 
          id: 'local-user', 
          email: email,
          user_metadata: { 
            name: userData.name,
            role: userData.role 
          }
        } 
      }, 
      error: null 
    }
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
        },
      },
    })
    
    // If signup fails because user already exists, return a clearer error
    if (error) {
      // Check if it's an "already exists" error
      if (error.message?.includes('already registered') || 
          error.message?.includes('User already registered') ||
          error.message?.includes('already exists') ||
          error.status === 422) {
        return { 
          data: null, 
          error: { 
            ...error, 
            message: 'This email is already registered. Please use the login page instead.' 
          } 
        }
      }
    }
    
    return { data, error }
  } catch (err: any) {
    // If Supabase fails, fall back to localStorage auth
    console.warn('Supabase sign up failed, using localStorage auth:', err)
    return { 
      data: { 
        user: { 
          id: 'local-user', 
          email: email,
          user_metadata: { 
            name: userData.name,
            role: userData.role 
          }
        } 
      }, 
      error: null 
    }
  }
}

export const signIn = async (email: string, password: string) => {
  // Skip Supabase if not configured - use localStorage auth instead
  if (!isSupabaseConfigured()) {
    // Check if user exists in localStorage (for demo purposes)
    // In real app, this would validate against a backend
    const storedRole = localStorage.getItem('user_role')
    
    // Return mock success for localStorage-based auth
    // Use stored role if available, otherwise return null (will be set by AuthPage)
    return { 
      data: { 
        user: { 
          id: localStorage.getItem('user_id') || 'local-user', 
          email: email,
          user_metadata: storedRole ? { role: storedRole } : {}
        } 
      }, 
      error: null 
    }
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  } catch (err: any) {
    // If Supabase fails, fall back to localStorage auth
    console.warn('Supabase sign in failed, using localStorage auth:', err)
    const storedRole = localStorage.getItem('user_role')
    return { 
      data: { 
        user: { 
          id: localStorage.getItem('user_id') || 'local-user', 
          email: email,
          user_metadata: storedRole ? { role: storedRole } : {}
        } 
      }, 
      error: null 
    }
  }
}

export const signOut = async () => {
  // Skip Supabase if not configured
  if (!isSupabaseConfigured()) {
    return { error: null }
  }
  
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (err: any) {
    // If Supabase fails, just return success (localStorage will be cleared separately)
    console.warn('Supabase sign out failed:', err)
    return { error: null }
  }
}

export const getCurrentUser = async () => {
  // Skip Supabase if not configured
  if (!isSupabaseConfigured()) {
    const storedAuth = localStorage.getItem('isAuthenticated')
    if (storedAuth === 'true') {
      return { 
        user: { 
          id: localStorage.getItem('user_id') || 'local-user',
          email: localStorage.getItem('user_email') || '',
        } as any, 
        error: null 
      }
    }
    return { user: null, error: null }
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  } catch (err: any) {
    console.warn('Supabase get user failed:', err)
    return { user: null, error: err }
  }
}

export const getSession = async () => {
  // Skip Supabase if not configured
  if (!isSupabaseConfigured()) {
    const storedAuth = localStorage.getItem('isAuthenticated')
    if (storedAuth === 'true') {
      return { 
        session: { 
          user: { 
            id: localStorage.getItem('user_id') || 'local-user',
            email: localStorage.getItem('user_email') || '',
          } 
        } as any, 
        error: null 
      }
    }
    return { session: null, error: null }
  }
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  } catch (err: any) {
    console.warn('Supabase get session failed:', err)
    return { session: null, error: err }
  }
}

/**
 * Get user role from user_profiles table
 * This is the primary source of truth for user roles
 */
export const getUserRole = async (userId?: string): Promise<string | null> => {
  if (!isSupabaseConfigured()) {
    return localStorage.getItem('user_role')
  }

  try {
    // Get current user if userId not provided
    let targetUserId = userId
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      targetUserId = user.id
    }

    // Query user_profiles table
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', targetUserId)
      .single()

    if (error) {
      // If profile doesn't exist (PGRST116), return null (caller can handle)
      if (error.code === 'PGRST116') {
        console.warn('User profile does not exist for user:', targetUserId)
        return null
      }
      console.warn('Error fetching user role from profiles:', error)
      return null
    }

    return data?.role || null
  } catch (err: any) {
    console.warn('Error getting user role:', err)
    return null
  }
}

/**
 * Update user role in user_profiles table
 */
export const updateUserRole = async (userId: string, role: 'candidate' | 'recruiter' | 'client'): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    localStorage.setItem('user_role', role)
    return true
  }

  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user role:', error)
      return false
    }

    return true
  } catch (err: any) {
    console.error('Error updating user role:', err)
    return false
  }
}
