import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getAllCandidates, getRecruiterJobs, type Job } from '../../services/api'
import BulkCandidateUploadPanel from '../../components/recruiter/BulkCandidateUploadPanel'

export default function BatchOperations() {
  const [activeTab, setActiveTab] = useState<'upload' | 'notifications'>('upload')
  const [sendingNotifications, setSendingNotifications] = useState(false)
  
  // Notifications tab states
  const [notificationType, setNotificationType] = useState<string>('shortlisted')
  const [candidates, setCandidates] = useState<any[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string>('')

  useEffect(() => {
    loadCandidates()
    loadJobs()
  }, [])

  const loadCandidates = async () => {
    try {
      const candidatesData = await getAllCandidates()
      // Map backend candidate data to notification format
      const mappedCandidates = candidatesData.slice(0, 10).map((c: any) => ({
        name: c.name || '',
        email: c.email || '',
        phone: c.phone || '',
        candidate_id: c.id || c.candidate_id
      }))
      setCandidates(mappedCandidates.length > 0 ? mappedCandidates : [])
    } catch (error) {
      console.error('Failed to load candidates:', error)
      // Start with empty array if load fails
      setCandidates([])
    }
  }

  const loadJobs = async () => {
    try {
      const jobsData = await getRecruiterJobs()
      setJobs(jobsData)
      // Don't auto-select first job - keep it optional
      setSelectedJobId('')
    } catch (error) {
      console.error('Failed to load jobs:', error)
      toast.error('Failed to load jobs. You can still send notifications without job data.')
      setJobs([])
      setSelectedJobId('')
    }
  }

  const handleBulkNotifications = async () => {
    if (candidates.length === 0) {
      toast.error('Please add at least one candidate')
      return
    }

    // Validate candidates have required fields with quality check
    const invalidCandidates = candidates.filter(c => {
      const hasValidEmail = c.email && c.email.trim() && c.email.includes('@') && 
                           c.email !== 'test@example.com' && 
                           !c.email.startsWith('test@')
      const hasValidPhone = c.phone && c.phone.trim() && 
                           c.phone.replace(/[^0-9+]/g, '').length >= 10 && 
                           c.phone !== '+1234567890' &&
                           c.phone !== '1234567890'
      return !hasValidEmail && !hasValidPhone
    })
    
    if (invalidCandidates.length > 0) {
      toast.error(`${invalidCandidates.length} candidate(s) have invalid contact info (need real email or 10+ digit phone)`, {
        duration: 6000
      })
      return
    }

    setSendingNotifications(true)
    try {
      // Call LangGraph service for bulk notifications via Gateway API
      const API_KEY = import.meta.env.VITE_API_KEY || 'prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o'
      const langgraphUrl = import.meta.env.VITE_LANGGRAPH_URL || 'https://bhiv-hr-langgraph-luy9.onrender.com'
      
      // Get job title if a job is selected, otherwise use generic title
      const selectedJob = selectedJobId ? jobs.find(j => j.id === selectedJobId) : null
      const jobTitle = selectedJob?.title || 'Position'
      const jobIdForNotification = selectedJob?.id || null
      
      console.log('📧 Sending bulk notifications:', {
        candidatesCount: candidates.length,
        notificationType,
        jobTitle,
        candidates: candidates.map(c => ({ name: c.name, email: c.email, phone: c.phone }))
      })
      
      // Use new consistent endpoint path
      const response = await fetch(`${langgraphUrl}/automation/notifications/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          candidates: candidates.map(c => ({
            candidate_name: c.name,
            candidate_email: c.email,
            candidate_phone: c.phone,
            candidate_id: c.candidate_id
          })),
          sequence_type: notificationType,
          job_title: jobTitle,
          job_id: jobIdForNotification,
          matching_score: 'High'
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Notification response:', result)
        
        const successCount = result.bulk_result?.success_count || 0
        const failedCount = result.bulk_result?.failed_count || 0
        const totalCount = result.bulk_result?.total_candidates || candidates.length
        
        if (successCount > 0) {
          toast.success(`✅ Bulk notifications sent to ${successCount}/${totalCount} candidates (${failedCount} failed)`, {
            duration: 5000
          })
        } else if (failedCount > 0) {
          toast.error(`❌ Failed to send notifications to all ${failedCount} candidates. Check backend logs for details.`)
        } else {
          toast('⚠️ Notifications processed but no confirmations received', {
            icon: '⚠️',
            duration: 5000
          })
        }
      } else {
        const errorText = await response.text()
        console.error('❌ Notification error response:', errorText)
        throw new Error(`Failed to send notifications: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('❌ Notification error:', error)
      toast.error(`Failed to send bulk notifications: ${error instanceof Error ? error.message : 'Service may be offline'}`)
    } finally {
      setSendingNotifications(false)
    }
  }

  const addCandidate = () => {
    setCandidates([...candidates, { name: '', email: '', phone: '' }])
  }

  const removeCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index))
  }

  const updateCandidate = (index: number, field: string, value: string) => {
    const updated = [...candidates]
    updated[index] = { ...updated[index], [field]: value }
    setCandidates(updated)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 backdrop-blur-xl border border-green-300/20 dark:border-green-500/20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📁 Batch Operations</h1>
        <p className="text-gray-600 dark:text-gray-400">Perform bulk operations on candidates and jobs</p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'upload'
                  ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Bulk Upload
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'notifications'
                  ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Bulk Notifications
            </button>
          </div>
        </div>

        {/* Bulk Upload Tab */}
        {activeTab === 'upload' && (
          <BulkCandidateUploadPanel
            jobSelectLabel="Select job id for bulk upload"
            showHeader={false}
            showDashboardLink={false}
          />
        )}

        {/* Bulk Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📧 Bulk Notification System</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Send automated notifications to multiple candidates
              </p>
            </div>

            {/* Notification Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notification Type
              </label>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
              >
                <option value="shortlisted">Shortlisted</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="feedback_request">Feedback Request</option>
                <option value="application_received">Application Received</option>
                <option value="rejection_sent">Rejection Notification</option>
              </select>
            </div>

            {/* Job Selection (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Name-ID (Optional)
              </label>
              {jobs.length === 0 ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No jobs available. You can still send notifications without job data.
                  </p>
                </div>
              ) : (
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Job Title</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} – Job ID {job.id}
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {selectedJobId 
                  ? 'Notifications will reference the selected job' 
                  : 'Notifications will be sent without specific job information'}
              </p>
            </div>

            {/* Candidates List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Candidates for Bulk Notification ({candidates.length})
                </h3>
                <button
                  onClick={addCandidate}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  + Add Candidate
                </button>
              </div>

              <div className="space-y-3">
                {candidates.map((candidate, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={candidate.name}
                        onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={candidate.email}
                        onChange={(e) => updateCandidate(index, 'email', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={candidate.phone}
                        onChange={(e) => updateCandidate(index, 'phone', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => removeCandidate(index)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleBulkNotifications}
              disabled={candidates.length === 0 || sendingNotifications}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {sendingNotifications ? '📧 Sending...' : '📧 Send Bulk Notifications'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

