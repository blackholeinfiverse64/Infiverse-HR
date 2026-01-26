import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: { name: string; role: string; company?: string; phone?: string }) => Promise<{ error: any; user?: User }>;
  signOut: () => Promise<void>;
  userRole: string | null;
  userName: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize auth from stored JWT token
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        // Check if token is expired
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp > currentTime) {
          // Token is valid, set user data
          setUser(JSON.parse(userData));
        } else {
          // Token is expired, clear stored data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      } catch (error) {
        console.error('Error parsing token or user data:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setLoading(false);
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    try {
      // Get role from localStorage (stored during signup) to determine login endpoint
      // Don't default to 'candidate' - let authService auto-detect if role is not set
      // This allows fallback to client login if candidate login fails
      let storedRole = localStorage.getItem('user_role');
      
      // Only use stored role if it exists, otherwise let authService auto-detect
      // This prevents issues where 'candidate' is incorrectly stored for a client
      console.log('🔐 AuthContext: Attempting login with role:', storedRole || 'auto-detect');
      
      const authService = (await import('../services/authService')).default;
      // Pass undefined if no role is stored, so authService can auto-detect
      const result = await authService.login(email, password, storedRole || undefined);
      
      console.log('🔐 AuthContext: Login result:', { 
        success: result.success, 
        hasToken: !!result.token, 
        hasUser: !!result.user,
        userRole: result.user?.role 
      });
      
      if (result.success && result.token && result.user) {
        const token = result.token;
        
        // Validate token is not empty
        if (!token || token.trim() === '') {
          console.error('❌ AuthContext: Empty token received!');
          return { error: 'Invalid token received from server' };
        }
        
        // Extract role from JWT token (token contains role in payload)
        let role = 'candidate';
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          role = payload.role || result.user.role || storedRole || 'candidate';
          console.log('🔐 AuthContext: Extracted role from token:', role);
        } catch (tokenError) {
          console.error('❌ AuthContext: Error parsing token:', tokenError);
          // If token parsing fails, use role from user object, stored role, or default
          role = result.user.role || storedRole || 'candidate';
          console.log('🔐 AuthContext: Using role from user object or stored role:', role);
        }
        
        // Store the JWT token FIRST - this is critical
        console.log('🔐 AuthContext: Storing auth token for role:', role);
        console.log('🔐 AuthContext: Token length:', token.length);
        console.log('🔐 AuthContext: Token first 50 chars:', token.substring(0, 50));
        
        // Store token using multiple methods to ensure it's saved
        try {
          localStorage.setItem('auth_token', token);
          
          // Also set it in authService's TOKEN_KEY for consistency
          const authServiceInstance = (await import('../services/authService')).default;
          if (authServiceInstance.setAuthToken) {
            authServiceInstance.setAuthToken(token);
          }
          
          // Verify token was stored immediately
          const storedToken = localStorage.getItem('auth_token');
          if (!storedToken) {
            console.error('❌ AuthContext: CRITICAL - Failed to store token! localStorage may be disabled.');
            console.error('❌ AuthContext: Available localStorage keys:', Object.keys(localStorage));
            // Try again with explicit error handling
            try {
              localStorage.setItem('auth_token', token);
              const retryToken = localStorage.getItem('auth_token');
              if (!retryToken) {
                console.error('❌ AuthContext: Token storage failed even after retry!');
                return { error: 'Failed to store authentication token. Please check browser settings.' };
              } else {
                console.log('✅ AuthContext: Token stored successfully on retry');
              }
            } catch (e) {
              console.error('❌ AuthContext: localStorage.setItem threw error:', e);
              return { error: 'Failed to store authentication token: ' + (e as Error).message };
            }
          } else if (storedToken !== token) {
            console.error('❌ AuthContext: Token stored but value mismatch!');
            console.error('❌ AuthContext: Expected length:', token.length, 'Stored length:', storedToken.length);
            // Still continue - might be a minor issue
          } else {
            console.log('✅ AuthContext: Token stored successfully');
            console.log('✅ AuthContext: Token verification passed');
          }
        } catch (storageError) {
          console.error('❌ AuthContext: Error storing token:', storageError);
          return { error: 'Failed to store authentication token: ' + (storageError as Error).message };
        }
        
        // Store user data and role
        localStorage.setItem('user_data', JSON.stringify(result.user));
        localStorage.setItem('user_role', role);  // Store role from token
        localStorage.setItem('user_email', result.user.email || email);
        localStorage.setItem('user_name', result.user.name || '');
        localStorage.setItem('isAuthenticated', 'true');
        
        // Store role-specific IDs if available
        if (role === 'client' && result.user.id) {
          localStorage.setItem('client_id', result.user.id);
        } else if ((role === 'candidate' || role === 'recruiter') && result.user.id) {
          localStorage.setItem('candidate_id', result.user.id);
          localStorage.setItem('backend_candidate_id', result.user.id);
        }
        
        // Update user object with role
        const userWithRole = { ...result.user, role };
        setUser(userWithRole);
        
        // Set the auth token in axios defaults
        const axios = (await import('axios')).default;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log('✅ AuthContext: Login successful for role:', role);
        return { error: null };
      } else {
        console.error('❌ AuthContext: Login failed - no token or user in result:', result);
        const errorMsg = result.error || 'Login failed - no token or user data received';
        return { error: errorMsg };
      }
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      return { error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const handleSignUp = async (email: string, password: string, userData: { name: string; role: string; company?: string; phone?: string }) => {
    try {
      const authService = (await import('../services/authService')).default;
      const result = await authService.register({
        email,
        password,
        name: userData.name,
        role: userData.role,
        company: userData.company,
        phone: userData.phone
      });

      if (result.success && result.user) {
        // Store user data and role temporarily
        const role = userData.role || result.user.role || 'candidate';
        
        localStorage.setItem('user_role', role);
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_name', userData.name);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        
        // Store client_id for client login (client login uses client_id, not email)
        if (role === 'client' && result.user.id) {
          localStorage.setItem('client_id', result.user.id);
        }
        
        // Set user in state
        setUser(result.user);
        
        // IMPORTANT: Auto-login after successful registration to get auth token
        // Registration doesn't return a token, so we need to log in to get one
        console.log('🔐 Auto-logging in after successful registration...');
        const loginResult = await authService.login(email, password, role);
        
        if (loginResult.success && loginResult.token && loginResult.user) {
          const token = loginResult.token;
          
          // Validate token is not empty
          if (!token || token.trim() === '') {
            console.error('❌ AuthContext: Empty token received after auto-login!');
            return { error: 'Registration successful but auto-login failed. Please log in manually.' };
          }
          
          // Extract role from JWT token
          let extractedRole = role;
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            extractedRole = payload.role || role;
            console.log('🔐 AuthContext: Extracted role from auto-login token:', extractedRole);
          } catch (tokenError) {
            console.error('❌ AuthContext: Error parsing auto-login token:', tokenError);
          }
          
          // Store the JWT token
          console.log('🔐 AuthContext: Storing auth token from auto-login');
          localStorage.setItem('auth_token', token);
          
          // Verify token was stored
          const storedToken = localStorage.getItem('auth_token');
          if (!storedToken) {
            console.error('❌ AuthContext: CRITICAL - Failed to store token after auto-login!');
            return { error: 'Registration successful but failed to store authentication token.' };
          } else if (storedToken !== token) {
            console.error('❌ AuthContext: Token stored but value mismatch after auto-login!');
          } else {
            console.log('✅ AuthContext: Token stored successfully after auto-login');
          }
          
          // Update stored user data with token info
          localStorage.setItem('user_data', JSON.stringify(loginResult.user));
          localStorage.setItem('user_role', extractedRole);
          localStorage.setItem('isAuthenticated', 'true');
          
          // Store role-specific IDs
          if (extractedRole === 'client' && loginResult.user.id) {
            localStorage.setItem('client_id', loginResult.user.id);
          } else if ((extractedRole === 'candidate' || extractedRole === 'recruiter') && loginResult.user.id) {
            localStorage.setItem('candidate_id', loginResult.user.id);
            localStorage.setItem('backend_candidate_id', loginResult.user.id);
          }
          
          // Update user object with role
          const userWithRole = { ...loginResult.user, role: extractedRole };
          setUser(userWithRole);
          
          // Set the auth token in axios defaults
          const axios = (await import('axios')).default;
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          console.log('✅ AuthContext: Registration and auto-login successful for role:', extractedRole);
          return { error: null, user: userWithRole };
        } else {
          console.error('❌ AuthContext: Auto-login failed after registration:', loginResult.error);
          return { error: loginResult.error || 'Registration successful but auto-login failed. Please log in manually.' };
        }
      } else {
        return { error: result.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('❌ AuthContext: Registration error:', error);
      return { error: error instanceof Error ? error.message : 'Registration failed' };
    }
  };

  const handleSignOut = async () => {
    // Clear all auth-related localStorage items
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('candidate_id');
    localStorage.removeItem('backend_candidate_id');
    
    // Remove auth header from axios
    const axios = (await import('axios')).default;
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
  };

  const userRole = user?.role || localStorage.getItem('user_role');
  const userName = user?.name || localStorage.getItem('user_name');

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      userRole,
      userName,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
