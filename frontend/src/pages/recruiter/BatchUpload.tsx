import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getJobs, bulkUploadCandidates } from '../../services/api'
import Loading from '../../components/Loading'

interface CSVRow {
  name: string
  email: string
  cv_url?: string
  phone?: string
  experience_years?: number
  status?: string
}

export default function BatchUpload() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [jobId, setJobId] = useState<number>(1)
  const [jobs, setJobs] = useState<any[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<CSVRow[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const jobsData = await getJobs()
      setJobs(jobsData)
      if (jobsData.length > 0) {
        setJobId(parseInt(jobsData[0].id) || 1)
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJobIdChange = (delta: number) => {
    setJobId(prev => Math.max(1, prev + delta))
  }

  const handleFileChange = (selectedFile: File) => {
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please upload a CSV file')
        return
      }
      if (selectedFile.size > 200 * 1024 * 1024) {
        toast.error('File size must be less than 200MB')
        return
      }
      setFile(selectedFile)
      parseCSV(selectedFile)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileChange(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileChange(droppedFile)
    }
  }

  const parseCSV = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length < 2) {
          toast.error('CSV file must have at least a header and one data row')
          return
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
        const data: CSVRow[] = []
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          
          if (row.experience_years) {
            row.experience_years = parseInt(row.experience_years) || 0
          }
          
          data.push(row as CSVRow)
        }
        
        setPreview(data.slice(0, 10))
        toast.success(`CSV parsed successfully. Found ${data.length} candidates.`)
      } catch (error) {
        console.error('CSV parsing error:', error)
        toast.error('Failed to parse CSV file. Please check the format.')
      }
    }
    reader.readAsText(file)
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file')
      return
    }

    if (!jobId) {
      toast.error('Please enter a Job ID')
      return
    }

    setUploading(true)
    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      
      const candidates: any[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        
        const expYears = row.experience_years ? parseInt(row.experience_years) || 0 : 0
        
        const candidate = {
          name: (row.name || '').trim(),
          email: (row.email || '').trim(),
          cv_url: (row.cv_url || '').trim(),
          phone: (row.phone || '').trim(),
          experience_years: expYears,
          status: (row.status || 'applied').trim(),
          job_id: jobId,
          location: (row.location || '').trim(),
          technical_skills: (row.skills || '').trim(),
          designation: (row.designation || '').trim(),
          education_level: (row.education || '').trim()
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

      const result = await bulkUploadCandidates(candidates)
      
      if (result) {
        toast.success(`Successfully uploaded ${candidates.length} candidates for Job ID: ${jobId}`)
        setFile(null)
        setPreview([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error?.response?.data?.error || 'Failed to upload candidates')
    } finally {
      setUploading(false)
    }
  }

  const exampleData: CSVRow[] = [
    { name: 'John Smith', email: 'john@example.com', cv_url: 'https://example.com/john-cv.pdf', phone: '+1-555-0101', experience_years: 5, status: 'applied' },
    { name: 'Jane Doe', email: 'jane@example.com', cv_url: 'https://example.com/jane-cv.pdf', phone: '+1-555-0102', experience_years: 3, status: 'applied' },
    { name: 'Mike Johnson', email: 'mike@example.com', cv_url: 'https://example.com/mike-cv.pdf', phone: '+1-555-0103', experience_years: 7, status: 'applied' }
  ]

  if (loading) {
    return <Loading message="Loading jobs..." />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 backdrop-blur-xl border border-green-300/20 dark:border-green-500/20">
        <h1 className="page-title">Bulk Candidate Upload</h1>
        <p className="page-subtitle">Upload multiple candidates for a job position using CSV format</p>
      </div>

      {/* Job ID Input */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Job ID
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleJobIdChange(-1)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 transition-all font-semibold"
          >
            −
          </button>
          <input
            type="number"
            value={jobId}
            onChange={(e) => setJobId(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="input-field flex-1 text-center"
            required
          />
          <button
            type="button"
            onClick={() => handleJobIdChange(1)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 transition-all font-semibold"
          >
            +
          </button>
        </div>
      </div>

      {/* Expected CSV Format */}
      <div className="card">
        <h2 className="section-title mb-4">Expected CSV Format</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">cv_url</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">experience_years</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {exampleData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap max-w-xs truncate">{row.cv_url}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.experience_years}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Upload */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Choose CSV file
        </label>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                Drag and drop file here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Limit 200MB per file • CSV
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary mt-2"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              Browse files
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {file && (
          <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null)
                  setPreview([])
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {preview.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Preview of uploaded data ({preview.length} rows shown)
            </h3>
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {Object.keys(preview[0]).map((key) => (
                      <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {preview.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      {Object.values(row).map((value, valIdx) => (
                        <td key={valIdx} className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                          {String(value || '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn-primary w-full mt-6"
        >
          {uploading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Candidates
            </>
          )}
        </button>
      </div>
    </div>
  )
}
