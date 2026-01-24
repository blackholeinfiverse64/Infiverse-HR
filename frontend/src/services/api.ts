import axios from 'axios'

// API Base URL - Gateway service
// Default to localhost for local development, use env var or Render URL for production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:8000' : 'https://bhiv-hr-gateway-l0xp.onrender.com')

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Use JWT token for authentication
api.interceptors.request.use(
  async (config) => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log errors for debugging
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.config?.url}`)
    } else if (error.request) {
      // Network error - no response received
      console.error(`Network Error: Unable to reach API at ${error.config?.baseURL}${error.config?.url}`)
      // Add a more descriptive error message
      error.message = error.message || `Cannot connect to server. Please ensure the backend is running at ${error.config?.baseURL}`
      error.isNetworkError = true
    } else {
      console.error('API Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// ==================== CANDIDATE AUTH API ====================

export interface CandidateLoginRequest {
  email: string
  password?: string
}

export interface CandidateRegisterRequest {
  name: string
  email: string
  password?: string
  phone?: string
  skills?: string[]
  experience_years?: number
  education?: string
  location?: string
}

export interface CandidateProfile {
  id: string
  name: string
  email: string
  phone?: string
  skills: string[]
  experience_years?: number
  totalExperience?: number
  education?: string
  educationLevel?: string
  education_level?: string  // Backend field name
  technical_skills?: string  // Backend field name
  seniority_level?: string  // Backend field name
  location?: string
  resume_url?: string
  resume_path?: string  // Backend field name
  expectedSalary?: number
  currentSalary?: number
  values_score?: {
    integrity: number
    honesty: number
    discipline: number
    hardWork: number
    gratitude: number
  }
}

export const candidateLogin = async (data: CandidateLoginRequest) => {
  try {
    const response = await api.post('/v1/candidate/login', data)
    if (response.data.success) {
      localStorage.setItem('auth_token', response.data.token || '')
      localStorage.setItem('candidate_id', response.data.candidate_id)
      // Also store as backend_candidate_id for consistency
      if (response.data.candidate_id) {
        localStorage.setItem('backend_candidate_id', response.data.candidate_id.toString())
      }
      localStorage.setItem('user_name', response.data.name || '')
      localStorage.setItem('user_email', data.email)
    }
    return response.data
  } catch (error) {
    console.error('Candidate login error:', error)
    throw error
  }
}

export const candidateRegister = async (data: CandidateRegisterRequest) => {
  try {
    const response = await api.post('/v1/candidate/register', data)
    // Store the backend candidate_id if registration successful
    if (response.data.candidate_id) {
      localStorage.setItem('backend_candidate_id', response.data.candidate_id.toString())
    }
    return response.data
  } catch (error) {
    console.error('Candidate registration error:', error)
    throw error
  }
}

// Helper to get or create backend candidate ID
export const getOrCreateBackendCandidateId = async (): Promise<string | null> => {
  // Check if we already have a backend candidate_id stored
  const storedId = localStorage.getItem('backend_candidate_id')
  if (storedId) {
    return storedId
  }

  // Get user info from localStorage (stored after JWT login)
  const userEmail = localStorage.getItem('user_email');
  const userName = localStorage.getItem('user_name') || 'User';
  
  if (!userEmail) {
    console.warn('No authenticated user email found');
    return null;
  }

  // First, try to get existing candidate by email (check if profile exists)
  try {
    // Try to get candidate profile - if it exists, we can extract the ID
    // We'll search through candidates endpoint or try to find by email
    const candidatesResponse = await api.get(`/v1/candidates?search=${encodeURIComponent(userEmail)}`)
    if (candidatesResponse.data?.candidates?.length > 0) {
      const candidate = candidatesResponse.data.candidates.find((c: any) => c.email === userEmail)
      if (candidate && candidate.id) {
        localStorage.setItem('backend_candidate_id', candidate.id.toString())
        return candidate.id.toString()
      }
    }
  } catch (searchError) {
    console.log('Could not find candidate by search, will try other methods')
  }

  // Try to create a candidate using the JWT authenticated user data
  // Note: Backend requires password, so we'll use a default password
  // In production, this should be handled differently
  try {
    const response = await api.post('/v1/candidate/register', {
      name: userName,
      email: userEmail,
      password: 'temp_password_123', // Temporary password - user should update profile
      phone: '',
      location: '',
      experience_years: 0,
      technical_skills: '',
      education_level: '',
      seniority_level: '',
    });
    
    // Check if registration was successful
    if (response.data.success !== false && response.data.candidate_id) {
      localStorage.setItem('backend_candidate_id', response.data.candidate_id.toString());
      return response.data.candidate_id.toString();
    }
    
    // If email already exists, try to get candidate ID from error or try login
    if (response.data.error && response.data.error.includes('already registered')) {
      // Email exists, try to get candidate by trying login with a dummy password
      // Or better: try to find candidate by email through profile endpoint
      console.log('Email already registered, trying to find existing candidate...')
      return await findCandidateByEmail(userEmail)
    }
    
    return null;
  } catch (error: any) {
    console.error('Error creating backend candidate:', error);
    
    // If registration failed due to email exists (422 or error message)
    if (error?.response?.status === 422 || 
        error?.response?.data?.error?.includes('already registered') ||
        error?.response?.data?.success === false) {
      console.log('Email already exists, trying to find candidate...')
      return await findCandidateByEmail(userEmail)
    }
    
    return null;
  }
}

// Helper to find candidate by email
async function findCandidateByEmail(email: string): Promise<string | null> {
  try {
    // Try to get candidates and find by email
    // The endpoint returns paginated results, so we might need to check multiple pages
    // For now, try first page (50 candidates)
    const response = await api.get('/v1/candidates?limit=100')
    if (response.data?.candidates) {
      const candidate = response.data.candidates.find((c: any) => c.email === email)
      if (candidate && candidate.id) {
        console.log('Found existing candidate by email:', candidate.id)
        localStorage.setItem('backend_candidate_id', candidate.id.toString())
        return candidate.id.toString()
      }
    }
    
    // If not found in first page, candidate might not exist yet
    // User needs to complete profile to create candidate record
    console.warn('Could not find candidate by email. User may need to complete profile setup.')
    return null
  } catch (error) {
    console.error('Error finding candidate by email:', error)
    return null
  }
}

// ==================== JOBS API ====================

export interface Job {
  id: string
  title: string
  department?: string
  location: string
  job_type: string
  experience_required: string
  salary_min?: number
  salary_max?: number
  skills_required: string[] | string
  description: string
  status: string
  created_at?: string
  company?: string
}

export interface JobFilters {
  skills?: string
  location?: string
  experience?: string
  job_type?: string
  search?: string
}

export const getJobs = async (filters?: JobFilters): Promise<Job[]> => {
  try {
    const params = new URLSearchParams()
    if (filters?.skills) params.append('skills', filters.skills)
    if (filters?.location) params.append('location', filters.location)
    if (filters?.experience) params.append('experience', filters.experience)
    if (filters?.job_type) params.append('job_type', filters.job_type)
    if (filters?.search) params.append('search', filters.search)
    
    const response = await api.get(`/v1/jobs?${params.toString()}`)
    return response.data.jobs || response.data || []
  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }
}

export const getJobById = async (jobId: string): Promise<Job> => {
  try {
    const response = await api.get(`/v1/jobs/${jobId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching job:', error)
    throw error
  }
}

