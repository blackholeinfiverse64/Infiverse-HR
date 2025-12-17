import { useState, useEffect } from 'react'
import { createJob, getJobs, Job } from '../../services/api'
import { toast } from 'react-hot-toast'
import Loading from '../../components/Loading'

export default function ClientJobPosting() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: '',
    experience_level: 'Entry',
    employment_type: 'Full-time',
    salary_range: '',
    description: '',
    required_skills: '',
  })

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Operations', 'Finance']
  const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead']
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Intern']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const jobData: Partial<Job> = {
        title: formData.title,
        department: formData.department,
        location: formData.location,
        experience_required: formData.experience_level,
        job_type: formData.employment_type,
        description: formData.description,
        skills_required: formData.required_skills,
        status: 'active',
      }

      if (formData.salary_range) {
        const [min, max] = formData.salary_range.split('-').map(s => parseInt(s.trim()))
        if (min) jobData.salary_min = min
        if (max) jobData.salary_max = max
      }

      await createJob(jobData)
      toast.success('Job posted successfully!')
      
      // Reset form
      setFormData({
        title: '',
        department: 'Engineering',
        location: '',
        experience_level: 'Entry',
        employment_type: 'Full-time',
        salary_range: '',
        description: '',
        required_skills: '',
      })
      
      // Refresh jobs list in background
      setTimeout(() => {
        window.dispatchEvent(new Event('jobs-updated'))
      }, 1000)
    } catch (error: any) {
      console.error('Error posting job:', error)
      toast.error(error?.response?.data?.error || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 backdrop-blur-xl border border-blue-300/20 dark:border-blue-500/20 mb-8">
        <h1 className="page-title">Post New Job</h1>
        <p className="page-subtitle">Create and publish new job openings for your organization</p>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Posting as: <span className="font-semibold">Demo Company</span> (ID: DEMO_CLIENT)
          </p>
        </div>
      </div>

      {/* Job Posting Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Senior Python Developer"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Remote, New York, San Francisco"
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience Level
              </label>
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Salary Range (Optional)
              </label>
              <input
                type="text"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 80000 - 120000"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe the role, responsibilities, and requirements..."
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              Required Skills
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </label>
            <textarea
              name="required_skills"
              value={formData.required_skills}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe the skills and qualifications needed for this role..."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter skills in natural language - no need for comma separation
            </p>
          </div>

          {/* Preview Section */}
          {formData.title && formData.description && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Job Preview</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p className="font-semibold">{formData.title} - {formData.department} | {formData.location} | {formData.employment_type}</p>
                <p className="text-sm">Experience: {formData.experience_level} Level</p>
                {formData.salary_range && (
                  <p className="text-sm">Salary: {formData.salary_range}</p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Posting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Post Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

