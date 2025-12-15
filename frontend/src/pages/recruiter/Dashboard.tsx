import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getJobs, getRecruiterStats, type Job, type RecruiterStats } from '../../services/api'
import StatsCard from '../../components/StatsCard'
import Table from '../../components/Table'
import Loading from '../../components/Loading'

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [stats, setStats] = useState<RecruiterStats>({
    total_jobs: 0,
    total_applicants: 0,
    shortlisted: 0,
    interviewed: 0,
    offers_sent: 0,
    hired: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load jobs and stats in parallel
      const [jobsData, statsData] = await Promise.all([
        getJobs().catch(() => []),
        getRecruiterStats().catch(() => ({
          total_jobs: 0,
          total_applicants: 0,
          shortlisted: 0,
          interviewed: 0,
          offers_sent: 0,
          hired: 0
        }))
      ])
      
      setJobs(jobsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to connect to backend API')
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from jobs if backend stats unavailable
  const totalApplicants = stats.total_applicants || jobs.reduce((sum, job: any) => sum + (job.applicants || 0), 0)
  const totalShortlisted = stats.shortlisted || jobs.reduce((sum, job: any) => sum + (job.shortlisted || 0), 0)
  const totalInterviewed = stats.interviewed || jobs.reduce((sum, job: any) => sum + (job.interviewed || 0), 0)
  const totalOffers = stats.offers_sent || jobs.reduce((sum, job: any) => sum + (job.offers || 0), 0)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">Recruiter Console</h1>
          <p className="page-subtitle">Manage jobs and track applicants efficiently</p>
        </div>
        <Link to="/recruiter/create-job" className="btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New Job</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applicants"
          value={totalApplicants}
          color="blue"
          trend={{ value: 12, label: 'vs last month' }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Shortlisted"
          value={totalShortlisted}
          color="green"
          trend={{ value: 8, label: 'vs last month' }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Interviewed"
          value={totalInterviewed}
          color="yellow"
          trend={{ value: -3, label: 'vs last month' }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
        />
        <StatsCard
          title="Offers Sent"
          value={totalOffers}
          color="purple"
          trend={{ value: 25, label: 'vs last month' }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      </div>

      {/* Jobs Table Section */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="section-title mb-1">Active Job Openings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{jobs.length} jobs currently active</p>
          </div>
          <div className="flex gap-3">
            <Link to="/recruiter/automation" className="btn-outline text-sm h-10">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Automation
            </Link>
          </div>
        </div>

        {loading ? (
          <Loading message="Loading jobs..." />
        ) : (
          <Table
            columns={['Job Title', 'Department', 'Location', 'Type', 'Applicants', 'Shortlisted', 'Actions']}
            data={jobs}
            renderRow={(job) => (
              <>
                <td className="font-semibold text-gray-900 dark:text-white">{job.title}</td>
                <td className="text-gray-600 dark:text-gray-400">{job.department}</td>
                <td className="text-gray-600 dark:text-gray-400">{job.location}</td>
                <td>
                  <span className={`badge ${
                    job.jobType === 'Remote' ? 'badge-success' :
                    job.jobType === 'On-site' ? 'badge-info' :
                    'badge-purple'
                  }`}>
                    {job.jobType}
                  </span>
                </td>
                <td>
                  <span className="font-semibold text-gray-900 dark:text-white">{job.applicants}</span>
                </td>
                <td>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{job.shortlisted}</span>
                </td>
                <td>
                  <Link
                    to={`/recruiter/applicants/${job.id}`}
                    className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                  >
                    View
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </td>
              </>
            )}
          />
        )}
      </div>
    </div>
  )
}