export const createJob = async (jobData: Partial<Job>) => {
  try {
    const response = await api.post('/v1/jobs', jobData)
    return response.data
  } catch (error) {
    console.error('Error creating job:', error)
    throw error
  }
}

// ==================== CANDIDATE APPLICATIONS API ====================

export interface Application {
  id: string
  job_id: string
  candidate_id: string
  job_title: string
  company?: string
  status: 'applied' | 'screening' | 'shortlisted' | 'interview' | 'offer' | 'rejected' | 'hired'
  match_score?: number
  applied_date: string
  updated_at?: string
}

export const applyForJob = async (jobId: string, candidateId: string, resumeUrl?: string) => {
  try {
    // Use backend candidate_id if available (integer), otherwise use the provided ID
    const backendCandidateId = localStorage.getItem('backend_candidate_id') || candidateId
    
    const response = await api.post('/v1/candidate/apply', {
      job_id: jobId,
      candidate_id: backendCandidateId,
      resume_url: resumeUrl
    })
    return response.data
  } catch (error: any) {
    // If 422 error (UUID vs integer issue), provide helpful message
    if (error?.response?.status === 422) {
      console.error('Apply failed: Backend requires registered candidate. Please complete profile setup.')
      throw new Error('Please complete your profile setup before applying for jobs.')
    }
    console.error('Error applying for job:', error)
    throw error
  }
}

