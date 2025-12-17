import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getJobs, bulkUploadCandidates } from '../../services/api'
import Loading from '../../components/Loading'

export default function BatchOperations() {
  const [activeTab, setActiveTab] = useState<'upload' | 'notifications'>('upload')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [sendingNotifications, setSendingNotifications] = useState(false)
  
  // Upload tab states
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedJobId, setSelectedJobId] = useState<number>(1)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])

  // Notifications tab states
  const [notificationType, setNotificationType] = useState<string>('shortlisted')
  const [candidates, setCandidates] = useState<any[]>([
    { name: 'John Doe', email: 'john.doe@example.com', phone: '+1234567890' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1234567891' },
    { name: 'Mike Johnson', email: 'mike.johnson@example.com', phone: '+1234567892' }
  ])

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const jobsData = await getJobs()
      setJobs(jobsData)
      if (jobsData.length > 0) {
        setSelectedJobId(jobsData[0].id)
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    if (!uploadedFile.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }

    setFile(uploadedFile)
    
    // Read and preview CSV
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      if (lines.length < 2) {
        toast.error('CSV file must have at least a header and one data row')
        return
      }

      const headers = lines[0].split(',').map(h => h.trim())
      const previewData: any[] = []
      
      for (let i = 1; i < Math.min(6, lines.length); i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        previewData.push(row)
      }
      
      setPreview(previewData)
    }
    reader.readAsText(uploadedFile)
  }

  const handleBulkUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file')
      return
    }

    setUploading(true)
    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      const candidates: any[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        
        const candidate = {
          name: (row.name || '').trim(),
          email: (row.email || '').trim(),
          phone: (row.phone || '').trim(),
          job_id: selectedJobId
        }
        
        if (candidate.name && candidate.email) {
          candidates.push(candidate)
        }
      }

      if (candidates.length === 0) {
        toast.error('No valid candidates found in CSV')
        setUploading(false)
        return
      }

      await bulkUploadCandidates(candidates)
      toast.success(`Successfully uploaded ${candidates.length} candidates!`)
      setFile(null)
      setPreview([])
      const fileInput = document.getElementById('bulk-upload-file') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload candidates')
    } finally {
      setUploading(false)
    }
  }

  const handleBulkNotifications = async () => {
    if (candidates.length === 0) {
      toast.error('Please add at least one candidate')
      return
    }

    setSendingNotifications(true)
    try {
      // Call LangGraph service for bulk notifications
      const langgraphUrl = import.meta.env.VITE_LANGGRAPH_URL || 'http://localhost:8003'
      const response = await fetch(`${langgraphUrl}/automation/bulk-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_API_KEY || ''}`
        },
        body: JSON.stringify({
          candidates: candidates,
          sequence_type: notificationType,
          job_title: 'Software Engineer',
          matching_score: 'High'
        })
      })

      if (response.ok) {
        const result = await response.json()
        const successCount = result.bulk_result?.success_count || candidates.length
        toast.success(`Bulk notifications sent to ${successCount}/${candidates.length} candidates`)
      } else {
        throw new Error('Failed to send notifications')
      }
    } catch (error) {
      console.error('Notification error:', error)
      toast.error('Failed to send bulk notifications. Service may be offline.')
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

  if (loading) {
    return <Loading message="Loading jobs..." />
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
          <div className="space-y-6">
            <div>
              <h2 className="section-title mb-4">Bulk Candidate Upload</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upload multiple candidates at once using CSV format
              </p>
            </div>

            {/* Job Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job ID for Bulk Upload
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
              >
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    Job {job.id}: {job.title || 'Untitled'}
                  </option>
                ))}
              </select>
            </div>

            {/* CSV Format Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Expected CSV Format</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="px-3 py-2 text-left">name</th>
                      <th className="px-3 py-2 text-left">email</th>
                      <th className="px-3 py-2 text-left">phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2">John Smith</td>
                      <td className="px-3 py-2">john@example.com</td>
                      <td className="px-3 py-2">+1234567890</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">Jane Doe</td>
                      <td className="px-3 py-2">jane@example.com</td>
                      <td className="px-3 py-2">+1234567891</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Choose CSV File for Bulk Upload
              </label>
              <input
                id="bulk-upload-file"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900/30 dark:file:text-green-400"
              />
            </div>

            {/* Preview */}
            {preview.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Preview (First 5 rows):</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        {Object.keys(preview[0] || {}).map(key => (
                          <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {preview.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((value: any, i) => (
                            <td key={i} className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleBulkUpload}
              disabled={!file || uploading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {uploading ? '🚀 Uploading...' : '🚀 Upload All Candidates'}
            </button>
          </div>
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
              </select>
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

