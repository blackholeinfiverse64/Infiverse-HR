import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../../services/api'
import StatsCard from '../../components/StatsCard'
import Loading from '../../components/Loading'

export default function ClientDashboard() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const data = await getJobs()
      setJobs(data)
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalStats = {
    applicants: jobs.reduce((sum, job) => sum + job.applicants, 0),
    shortlisted: jobs.reduce((sum, job) => sum + job.shortlisted, 0),
    interviewed: jobs.reduce((sum, job) => sum + job.interviewed, 0),
    offers: jobs.reduce((sum, job) => sum + job.offers, 0),
    joined: jobs.reduce((sum, job) => sum + job.joined, 0),
  }

  if (loading) {
    return <Loading message="Loading dashboard..." />
  }

  return (
    <div>
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 backdrop-blur-xl border border-purple-300/20 dark:border-purple-500/20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Client Dashboard</h1>
        <p className="text-gray-400">Overview of all recruitment activities</p>
      </div>

      {/* Overall Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Overall Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <StatsCard
            title="Total Applicants"
            value={totalStats.applicants}
            color="blue"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Shortlisted"
            value={totalStats.shortlisted}
            color="green"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Interviewed"
            value={totalStats.interviewed}
            color="yellow"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            }
          />
          <StatsCard
            title="Offers Sent"
            value={totalStats.offers}
            color="purple"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatsCard
            title="Joined"
            value={totalStats.joined}
            color="green"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Job-wise Breakdown */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6">Job-wise Breakdown</h2>
        
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No active job openings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-6 border border-gray-600"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{job.title}</h3>
                    <p className="text-gray-400 text-sm">
                      {job.department} • {job.location} • {job.jobType}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-xs font-medium">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="bg-blue-50 dark:bg-gray-900 rounded-lg p-3 border border-blue-100 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Applicants</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{job.applicants}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-gray-900 rounded-lg p-3 border border-green-100 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Shortlisted</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{job.shortlisted}</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-gray-900 rounded-lg p-3 border border-yellow-100 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Interviewed</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{job.interviewed}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-gray-900 rounded-lg p-3 border border-purple-100 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Offers</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{job.offers}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-gray-900 rounded-lg p-3 border border-green-100 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Joined</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{job.joined}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Conversion Rate</span>
                    <span>{job.applicants > 0 ? Math.round((job.joined / job.applicants) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                      style={{ width: `${job.applicants > 0 ? (job.joined / job.applicants) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link
                    to={`/client/shortlist/${job.id}`}
                    className="btn-primary text-sm"
                  >
                    Review Shortlist
                  </Link>
                  <button className="btn-secondary text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">View Reports</p>
              <p className="text-gray-400 text-sm">Analytics & Insights</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Request Profiles</p>
              <p className="text-gray-400 text-sm">Get more candidates</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Contact Support</p>
              <p className="text-gray-400 text-sm">Get help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
