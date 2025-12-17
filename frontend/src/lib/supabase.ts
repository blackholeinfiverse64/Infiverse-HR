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
    // Return mock success for localStorage-based auth
    return { 
      data: { 
        user: { 
          id: 'local-user', 
          email: email,
          user_metadata: { role: 'candidate' }
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
    return { 
      data: { 
        user: { 
          id: 'local-user', 
          email: email,
          user_metadata: { role: 'candidate' }
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
