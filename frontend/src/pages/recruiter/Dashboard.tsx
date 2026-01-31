import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getJobs, getRecruiterStats, getCandidatesByJob, getAllInterviews, getAllOffers, type Job, type RecruiterStats } from '../../services/api'
import StatsCard from '../../components/StatsCard'
import Table from '../../components/Table'
import Loading from '../../components/Loading'

// Component to display jobs with applicant counts; stats come from parent (single source, no duplicate fetches)
function JobTableWithStats({
  jobs,
  jobStats,
  loading
}: {
  jobs: Job[]
  jobStats: Record<string, { applicants: number; shortlisted: number }>
  loading: boolean
}) {
  return (
    <Table
      columns={['Job Title', 'Department', 'Location', 'Type', 'Applicants', 'Shortlisted', 'Actions']}
      data={jobs}
      renderRow={(job) => {
        const stats = jobStats[job.id] || { applicants: 0, shortlisted: 0 }
        const isLoading = loading
        return (
          <>
            <td className="font-semibold text-gray-900 dark:text-white">{job.title}</td>
            <td className="text-gray-600 dark:text-gray-400">{job.department}</td>
            <td className="text-gray-600 dark:text-gray-400">{job.location}</td>
            <td>
              <span className={`badge ${
                job.job_type === 'Remote' || job.job_type === 'remote' ? 'badge-success' :
                job.job_type === 'On-site' || job.job_type === 'on-site' ? 'badge-info' :
                'badge-purple'
              }`}>
                {job.job_type || job.employment_type || 'Full-time'}
              </span>
            </td>
            <td>
              {isLoading ? (
                <span className="text-gray-400 text-sm">Loading...</span>
              ) : (
                <span className="font-semibold text-gray-900 dark:text-white">{stats.applicants}</span>
              )}
            </td>
            <td>
              {isLoading ? (
                <span className="text-gray-400 text-sm">Loading...</span>
              ) : (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.shortlisted}</span>
              )}
            </td>
            <td>
              <Link
                to={`/recruiter/screening?jobId=${job.id}`}
                className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
              >
                View
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </td>
          </>
        )
      }}
    />
  )
}

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobStats, setJobStats] = useState<Record<string, { applicants: number; shortlisted: number }>>({})
  const [stats, setStats] = useState<RecruiterStats>({
    total_jobs: 0,
    total_applicants: 0,
    shortlisted: 0,
    interviewed: 0,
    offers_sent: 0,
    hired: 0
  })
  const [loading, setLoading] = useState(true)
  const loadingRef = useRef(false)

  useEffect(() => {
    loadDashboardData()
    // Auto-refresh every 60s; skip if previous load still in progress to avoid overlapping
    // match requests and agent overload during extended run.
    const interval = setInterval(() => {
      if (!loadingRef.current) loadDashboardData()
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    if (loadingRef.current) return
    try {
      loadingRef.current = true
      setLoading(true)
      
      // Load all data in parallel for accurate stats
      const [jobsData, statsData, interviewsData, offersData] = await Promise.all([
        getJobs().catch(() => []),
        getRecruiterStats().catch(() => null),
        getAllInterviews().catch(() => []),
        getAllOffers().catch(() => [])
      ])
      
      setJobs(jobsData)

      // Single fetch for per-job applicant counts (first 10 jobs); used for table and aggregate stats
      const perJob: Record<string, { applicants: number; shortlisted: number }> = {}
      let totalApplicants = 0
      let totalShortlisted = 0
      for (const job of jobsData.slice(0, 10)) {
        try {
          const candidates = await getCandidatesByJob(job.id)
          const applicants = candidates.length
          const shortlisted = candidates.filter((c: any) => c.status === 'shortlisted' || (c.score != null && c.score >= 80)).length
          perJob[job.id] = { applicants, shortlisted }
          totalApplicants += applicants
          totalShortlisted += shortlisted
        } catch {
          perJob[job.id] = { applicants: 0, shortlisted: 0 }
        }
      }
      setJobStats(perJob)

      if (statsData && statsData.total_applicants > 0) {
        setStats(statsData)
      } else {
        setStats({
          total_jobs: jobsData.length,
          total_applicants: totalApplicants,
          shortlisted: totalShortlisted,
          interviewed: interviewsData.filter(i => i.status === 'scheduled' || i.status === 'completed').length,
          offers_sent: offersData.length,
          hired: offersData.filter(o => o.status === 'accepted').length
        })
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to connect to backend API')
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }

  // Calculate stats from jobs if backend stats unavailable
  // Also fetch candidates for each job to get accurate applicant counts
  const totalApplicants = stats.total_applicants || jobs.reduce((sum, job: any) => sum + (job.applicants || 0), 0)
  const totalShortlisted = stats.shortlisted || jobs.reduce((sum, job: any) => sum + (job.shortlisted || 0), 0)
  const totalInterviewed = stats.interviewed || jobs.reduce((sum, job: any) => sum + (job.interviewed || 0), 0)
  const totalOffers = stats.offers_sent || jobs.reduce((sum, job: any) => sum + (job.offers || 0), 0)
  const totalJobs = stats.total_jobs || jobs.length

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 backdrop-blur-xl border border-green-300/20 dark:border-green-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">Recruiter Console</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Manage jobs and track applicants efficiently</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
            title="Refresh data"
          >
            <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          <Link to="/recruiter/create-job" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 sm:px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 text-sm sm:text-base">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Job</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard
          title="Total Jobs"
          value={totalJobs}
          color="blue"
          trend={{ value: jobs.length, label: 'active jobs' }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Applicants"
          value={totalApplicants}
          color="green"
          trend={{ value: totalShortlisted, label: 'shortlisted' }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Shortlisted"
          value={totalShortlisted}
          color="emerald"
          trend={{ value: totalInterviewed, label: 'interviewed' }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Interviewed"
          value={totalInterviewed}
          color="amber"
          trend={{ value: totalOffers, label: 'offers sent' }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Offers Sent"
          value={totalOffers}
          color="purple"
          trend={{ value: stats.hired || 0, label: 'hired' }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      </div>

      {/* Jobs Table Section */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-heading font-bold text-gray-900 dark:text-white mb-1">Active Job Openings</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{jobs.length} jobs currently active</p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Link to="/recruiter/automation" className="btn-outline text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-none flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">Automation</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <Loading message="Loading jobs..." />
        ) : (
          <JobTableWithStats jobs={jobs} jobStats={jobStats} loading={loading} />
        )}
      </div>
    </div>
  )
}