export const getCandidateApplications = async (candidateId: string): Promise<Application[]> => {
  try {
    console.log('Fetching applications for candidate_id:', candidateId)
    const response = await api.get(`/v1/candidate/applications/${candidateId}`)
    console.log('Applications API response:', response.data)
    const applications = response.data.applications || response.data || []
    console.log('Parsed applications:', applications)
    return applications
  } catch (error: any) {
    console.error('Error fetching applications:', error)
    // Handle 401 (authentication error)
    if (error?.response?.status === 401) {
      console.warn('Authentication failed when fetching applications. Token may be expired.')
      // Optionally clear invalid token
      localStorage.removeItem('auth_token')
      return []
    }
    // Handle 403 (forbidden)
    if (error?.response?.status === 403) {
      console.warn('Access denied: Cannot view applications')
      return []
    }
    // Handle 422 error (invalid candidate_id format)
    if (error?.response?.status === 422) {
      console.warn('Applications: Invalid candidate_id format.')
      return []
    }
    // Handle 404 (no applications found)
    if (error?.response?.status === 404) {
      console.log('No applications found (404)')
      return []
    }
    return []
  }
}

// ==================== CANDIDATE PROFILE API ====================

export const getCandidateProfile = async (candidateId: string): Promise<CandidateProfile | null> => {
  try {
    // Use the candidate portal endpoint which accepts JWT tokens
    const response = await api.get(`/v1/candidate/profile/${candidateId}`)
    // Backend returns candidate object directly or { error: "..." }
    if (response.data.error) {
      console.warn('Backend returned error:', response.data.error)
      return null
    }
    // The endpoint returns the candidate object directly (not wrapped in { candidate: {...} })
    return response.data
  } catch (error: any) {
    // Handle 401 (authentication error)
    if (error?.response?.status === 401) {
      console.warn('Authentication failed. Token may be expired or invalid.')
      // Optionally clear invalid token
      localStorage.removeItem('auth_token')
      return null
    }
    // Handle 403 (forbidden - trying to access another candidate's profile)
    if (error?.response?.status === 403) {
      console.warn('Access denied: You can only view your own profile')
      return null
    }
    // Handle 422 (UUID vs integer mismatch) or 404 (not found)
    if (error?.response?.status === 422 || error?.response?.status === 404) {
      console.warn('Candidate profile not found or invalid ID format')
      return null
    }
    console.error('Error fetching candidate profile:', error)
    return null
  }
}

export const updateCandidateProfile = async (candidateId: string, data: Partial<CandidateProfile>) => {
  try {
    const response = await api.put(`/v1/candidate/profile/${candidateId}`, data)
    return response.data
  } catch (error: any) {
    // Handle 422 (UUID vs integer mismatch)
    if (error?.response?.status === 422) {
      console.warn('Cannot update profile: Backend expects integer candidate_id')
      return { error: 'Profile update not available. Please complete registration.' }
    }
    console.error('Error updating candidate profile:', error)
    throw error
  }
}

export const getCandidatesByJob = async (jobId: string) => {
  try {
    const response = await api.get(`/v1/match/${jobId}/top`)
    return response.data.matches || response.data || []
  } catch (error) {
    console.error('Error fetching candidates:', error)
    throw error
  }
}

// ==================== INTERVIEWS API ====================

export interface Interview {
  id: string
  candidate_id: string
  job_id: string
  job_title?: string
  company?: string
  scheduled_date: string
  scheduled_time?: string
  interview_type: string
  meeting_link?: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  notes?: string
}

export const getInterviews = async (candidateId?: string): Promise<Interview[]> => {
  try {
    const params = candidateId ? `?candidate_id=${candidateId}` : ''
    const response = await api.get(`/v1/interviews${params}`)
    return response.data.interviews || response.data || []
  } catch (error: any) {
    // Handle errors gracefully - return empty array
    if (error?.response?.status === 404 || error?.response?.status === 422) {
      return []
    }
    console.error('Error fetching interviews:', error)
    return []
  }
}

