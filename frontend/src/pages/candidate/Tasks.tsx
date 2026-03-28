import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCandidateTasks } from '../../context/CandidateTasksContext'
import type { CandidateWorkflowTask, TaskFilterTab } from './candidateTasksTypes'

type SubmitModal = { task: CandidateWorkflowTask; url: string } | null

function IconListTodo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconTimer({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconCheckSquare({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconCheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function IconRefresh({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function IconEye({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function IconExternal({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

function getStatusBadgeClass(status: CandidateWorkflowTask['workflowStatus']) {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'
    case 'In Progress':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800'
    default:
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800'
  }
}

function getPriorityBadgeClass(priority: CandidateWorkflowTask['priority']) {
  switch (priority) {
    case 'High':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800'
    case 'Medium':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800'
    default:
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'
  }
}

function getDaysRemaining(dueIso: string) {
  const due = new Date(dueIso).getTime()
  const today = Date.now()
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24))
}

export default function CandidateTasks() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tasks } = useCandidateTasks()
  const [activeTab, setActiveTab] = useState<TaskFilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [submitModal, setSubmitModal] = useState<SubmitModal>(null)
  const [refreshSpin, setRefreshSpin] = useState(false)

  useEffect(() => {
    const id = (location.state as { openSubmitTaskId?: string } | null)?.openSubmitTaskId
    if (!id) return
    const t = tasks.find((x) => x.id === id)
    if (t) setSubmitModal({ task: t, url: t.submission?.githubLink ?? '' })
    navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate, tasks])

  const stats = useMemo(() => {
    const total = tasks.length
    const submitted = tasks.filter((t) => t.submission).length
    const pending = tasks.filter((t) => t.workflowStatus === 'Pending' && !t.submission).length
    const inProgress = tasks.filter((t) => t.workflowStatus === 'In Progress').length
    const completed = tasks.filter((t) => t.workflowStatus === 'Completed').length
    return { total, submitted, pending, inProgress, completed }
  }, [tasks])

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return tasks.filter((task) => {
      const matches =
        !q ||
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        (task.department?.toLowerCase().includes(q) ?? false)
      if (!matches) return false
      const hasSubmission = !!task.submission
      switch (activeTab) {
        case 'pending':
          return task.workflowStatus === 'Pending' && !hasSubmission
        case 'inprogress':
          return task.workflowStatus === 'In Progress'
        case 'submitted':
          return hasSubmission
        case 'completed':
          return task.workflowStatus === 'Completed'
        default:
          return true
      }
    })
  }, [tasks, activeTab, searchQuery])

  const handleRefresh = () => {
    setRefreshSpin(true)
    toast('Task list refresh will load from the API after integration.', { icon: 'ℹ️' })
    window.setTimeout(() => setRefreshSpin(false), 600)
  }

  const confirmSubmit = () => {
    if (!submitModal?.url.trim()) return
    toast.error('Task submission is not connected yet. Enable the tasks API to submit.')
    setSubmitModal(null)
  }

  const tabBtn = (tab: TaskFilterTab, label: string, activeClass: string) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      className={`rounded-lg px-2 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
        activeTab === tab
          ? `${activeClass} text-white shadow-md`
          : 'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
      }`}
    >
      {label}
    </button>
  )

  const statCard = (
    tab: TaskFilterTab,
    icon: React.ReactNode,
    value: number,
    label: string,
    activeBorder: string,
    iconWrap: string
  ) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      className={`rounded-2xl border-2 bg-white dark:bg-slate-800 p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        activeTab === tab ? activeBorder : 'border-transparent dark:border-slate-700 hover:border-blue-200 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-3 ${iconWrap}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </button>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-blue-200/60 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent p-6 dark:border-blue-500/20 dark:from-blue-500/15 dark:via-cyan-500/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
            My Tasks
          </h1>
          <p className="page-subtitle mt-1">Manage and track all your assigned tasks</p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Assigned tasks will show here once the tasks service is integrated with Sampada.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border-2 border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700 sm:self-center"
        >
          <IconRefresh className={`h-4 w-4 ${refreshSpin ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {statCard(
          'all',
          <IconListTodo className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
          stats.total,
          'Total Tasks',
          'border-blue-500 bg-blue-500/5 dark:border-blue-400',
          'bg-gradient-to-br from-blue-500/20 to-cyan-500/10'
        )}
        {statCard(
          'pending',
          <IconClock className="h-5 w-5 text-amber-500" />,
          stats.pending,
          'Pending',
          'border-amber-500 bg-amber-500/5',
          'bg-gradient-to-br from-amber-500/20 to-amber-500/5'
        )}
        {statCard(
          'inprogress',
          <IconTimer className="h-5 w-5 text-sky-500" />,
          stats.inProgress,
          'In Progress',
          'border-sky-500 bg-sky-500/5',
          'bg-gradient-to-br from-sky-500/20 to-sky-500/5'
        )}
        {statCard(
          'submitted',
          <IconCheckSquare className="h-5 w-5 text-violet-500" />,
          stats.submitted,
          'Submitted',
          'border-violet-500 bg-violet-500/5',
          'bg-gradient-to-br from-violet-500/20 to-violet-500/5'
        )}
        {statCard(
          'completed',
          <IconCheckCircle className="h-5 w-5 text-emerald-500" />,
          stats.completed,
          'Completed',
          'border-emerald-500 bg-emerald-500/5',
          'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5'
        )}
      </div>

      <div className="relative">
        <IconSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-cyan-500"
        />
      </div>

      <div className="rounded-xl bg-gray-100/80 p-1 dark:bg-slate-800/80">
        <div className="grid h-auto grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
          {tabBtn('all', `All (${stats.total})`, 'bg-gradient-to-r from-blue-500 to-cyan-500')}
          {tabBtn('pending', `Pending (${stats.pending})`, 'bg-amber-500')}
          {tabBtn('inprogress', `In Progress (${stats.inProgress})`, 'bg-sky-500')}
          {tabBtn('submitted', `Submitted (${stats.submitted})`, 'bg-violet-500')}
          {tabBtn('completed', `Completed (${stats.completed})`, 'bg-emerald-500')}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 dark:border-slate-700">
          <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-slate-800">
            <IconListTodo className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No tasks found</p>
          <p className="mt-1 text-sm text-gray-500">Tasks matching your filter will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const daysLeft = getDaysRemaining(task.dueDate)
            const overdue = daysLeft < 0
            const submission = task.submission

            return (
              <div
                key={task.id}
                className={`overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg dark:bg-slate-800 dark:hover:border-blue-900 ${
                  overdue ? 'border-red-200 dark:border-red-900/50' : 'border-gray-100 dark:border-slate-700'
                }`}
              >
                <div className="bg-gradient-to-br from-white to-gray-50/80 p-6 dark:from-slate-800 dark:to-slate-800/80">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                        </div>
                        <div className="flex flex-shrink-0 flex-wrap gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(task.workflowStatus)}`}>
                            {task.workflowStatus}
                          </span>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityBadgeClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Progress</span>
                          <span className="font-medium text-gray-900 dark:text-white">{task.progress}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(0, task.progress))}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <IconCalendar className="h-4 w-4" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        {overdue && (
                          <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs font-medium text-white dark:bg-gray-200 dark:text-gray-900">
                            Overdue
                          </span>
                        )}
                        {!overdue && daysLeft <= 2 && daysLeft >= 0 && (
                          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                            {daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
                          </span>
                        )}
                        {task.department && <span>Dept: {task.department}</span>}
                      </div>

                      {submission && (
                        <div className="rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-500/10 to-transparent p-4 dark:border-emerald-800/60">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <IconCheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Submitted</span>
                            {submission.status && (
                              <span
                                className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
                                  submission.status === 'Approved'
                                    ? 'bg-emerald-500'
                                    : submission.status === 'Rejected'
                                      ? 'bg-red-500'
                                      : 'bg-amber-500'
                                }`}
                              >
                                {submission.status}
                              </span>
                            )}
                          </div>
                          {submission.githubLink && (
                            <a
                              href={submission.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-500/20 dark:text-blue-400"
                            >
                              Repository
                              <IconExternal className="h-3.5 w-3.5" />
                            </a>
                          )}
                          {submission.feedback && (
                            <div className="mt-3 rounded-lg border border-gray-200 bg-white/90 p-3 text-sm text-gray-600 dark:border-slate-600 dark:bg-slate-900/50 dark:text-gray-300">
                              <span className="font-semibold text-gray-900 dark:text-white">Feedback: </span>
                              <span className="whitespace-pre-wrap">{submission.feedback}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 lg:w-40 lg:flex-col">
                      <button
                        type="button"
                        onClick={() => navigate(`/candidate/tasks/${task.id}`)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:text-gray-200 dark:hover:border-blue-700 dark:hover:bg-slate-700 lg:flex-none"
                      >
                        <IconEye className="h-4 w-4" />
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSubmitModal({
                            task,
                            url: submission?.githubLink ?? '',
                          })
                        }
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg lg:flex-none ${
                          submission
                            ? 'bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                        }`}
                      >
                        <IconRefresh className={`h-4 w-4 ${submission ? '' : 'hidden'}`} />
                        {!submission && <IconCheckSquare className="h-4 w-4" />}
                        {submission ? 'Update' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {submitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-slate-800">
            <div className="border-b border-gray-100 p-6 dark:border-slate-700">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {submitModal.task.submission ? 'Update submission' : 'Submit task'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{submitModal.task.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitModal(null)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Repository / submission URL
              </label>
              <input
                type="url"
                value={submitModal.url}
                onChange={(e) => setSubmitModal({ ...submitModal, url: e.target.value })}
                placeholder="https://github.com/your-org/your-repo"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Saving will be enabled when the tasks API is integrated.
              </p>
            </div>
            <div className="flex gap-3 border-t border-gray-100 p-6 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSubmitModal(null)}
                className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSubmit}
                disabled={!submitModal.url.trim()}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 text-sm font-medium text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
