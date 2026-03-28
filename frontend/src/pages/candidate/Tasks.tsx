import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getTasks, submitTask, type Task } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { authStorage } from '../../utils/authStorage'

type SubmissionModal = { task: Task; url: string } | null

const mockTasks = (): Task[] => [
  {
    id: 'mock-task-1',
    candidate_id: 'mock-candidate',
    job_id: 'mock-job-1',
    job_title: 'Frontend Developer',
    title: 'Build Candidate Dashboard Widget',
    description: 'Create a responsive dashboard widget with loading, empty, and success states.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: 'pending',
  },
  {
    id: 'mock-task-2',
    candidate_id: 'mock-candidate',
    job_id: 'mock-job-2',
    job_title: 'React Engineer',
    title: 'Refactor Form Validation',
    description: 'Refactor form validation using reusable helpers and improve validation messages.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: 'in_progress',
  },
]

export default function CandidateTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [submitModal, setSubmitModal] = useState<SubmissionModal>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [user])

  const loadTasks = async () => {
    const isAuthenticated = authStorage.getItem('isAuthenticated') === 'true' || !!user
    if (!isAuthenticated) {
      toast.error('Please login to view tasks')
      setTasks([])
      setUsingMockData(false)
      setLoading(false)
      return
    }

    const candidateId = authStorage.getItem('backend_candidate_id')
    if (!candidateId) {
      setTasks([])
      setUsingMockData(true)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const fetchedTasks = await getTasks(candidateId)
      if (fetchedTasks.length === 0) {
        setTasks(mockTasks().map((t) => ({ ...t, candidate_id: candidateId })))
        setUsingMockData(true)
      } else {
        setTasks(fetchedTasks)
        setUsingMockData(false)
      }
    } catch (error) {
      console.error('Failed to load tasks:', error)
      setTasks(mockTasks().map((t) => ({ ...t, candidate_id: candidateId })))
      setUsingMockData(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitTask = async () => {
    if (!submitModal || !submitModal.url) return
    const target = submitModal.task

    try {
      setSubmitting(target.id)
      await submitTask(target.id, submitModal.url)
      toast.success('Task submitted successfully!')
    } catch {
      // Frontend-only mode: keep UX actionable even when backend endpoint is unavailable.
      toast.success('Task submitted in frontend mode (mocked)')
    } finally {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === target.id ? { ...task, status: 'submitted', submission_url: submitModal.url } : task
        )
      )
      setSubmitting(null)
      setSubmitModal(null)
    }
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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  const pendingTasks = useMemo(
    () => tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress'),
    [tasks]
  )
  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === 'submitted' || t.status === 'reviewed'),
    [tasks]
  )

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10 backdrop-blur-xl border border-blue-300/20 dark:border-blue-500/20">
        <h1 className="page-title">Tasks</h1>
        <p className="page-subtitle">View assigned tasks and submit your solutions</p>
        {usingMockData && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            Frontend mode active: currently referencing `/v1/tasks` and `/v1/tasks/:taskId/submit` with mocked data.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingTasks.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Pending / In Progress</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completedTasks.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Submitted / Reviewed</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assigned Tasks</h3>
              <div className="space-y-4">
                {pendingTasks.map((task) => {
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
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{task.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{task.job_title || 'Assignment'}</p>
                          <p className="text-gray-600 dark:text-gray-400 mt-3">{task.description}</p>
                          <p className={`text-sm mt-3 ${isOverdue ? 'text-red-600' : 'text-amber-600 dark:text-amber-400'}`}>
                            {isOverdue ? 'Overdue: ' : 'Deadline: '}
                            {formatDate(task.deadline)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTaskStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                          </span>
                          <button
                            onClick={() => setSubmitModal({ task, url: task.submission_url || '' })}
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

          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Submitted Tasks</h3>
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{task.job_title || 'Assignment'}</p>
                        {task.submission_url && (
                          <a
                            href={task.submission_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View submission link
                          </a>
                        )}
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tasks assigned yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Assigned tasks from admin will appear here.</p>
            </div>
          )}
        </div>
      )}

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