export const getAllInterviews = async (): Promise<Interview[]> => {
  try {
    const response = await api.get('/v1/interviews')
    return response.data.interviews || response.data || []
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return []
    }
    console.error('Error fetching all interviews:', error)
    return []
  }
}

export const scheduleInterview = async (data: Partial<Interview>) => {
  try {
    const response = await api.post('/v1/interviews', data)
    return response.data
  } catch (error) {
    console.error('Error scheduling interview:', error)
    throw error
  }
}

// ==================== FEEDBACK API ====================

export interface Feedback {
  id: string
  candidate_id: string
  job_id?: string
  job_title?: string
  interviewer_name?: string
  feedback_text: string
  rating?: number
  values_assessment?: {
    integrity: number
    honesty: number
    discipline: number
    hardWork: number
    gratitude: number
  }
  decision?: 'accept' | 'reject' | 'hold'
  created_at: string
}

export const getCandidateFeedback = async (candidateId: string): Promise<Feedback[]> => {
  try {
    const response = await api.get(`/v1/feedback?candidate_id=${candidateId}`)
    return response.data.feedback || response.data || []
  } catch (error: any) {
    // Handle errors gracefully - return empty array
    if (error?.response?.status === 404 || error?.response?.status === 422) {
      return []
    }
    console.error('Error fetching feedback:', error)
    return []
  }
}

export const submitFeedback = async (candidateId: string, feedbackData: Partial<Feedback>) => {
  try {
    const response = await api.post('/v1/feedback', {
      candidate_id: candidateId,
      ...feedbackData
    })
    return response.data
  } catch (error) {
    console.error('Error submitting feedback:', error)
    throw error
  }
}

// ==================== TASKS API ====================

export interface Task {
  id: string
  candidate_id: string
  job_id: string
  job_title?: string
  title: string
  description: string
  deadline: string
  status: 'pending' | 'in_progress' | 'submitted' | 'reviewed'
  submission_url?: string
}

export const getTasks = async (candidateId: string): Promise<Task[]> => {
  try {
    const response = await api.get(`/v1/tasks?candidate_id=${candidateId}`)
    return response.data.tasks || response.data || []
  } catch (error: any) {
    // Tasks endpoint doesn't exist on backend - return empty array
    if (error?.response?.status === 404) {
      console.warn('Tasks endpoint not available on backend')
      return []
    }
    console.error('Error fetching tasks:', error)
    return []
  }
}

export const submitTask = async (taskId: string, submissionUrl: string) => {
  try {
    const response = await api.put(`/v1/tasks/${taskId}/submit`, { submission_url: submissionUrl })
    return response.data
  } catch (error) {
    console.error('Error submitting task:', error)
    throw error
  }
}

// ==================== OFFERS API ====================

export interface Offer {
  id: string
  candidate_id: string
  job_id: string
  job_title?: string
  company?: string
  salary_offered: number
  joining_date?: string
  status: 'pending' | 'accepted' | 'rejected' | 'negotiating'
  created_at: string
}

export const getCandidateOffers = async (candidateId: string): Promise<Offer[]> => {
  try {
    const response = await api.get(`/v1/offers?candidate_id=${candidateId}`)
    return response.data.offers || response.data || []
  } catch (error) {
    console.error('Error fetching offers:', error)
    return []
  }
}

export const getAllOffers = async (): Promise<Offer[]> => {
  try {
    const response = await api.get('/v1/offers')
    return response.data.offers || response.data || []
  } catch (error) {
    console.error('Error fetching all offers:', error)
    return []
  }
}

export const respondToOffer = async (offerId: string, response: 'accepted' | 'rejected') => {
  try {
    const res = await api.put(`/v1/offers/${offerId}`, { status: response })
    return res.data
  } catch (error) {
    console.error('Error responding to offer:', error)
    throw error
  }
}

// ==================== AUTOMATION API ====================

export const triggerAutomation = async (type: string, data?: Record<string, unknown>) => {
  try {
    const response = await api.post('/v1/automation/trigger', { type, ...data })
    return response.data
  } catch (error) {
    console.error('Error triggering automation:', error)
    throw error
  }
}

// ==================== CANDIDATE ACTIONS API ====================

