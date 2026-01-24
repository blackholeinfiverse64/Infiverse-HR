import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getInterviews, getTasks, submitTask, type Interview, type Task } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

type TabType = 'interviews' | 'tasks'

export default function InterviewTaskPanel() {
  const { user } = useAuth()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('interviews')
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [submitModal, setSubmitModal] = useState<{ task: Task; url: string } | null>(null)

  // Get backend candidate ID (integer) for API calls
  const backendCandidateId = localStorage.getItem('backend_candidate_id')
  const candidateId = backendCandidateId || user?.id || localStorage.getItem('candidate_id') || ''

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // Check authentication first
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || !!user
    
    if (!isAuthenticated) {
      toast.error('Please login to view interviews and tasks')
      setLoading(false)
      return
    }

    // If authenticated but no candidate ID, show empty state
    if (!candidateId) {
      setInterviews([])
      setTasks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const [interviewsData, tasksData] = await Promise.all([
        getInterviews(candidateId).catch(() => []),
        getTasks(candidateId).catch(() => [])
      ])
      setInterviews(interviewsData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Failed to load data:', error)
      setInterviews([])
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitTask = async () => {
    if (!submitModal) return

    setSubmitting(submitModal.task.id)
    try {
      await submitTask(submitModal.task.id, submitModal.url)
      toast.success('Task submitted successfully!')
      setSubmitModal(null)
      loadData()
    } catch (error) {
      toast.error('Failed to submit task')
    } finally {
      setSubmitting(null)
    }
  }

  const getInterviewStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      rescheduled: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    }
    return colors[status] || colors.scheduled
  }

  const getTaskStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      submitted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      reviewed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    }
    return colors[status] || colors.pending
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) > new Date()
  }

  const upcomingInterviews = interviews.filter(i => i.status === 'scheduled' && isUpcoming(i.scheduled_date))
  const pastInterviews = interviews.filter(i => i.status !== 'scheduled' || !isUpcoming(i.scheduled_date))
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress')
  const completedTasks = tasks.filter(t => t.status === 'submitted' || t.status === 'reviewed')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10 backdrop-blur-xl border border-blue-300/20 dark:border-blue-500/20">
        <h1 className="page-title">Interviews & Tasks</h1>
        <p className="page-subtitle">Manage your interviews and complete assigned tasks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{upcomingInterviews.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming Interviews</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{pastInterviews.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingTasks.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending Tasks</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completedTasks.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tasks Submitted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-2 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('interviews')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'interviews'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            Interviews ({interviews.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'tasks'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            Tasks ({tasks.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : activeTab === 'interviews' ? (
        /* Interviews Tab */
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          {upcomingInterviews.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Interviews</h3>
              <div className="space-y-4">
                {upcomingInterviews.map(interview => (
                  <div
                    key={interview.id}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{interview.job_title}</h4>
                        <p className="text-gray-600 dark:text-gray-400">{interview.company || 'Company'}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(interview.scheduled_date)}
                          </span>
                          {interview.scheduled_time && (
                            <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {interview.scheduled_time}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            {interview.interview_type || 'Video Call'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInterviewStatusColor(interview.status)}`}>
                          {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                        </span>
                        {interview.meeting_link && (
                          <a
                            href={interview.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>
                    {interview.notes && (
                      <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Notes:</span> {interview.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Interviews */}
          {pastInterviews.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Past Interviews</h3>
              <div className="space-y-4">
                {pastInterviews.map(interview => (
                  <div
                    key={interview.id}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{interview.job_title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{interview.company || 'Company'}</p>
                        <p className="text-sm text-gray-400 mt-1">{formatDate(interview.scheduled_date)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInterviewStatusColor(interview.status)}`}>
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {interviews.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-slate-700">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No interviews scheduled</h3>
              <p className="text-gray-500 dark:text-gray-400">Your scheduled interviews will appear here</p>
            </div>
          )}
        </div>
      ) : (
        /* Tasks Tab */
        <div className="space-y-6">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Tasks</h3>
              <div className="space-y-4">
                {pendingTasks.map(task => {
                  const isOverdue = new Date(task.deadline) < new Date()
                  return (
                    <div
                      key={task.id}
                      className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border ${
                        isOverdue ? 'border-red-200 dark:border-red-800' : 'border-gray-100 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white">{task.title}</h4>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">{task.job_title || 'Assignment'}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mt-3">{task.description}</p>
                          <div className="flex items-center gap-4 mt-4 text-sm">
                            <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-amber-600 dark:text-amber-400'}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {isOverdue ? 'Overdue: ' : 'Deadline: '}{formatDate(task.deadline)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTaskStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                          </span>
                          <button
                            onClick={() => setSubmitModal({ task, url: '' })}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                          >
                            Submit Task
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Completed Tasks</h3>
              <div className="space-y-4">
                {completedTasks.map(task => (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{task.job_title || 'Assignment'}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTaskStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-slate-700">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tasks assigned</h3>
              <p className="text-gray-500 dark:text-gray-400">Your assigned tasks will appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Submit Task Modal */}
      {submitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="section-title">Submit Task</h2>
                  <p className="text-gray-600 dark:text-gray-400">{submitModal.task.title}</p>
                </div>
                <button
                  onClick={() => setSubmitModal(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Submission URL (GitHub, Drive, etc.)
              </label>
              <input
                type="url"
                value={submitModal.url}
                onChange={(e) => setSubmitModal({ ...submitModal, url: e.target.value })}
                placeholder="https://github.com/your-repo"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex gap-3">
              <button
                onClick={() => setSubmitModal(null)}
                className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTask}
                disabled={!submitModal.url || submitting === submitModal.task.id}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-medium rounded-lg transition-colors"
              >
                {submitting === submitModal.task.id ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
