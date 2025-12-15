import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getCandidateApplications, type Application } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

type StatusFilter = 'all' | 'applied' | 'screening' | 'shortlisted' | 'interview' | 'offer' | 'rejected' | 'hired'

export default function AppliedJobs() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  // Get candidate ID from Supabase user or fallback to localStorage
  const candidateId = user?.id || localStorage.getItem('candidate_id') || ''

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    if (!candidateId) {
      toast.error('Please login to view your applications')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await getCandidateApplications(candidateId)
      setApplications(data)
    } catch (error) {
      console.error('Failed to load applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: string; label: string }> = {
      applied: { 
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', 
        icon: '📝', 
        label: 'Applied' 
      },
      screening: { 
        color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', 
        icon: '🔍', 
        label: 'Screening' 
      },
      shortlisted: { 
        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', 
        icon: '⭐', 
        label: 'Shortlisted' 
      },
      interview: { 
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', 
        icon: '📅', 
        label: 'Interview' 
      },
      offer: { 
        color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400', 
        icon: '🎉', 
        label: 'Offer' 
      },
      rejected: { 
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', 
        icon: '❌', 
        label: 'Rejected' 
      },
      hired: { 
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', 
        icon: '✅', 
        label: 'Hired' 
      },
    }
    return configs[status.toLowerCase()] || configs.applied
  }

  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status.toLowerCase() === statusFilter)

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    screening: applications.filter(a => a.status === 'screening').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    hired: applications.filter(a => a.status === 'hired').length,
  }

  const statusFilters: { value: StatusFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'applied', label: 'Applied', count: stats.applied },
    { value: 'screening', label: 'Screening', count: stats.screening },
    { value: 'shortlisted', label: 'Shortlisted', count: stats.shortlisted },
    { value: 'interview', label: 'Interview', count: stats.interview },
    { value: 'offer', label: 'Offers', count: stats.offer },
    { value: 'hired', label: 'Hired', count: stats.hired },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">My Applications 📋</h1>
        <p className="text-purple-100 text-lg">Track and manage all your job applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-lg">📝</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Applied</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <span className="text-lg">⭐</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.shortlisted}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Shortlisted</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-lg">📅</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.interview}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Interviews</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <span className="text-lg">🎉</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.offer}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Offers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-2 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === filter.value
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {filter.label}
              <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                statusFilter === filter.value 
                  ? 'bg-blue-400 text-white' 
                  : 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-slate-700">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No applications found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {statusFilter === 'all' 
              ? "You haven't applied to any jobs yet. Start exploring!" 
              : `No applications with "${statusFilter}" status`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map(app => {
            const statusConfig = getStatusConfig(app.status)
            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{statusConfig.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{app.job_title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{app.company || 'Company'}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Applied: {new Date(app.applied_date).toLocaleDateString()}
                          </span>
                          {app.match_score && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              Match: {app.match_score}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Match Score Progress Bar */}
                {app.match_score && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Match Score</span>
                      <span className={`font-semibold ${
                        app.match_score >= 80 ? 'text-emerald-600' :
                        app.match_score >= 60 ? 'text-amber-600' : 'text-red-600'
                      }`}>{app.match_score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          app.match_score >= 80 ? 'bg-emerald-500' :
                          app.match_score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${app.match_score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedApp.job_title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedApp.company || 'Company'}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedApp.status).color}`}>
                  {getStatusConfig(selectedApp.status).icon} {getStatusConfig(selectedApp.status).label}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Applied Date</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedApp.applied_date).toLocaleDateString()}
                </span>
              </div>
              
              {selectedApp.match_score && (
                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Match Score</span>
                    <span className={`font-bold ${
                      selectedApp.match_score >= 80 ? 'text-emerald-600' :
                      selectedApp.match_score >= 60 ? 'text-amber-600' : 'text-red-600'
                    }`}>{selectedApp.match_score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        selectedApp.match_score >= 80 ? 'bg-emerald-500' :
                        selectedApp.match_score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${selectedApp.match_score}%` }}
                    />
                  </div>
                </div>
              )}

              {selectedApp.updated_at && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedApp.updated_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={() => setSelectedApp(null)}
                className="w-full py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