export const shortlistCandidate = async (jobId: string, candidateId: string) => {
  try {
    const response = await api.post(`/v1/jobs/${jobId}/shortlist`, { candidate_id: candidateId })
    return response.data
  } catch (error) {
    console.error('Error shortlisting candidate:', error)
    throw error
  }
}

export const rejectCandidate = async (jobId: string, candidateId: string) => {
  try {
    const response = await api.post(`/v1/jobs/${jobId}/reject`, { candidate_id: candidateId })
    return response.data
  } catch (error) {
    console.error('Error rejecting candidate:', error)
    throw error
  }
}

export const assignTask = async (jobId: string, candidateId: string, taskData: Partial<Task>) => {
  try {
    const response = await api.post('/v1/tasks', {
      job_id: jobId,
      candidate_id: candidateId,
      ...taskData
    })
    return response.data
  } catch (error) {
    console.error('Error assigning task:', error)
    throw error
  }
}

// ==================== DASHBOARD STATS API ====================

export interface DashboardStats {
  total_applications: number
  interviews_scheduled: number
  profile_views: number
  shortlisted: number
  offers_received: number
}

export const getCandidateDashboardStats = async (candidateId: string): Promise<DashboardStats> => {
  try {
    // Try to get stats from dedicated endpoint, fallback to computing from other endpoints
    const response = await api.get(`/v1/candidate/stats/${candidateId}`)
    return response.data
  } catch {
    // Compute stats from other endpoints if dedicated endpoint doesn't exist
    try {
      const [applications, interviews, offers] = await Promise.all([
        getCandidateApplications(candidateId),
        getInterviews(candidateId),
        getCandidateOffers(candidateId)
      ])
      
      return {
        total_applications: applications.length,
        interviews_scheduled: interviews.filter(i => i.status === 'scheduled').length,
        profile_views: 0,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
        offers_received: offers.length
      }
    } catch {
      return {
        total_applications: 0,
        interviews_scheduled: 0,
        profile_views: 0,
        shortlisted: 0,
        offers_received: 0
      }
    }
  }
}

// ==================== AI MATCHING ENGINE API ====================

export interface MatchResult {
  candidate_id: string
  candidate_name: string
  email: string
  match_score: number
  skills_match: number
  experience_match: number
  location_match: number
  values_score?: number
  matched_skills: string[]
  missing_skills: string[]
  recommendation: string
}

export interface MatchingStats {
  total_candidates: number
  avg_match_score: number
  high_matches: number
  medium_matches: number
  low_matches: number
}

export const getTopMatches = async (jobId: string, limit: number = 10): Promise<MatchResult[]> => {
  try {
    const response = await api.get(`/v1/match/${jobId}/top?limit=${limit}`)
    return response.data.matches || response.data || []
  } catch (error) {
    console.error('Error fetching top matches:', error)
    throw error
  }
}

export const runBatchMatching = async (jobId: string, candidateIds?: string[]) => {
  try {
    const response = await api.post('/v1/match/batch', {
      job_id: jobId,
      candidate_ids: candidateIds
    })
    return response.data
  } catch (error) {
    console.error('Error running batch matching:', error)
    throw error
  }
}

// ==================== ANALYTICS API ====================

export interface SystemStats {
  total_candidates: number
  total_jobs: number
  total_applications: number
  total_interviews: number
  hiring_rate: number
  avg_time_to_hire: number
}

export interface SkillsAnalytics {
  skill: string
  count: number
  demand: number
}

export interface HiringFunnel {
  stage: string
  count: number
  percentage: number
}

export const getSystemStats = async (): Promise<SystemStats> => {
  try {
    const response = await api.get('/v1/candidates/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching system stats:', error)
    // Return mock data for development
    return {
      total_candidates: 0,
      total_jobs: 0,
      total_applications: 0,
      total_interviews: 0,
      hiring_rate: 0,
      avg_time_to_hire: 0
    }
  }
}

export const getSkillsAnalytics = async (): Promise<SkillsAnalytics[]> => {
  try {
    const response = await api.get('/v1/analytics/skills')
    return response.data.skills || response.data || []
  } catch (error) {
    console.error('Error fetching skills analytics:', error)
    return []
  }
}

export const getHiringFunnel = async (): Promise<HiringFunnel[]> => {
  try {
    const response = await api.get('/v1/analytics/funnel')
    return response.data.funnel || response.data || []
  } catch (error) {
    console.error('Error fetching hiring funnel:', error)
    return []
  }
}

