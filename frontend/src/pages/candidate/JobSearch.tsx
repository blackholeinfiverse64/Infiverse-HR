import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getJobs, applyForJob, getOrCreateBackendCandidateId, getCandidateApplications, type Job, type JobFilters } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function JobSearch() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set())
  
  // Filter states
  const [filters, setFilters] = useState<JobFilters>({
    skills: '',
    location: '',
    experience: '',
    job_type: '',
    search: ''
  })

  // Get backend candidate ID (integer) for API calls
  const backendCandidateId = localStorage.getItem('backend_candidate_id')
  const candidateId = backendCandidateId || user?.id || localStorage.getItem('candidate_id') || ''

  useEffect(() => {
    fetchJobs()
    fetchAppliedJobs()
  }, [backendCandidateId])

  const fetchAppliedJobs = async () => {
    if (!backendCandidateId) return
    try {
      const applications = await getCandidateApplications(backendCandidateId)
      const appliedIds = new Set(applications.map(app => app.job_id))
      setAppliedJobIds(appliedIds)
    } catch (error) {
      console.error('Error fetching applied jobs:', error)
    }
  }

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const activeFilters: JobFilters = {}
      if (filters.skills) activeFilters.skills = filters.skills
      if (filters.location) activeFilters.location = filters.location
      if (filters.experience) activeFilters.experience = filters.experience
      if (filters.job_type) activeFilters.job_type = filters.job_type
      if (filters.search) activeFilters.search = filters.search

      const data = await getJobs(Object.keys(activeFilters).length > 0 ? activeFilters : undefined)
      setJobs(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs()
  }

  const handleApply = async (job: Job) => {
    if (!candidateId && !user) {
      toast.error('Please login to apply for jobs')
      return
    }

    // Check if already applied
    if (appliedJobIds.has(job.id)) {
      toast.error('You have already applied for this job')
      return
    }

    setApplying(job.id)
    try {
      // Ensure we have a backend candidate ID before applying
      let actualCandidateId = localStorage.getItem('backend_candidate_id')
      if (user && !actualCandidateId) {
        actualCandidateId = await getOrCreateBackendCandidateId(user)
        if (!actualCandidateId) {
          toast.error('Please complete your profile setup before applying')
          setApplying(null)
          return
        }
      }
      
      await applyForJob(job.id, actualCandidateId || candidateId)
      toast.success(`Successfully applied for ${job.title}!`)
      
      // Add to applied jobs immediately
      setAppliedJobIds(prev => new Set([...prev, job.id]))
      setSelectedJob(null)
    } catch (error: any) {
      console.error('Error applying for job:', error)
      toast.error(error?.message || 'Failed to apply for job')
    } finally {
      setApplying(null)
    }
  }

  const clearFilters = () => {
    setFilters({
      skills: '',
      location: '',
      experience: '',
      job_type: '',
      search: ''
    })
  }

  const locations = ['Remote', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune']
  const experienceLevels = ['0-1', '1-3', '3-5', '5-8', '8+']
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-8 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10 backdrop-blur-xl border border-blue-300/20 dark:border-blue-500/20">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Find Your Dream Job</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Discover opportunities that match your skills and preferences</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs by title, skills, or company..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Skills Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills</label>
              <input
                type="text"
                placeholder="e.g., React, Python"
                value={filters.skills}
                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                {experienceLevels.map(exp => (
                  <option key={exp} value={exp}>{exp} years</option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Type</label>
              <select
                value={filters.job_type}
                onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Search Jobs
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          {loading ? 'Searching...' : `${jobs.length} jobs found`}
        </p>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{job.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{job.company || 'Company'}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {appliedJobIds.has(job.id) && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Applied
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {job.status || 'Active'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {job.job_type}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.experience_required}
                </span>
              </div>

              {/* Skills */}
              {job.skills_required && (Array.isArray(job.skills_required) ? job.skills_required.length > 0 : job.skills_required.length > 0) && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {(Array.isArray(job.skills_required) 
                    ? job.skills_required 
                    : (job.skills_required as string).split(',')
                  ).slice(0, 4).map((skill: string, index: number) => (
                    <span key={index} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                      {skill.trim()}
                    </span>
                  ))}
                  {(Array.isArray(job.skills_required) 
                    ? job.skills_required.length 
                    : (job.skills_required as string).split(',').length
                  ) > 4 && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-500 rounded text-xs">
                      +{(Array.isArray(job.skills_required) 
                        ? job.skills_required.length 
                        : (job.skills_required as string).split(',').length
                      ) - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Salary */}
              {(job.salary_min || job.salary_max) && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  ₹{job.salary_min?.toLocaleString() || 'N/A'} - ₹{job.salary_max?.toLocaleString() || 'N/A'} / year
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-slate-700">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="flex-1 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                >
                  View Details
                </button>
                {appliedJobIds.has(job.id) ? (
                  <button
                    disabled
                    className="flex-1 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium rounded-lg cursor-default"
                  >
                    Applied
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(job)}
                    disabled={applying === job.id}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
                  >
                    {applying === job.id ? 'Applying...' : 'Apply Now'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedJob.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedJob.company || 'Company'}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Job Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedJob.location}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Job Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedJob.job_type}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Experience</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedJob.experience_required}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedJob.department || 'N/A'}</p>
                </div>
              </div>

              {/* Salary */}
              {(selectedJob.salary_min || selectedJob.salary_max) && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Salary Range</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    ₹{selectedJob.salary_min?.toLocaleString()} - ₹{selectedJob.salary_max?.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Skills Required */}
              {selectedJob.skills_required && (Array.isArray(selectedJob.skills_required) ? selectedJob.skills_required.length > 0 : selectedJob.skills_required.length > 0) && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedJob.skills_required) 
                      ? selectedJob.skills_required 
                      : (selectedJob.skills_required as string).split(',')
                    ).map((skill: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Job Description</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{selectedJob.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Close
              </button>
              {appliedJobIds.has(selectedJob.id) ? (
                <button
                  disabled
                  className="flex-1 py-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium rounded-lg cursor-default"
                >
                  Already Applied
                </button>
              ) : (
                <button
                  onClick={() => handleApply(selectedJob)}
                  disabled={applying === selectedJob.id}
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
                >
                  {applying === selectedJob.id ? 'Applying...' : 'Apply for this Job'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
