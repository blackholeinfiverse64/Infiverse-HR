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
      const storedRole = localStorage.getItem('user_role') || 'candidate';
      
      const authService = (await import('../services/authService')).default;
      const result = await authService.login(email, password, storedRole);
      
      if (result.success && result.token && result.user) {
        const token = result.token;
        
        // Validate token is not empty
        if (!token || token.trim() === '') {
          console.error('❌ AuthContext: Empty token received!');
          return { error: 'Invalid token received from server' };
        }
        
        // Extract role from JWT token (token contains role in payload)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = payload.role || result.user.role || 'candidate';
          
          // Store the JWT token FIRST - this is critical
          console.log('🔐 AuthContext: Storing auth token');
          localStorage.setItem('auth_token', token);
          
          // Verify token was stored
          const storedToken = localStorage.getItem('auth_token');
          if (!storedToken || storedToken !== token) {
            console.error('❌ AuthContext: Failed to store token! Trying direct storage...');
            // Try direct storage as fallback
            localStorage.setItem('auth_token', token);
          } else {
            console.log('✅ AuthContext: Token stored successfully');
          }
          
          localStorage.setItem('user_data', JSON.stringify(result.user));
          localStorage.setItem('user_role', role);  // Store role from token
          localStorage.setItem('user_email', result.user.email || email);
          localStorage.setItem('user_name', result.user.name || '');
          localStorage.setItem('isAuthenticated', 'true');
          
          // Update user object with role
          const userWithRole = { ...result.user, role };
          setUser(userWithRole);
        } catch (tokenError) {
          console.error('❌ AuthContext: Error parsing token:', tokenError);
          // If token parsing fails, use role from user object or default
          const role = result.user.role || 'candidate';
          
          // Still store the token even if parsing fails
          console.log('🔐 AuthContext: Storing token (parsing failed but storing anyway)');
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(result.user));
          localStorage.setItem('user_role', role);
          setUser(result.user);
        }
        
        // Set the auth token in axios defaults
        const axios = (await import('axios')).default;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { error: null };
      } else {
        console.error('❌ AuthContext: Login failed - no token or user in result:', result);
        return { error: result.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Login failed' };
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
        // Store user data and role
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
        
        // Don't auto-login - just return success so AuthPage can redirect
        return { error: null, user: result.user };
      } else {
        return { error: result.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'Registration failed' };
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
