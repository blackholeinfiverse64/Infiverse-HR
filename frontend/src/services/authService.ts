import axios from 'axios';

// Define types for user and auth response
interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: string; // 'candidate' | 'recruiter' | 'client'
  company?: string; // For recruiter/client
  phone?: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

class AuthService {
  private API_BASE_URL: string;
  private TOKEN_KEY = 'auth_token';
  private USER_KEY = 'user_data';

  constructor() {
    this.API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }

  // Login user and store JWT token - supports candidate, recruiter, and client
  async login(email: string, password: string, role?: string): Promise<AuthResponse> {
    try {
      // Determine role from parameter or localStorage
      const userRole = role || localStorage.getItem('user_role') || 'candidate';
      
      let response;
      
      if (userRole === 'client') {
        // Client login requires client_id (stored in localStorage during signup)
        const storedUserData = this.getUserData();
        const client_id = localStorage.getItem('client_id') || storedUserData?.id || null;
        
        // Try client login first (if we have client_id)
        if (client_id) {
          try {
            response = await axios.post(`${this.API_BASE_URL}/v1/client/login`, {
              client_id: client_id,
              password: password
            });
            
            if (response.data.success && response.data.access_token) {
              const userData = {
                id: response.data.client_id,
                email: email,
                name: response.data.company_name || '',
                role: 'client',
                company: response.data.company_name
              };
              this.setAuthToken(response.data.access_token);
              localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
              return {
                success: true,
                token: response.data.access_token,
                user: userData
              };
            }
          } catch (clientError: any) {
            // If client login fails, fall back to candidate login
            console.log('Client login failed, trying candidate login...');
          }
        }
      }
      
      // For recruiter and candidate (or client fallback), use candidate login
      // Backend candidate login works for both candidates and recruiters (stored as candidates)
      response = await axios.post(`${this.API_BASE_URL}/v1/candidate/login`, {
        email,
        password
      });

      // Backend returns 'candidate' but we need to set correct role
      if (response.data.token && response.data.success) {
        const userData = response.data.candidate || response.data.user;
        
        // Override role from localStorage if available (for recruiter)
        const actualRole = userRole === 'recruiter' ? 'recruiter' : (userData.role || 'candidate');
        const userWithRole = { ...userData, role: actualRole };
        
        this.setAuthToken(response.data.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(userWithRole));
        
        return {
          success: true,
          token: response.data.token,
          user: userWithRole
        };
      }

      // Handle error response
      if (response.data.error) {
        return { success: false, error: response.data.error };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  }

  // Register new user - supports candidate, recruiter, and client
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const role = userData.role || 'candidate';
      
      let response;
      
      if (role === 'client') {
        // Client registration requires client_id and company_name
        const client_id = userData.email.split('@')[0] + '_' + Date.now(); // Generate client_id from email
        
        response = await axios.post(`${this.API_BASE_URL}/v1/client/register`, {
          client_id: client_id,
          company_name: userData.company || userData.name + "'s Company",
          contact_email: userData.email,
          password: userData.password
        });
        
        // Client registration successful - don't auto-login, just return success
        if (response.data.success) {
          const final_client_id = response.data.client_id || client_id;
          
          // Store client_id in localStorage for login
          localStorage.setItem('client_id', final_client_id);
          
          // Store role for later login
          const userObj = {
            id: final_client_id,
            email: userData.email,
            name: userData.name,
            role: 'client',
            company: userData.company
          };
          
          return {
            success: true,
            user: userObj,
            // Note: Client login uses client_id, not email - stored in localStorage
          };
        }
      } else if (role === 'recruiter') {
        // Recruiter registration - use candidate endpoint for now (backend doesn't have recruiter endpoint)
        // TODO: Create /v1/recruiter/register endpoint in backend
        response = await axios.post(`${this.API_BASE_URL}/v1/candidate/register`, {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          phone: userData.phone || '',
          location: '',
          experience_years: 0,
          technical_skills: '',
          education_level: '',
          seniority_level: ''
        });
        
        // Registration successful - store role but don't auto-login
        if (response.data.success) {
          const userObj = {
            id: response.data.candidate_id || '',
            email: userData.email,
            name: userData.name,
            role: 'recruiter' // Override role from candidate registration
          };
          
          return {
            success: true,
            user: userObj
          };
        }
      } else {
        // Candidate registration (default)
        response = await axios.post(`${this.API_BASE_URL}/v1/candidate/register`, {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          phone: userData.phone || '',
          location: '',
          experience_years: 0,
          technical_skills: '',
          education_level: '',
          seniority_level: ''
        });
        
        // Registration successful - store role but don't auto-login
        if (response.data.success) {
          const userObj = {
            id: response.data.candidate_id || '',
            email: userData.email,
            name: userData.name,
            role: 'candidate'
          };
          
          return {
            success: true,
            user: userObj
          };
        }
      }

      // Handle error response
      if (response.data.error || !response.data.success) {
        const errorMsg = response.data.error || 'Registration failed';
        return { success: false, error: errorMsg };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error: any) {
      console.error('Registration error:', error);
      // Handle duplicate email error
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Registration failed';
      
      // Check for email already registered error
      if (errorMsg.includes('already registered') || 
          errorMsg.includes('Email already registered') ||
          errorMsg.includes('already exists')) {
        return { success: false, error: 'This email is already registered. Please use a different email or login instead.' };
      }
      
      return { 
        success: false, 
        error: errorMsg
      };
    }
  }

  // Logout user and clear stored data
  logout(): void {
    this.removeAuthToken();
    localStorage.removeItem(this.USER_KEY);
  }

  // Get stored JWT token
  getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Set JWT token in localStorage and axios defaults
  setAuthToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Remove JWT token from storage and axios defaults
  removeAuthToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  // Get stored user data
  getUserData(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }


}

export default new AuthService();