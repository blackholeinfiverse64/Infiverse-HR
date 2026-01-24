import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { scheduleInterview, getInterviews, getJobs, type Interview } from '../../services/api'
import Loading from '../../components/Loading'

export default function InterviewScheduling() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'view'>('schedule')
  const [loading, setLoading] = useState(false)
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    candidate_id: '',
    candidate_name: '',
    job_id: '',
    interview_date: '',
    interview_time: '',
    interview_type: 'video',
    interviewer: '',
    meeting_link: '',
    notes: ''
  })

  useEffect(() => {
    if (activeTab === 'view') {
      loadInterviews()
      // Auto-refresh interviews every 30 seconds when viewing
      const interval = setInterval(loadInterviews, 30000)
      return () => clearInterval(interval)
    }
    loadJobs()
  }, [activeTab])

  const loadInterviews = async () => {
    try {
      setLoading(true)
      const data = await getInterviews()
      setInterviews(data)
    } catch (error) {
      console.error('Failed to load interviews:', error)
      toast.error('Failed to load interviews')
    } finally {
      setLoading(false)
    }
  }

  const loadJobs = async () => {
    try {
      const jobsData = await getJobs()
      setJobs(jobsData)
      if (jobsData.length > 0 && !formData.job_id) {
        setFormData(prev => ({ ...prev, job_id: jobsData[0].id.toString() }))
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.candidate_name || !formData.interviewer) {
      toast.error('Please fill in candidate name and interviewer')
      return
    }

    if (!formData.interview_date || !formData.interview_time) {
      toast.error('Please select interview date and time')
      return
    }

    setLoading(true)
    try {
      const interviewDateTime = `${formData.interview_date}T${formData.interview_time}:00`
      
      await scheduleInterview({
        candidate_id: formData.candidate_id,
        job_id: formData.job_id,
        scheduled_date: interviewDateTime,
        scheduled_time: formData.interview_time,
        interview_type: formData.interview_type,
        meeting_link: formData.meeting_link,
        status: 'scheduled',
        notes: formData.notes || `Interview scheduled for ${formData.candidate_name}`
      })

      toast.success(`Interview scheduled for ${formData.candidate_name}!`)
      
      // Reset form
      setFormData({
        candidate_id: '',
        candidate_name: '',
        job_id: jobs.length > 0 ? jobs[0].id.toString() : '',
        interview_date: '',
        interview_time: '',
        interview_type: 'video',
        interviewer: '',
        meeting_link: '',
        notes: ''
      })

      // Switch to view tab and refresh
      setActiveTab('view')
      setTimeout(() => {
        loadInterviews()
      }, 500)
    } catch (error: any) {
      console.error('Schedule error:', error)
      toast.error(error?.response?.data?.error || 'Failed to schedule interview')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return dateStr
    }
  }

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 backdrop-blur-xl border border-green-300/20 dark:border-green-500/20">
        <h1 className="page-title">Interview Management System</h1>
        <p className="page-subtitle">Schedule, track, and manage candidate interviews</p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'schedule'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Interview
            </span>
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'view'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Interviews
            </span>
          </button>
        </div>

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Candidate ID
                </label>
                <input
                  type="number"
                  value={formData.candidate_id}
                  onChange={(e) => setFormData({ ...formData, candidate_id: e.target.value })}
                  min="1"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Candidate Name *
                </label>
                <input
                  type="text"
                  value={formData.candidate_name}
                  onChange={(e) => setFormData({ ...formData, candidate_name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job ID
                </label>
                <select
                  value={formData.job_id}
                  onChange={(e) => setFormData({ ...formData, job_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      Job ID {job.id} - {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interview Date *
                </label>
                <input
                  type="date"
                  value={formData.interview_date}
                  onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interview Time *
                </label>
                <input
                  type="time"
                  value={formData.interview_time}
                  onChange={(e) => setFormData({ ...formData, interview_time: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interview Type
                </label>
                <select
                  value={formData.interview_type}
                  onChange={(e) => setFormData({ ...formData, interview_type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="video">Video</option>
                  <option value="phone">Phone</option>
                  <option value="in-person">In-person</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interviewer Name *
                </label>
                <input
                  type="text"
                  value={formData.interviewer}
                  onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meeting Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.meeting_link}
                  onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Additional notes about the interview..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scheduling...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Interview
                </>
              )}
            </button>
          </form>
        )}

        {/* View Interviews Tab */}
        {activeTab === 'view' && (
          <div>
            {loading ? (
              <Loading message="Loading interviews..." />
            ) : interviews.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No interviews scheduled yet</p>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="mt-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                >
                  Schedule your first interview →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {interview.candidate_id || 'Candidate'}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Date</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatDate(interview.scheduled_date)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Time</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {interview.scheduled_time || formatTime(interview.scheduled_date)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Job</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {interview.job_title || `Job ID ${interview.job_id}`}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Type</p>
                            <p className="font-semibold text-gray-900 dark:text-white capitalize">
                              {interview.interview_type}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              interview.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              interview.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}>
                              {interview.status}
                            </span>
                          </div>
                        </div>
                        {interview.meeting_link && (
                          <div className="mt-4">
                            <a
                              href={interview.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium text-sm"
                            >
                              Join Meeting →
                            </a>
                          </div>
                        )}
                        {interview.notes && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-700 dark:text-blue-400">{interview.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