// ==================== RECRUITER API ====================

export interface RecruiterStats {
  total_jobs: number
  total_applicants: number
  shortlisted: number
  interviewed: number
  offers_sent: number
  hired: number
}

export const getRecruiterStats = async (): Promise<RecruiterStats> => {
  try {
    const response = await api.get('/v1/recruiter/stats')
    return response.data
  } catch {
    // Calculate from jobs if dedicated endpoint doesn't exist
    try {
      const jobs = await getJobs()
      return {
        total_jobs: jobs.length,
        total_applicants: jobs.reduce((sum: number, j: any) => sum + (j.applicants || 0), 0),
        shortlisted: jobs.reduce((sum: number, j: any) => sum + (j.shortlisted || 0), 0),
        interviewed: jobs.reduce((sum: number, j: any) => sum + (j.interviewed || 0), 0),
        offers_sent: jobs.reduce((sum: number, j: any) => sum + (j.offers || 0), 0),
        hired: jobs.reduce((sum: number, j: any) => sum + (j.hired || 0), 0)
      }
    } catch {
      return {
        total_jobs: 0,
        total_applicants: 0,
        shortlisted: 0,
        interviewed: 0,
        offers_sent: 0,
        hired: 0
      }
    }
  }
}

export const getAllCandidates = async (filters?: {
  skills?: string
  experience?: string
  location?: string
  search?: string
}) => {
  try {
    const params = new URLSearchParams()
    if (filters?.skills) params.append('skills', filters.skills)
    if (filters?.experience) params.append('experience', filters.experience)
    if (filters?.location) params.append('location', filters.location)
    if (filters?.search) params.append('search', filters.search)
    
    const response = await api.get(`/v1/candidates?${params.toString()}`)
    return response.data.candidates || response.data || []
  } catch (error) {
    console.error('Error fetching candidates:', error)
    throw error
  }
}

export const searchCandidates = async (query: string, filters?: {
  skills?: string[]
  min_experience?: number
  max_experience?: number
  location?: string
}) => {
  try {
    const response = await api.get('/v1/candidates/search', {
      params: { query, ...filters }
    })
    return response.data.candidates || response.data || []
  } catch (error) {
    console.error('Error searching candidates:', error)
    throw error
  }
}

// ==================== BULK UPLOAD API ====================

export interface BulkCandidate {
  name: string
  email: string
  cv_url?: string
  phone?: string
  experience_years?: number
  status?: string
  job_id: number
  location?: string
  technical_skills?: string
  designation?: string
  education_level?: string
}

export const bulkUploadCandidates = async (candidates: BulkCandidate[]) => {
  try {
    const response = await api.post('/v1/candidates/bulk', { candidates })
    return response.data
  } catch (error) {
    console.error('Error uploading candidates:', error)
    throw error
  }
}

// ==================== CLIENT PORTAL API ====================

export interface ShortlistedCandidate {
  id: string
  name: string
  email: string
  job_title: string
  match_score: number
  skills: string[]
  experience_years: number
  status: 'pending_review' | 'approved' | 'rejected'
  recruiter_notes?: string
}

export const getShortlistedCandidates = async (clientId?: string): Promise<ShortlistedCandidate[]> => {
  try {
    const params = clientId ? `?client_id=${clientId}` : ''
    const response = await api.get(`/v1/client/shortlist${params}`)
    return response.data.candidates || response.data || []
  } catch (error) {
    console.error('Error fetching shortlisted candidates:', error)
    return []
  }
}

export const reviewCandidate = async (candidateId: string, decision: 'approved' | 'rejected', notes?: string) => {
  try {
    const response = await api.post(`/v1/client/review/${candidateId}`, {
      decision,
      notes
    })
    return response.data
  } catch (error) {
    console.error('Error reviewing candidate:', error)
    throw error
  }
}

// ==================== HEALTH CHECK API ====================

export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health')
    return { healthy: true, data: response.data }
  } catch (error) {
    return { healthy: false, error }
  }
}

export const getDetailedHealth = async () => {
  try {
    const response = await api.get('/health/detailed')
    return response.data
  } catch (error) {
    console.error('Error fetching health status:', error)
    throw error
  }
}

export default api
