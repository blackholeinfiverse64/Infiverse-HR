import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createJob } from '../../services/api'
import FormInput from '../../components/FormInput'

export default function JobCreation() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: '',
    experience_level: 'Entry',
    employment_type: 'Full-time',
    client_id: 1,
    description: '',
    requirements: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'client_id' ? parseInt(value) || 1 : value 
    }))
  }

  const handleClientIdChange = (delta: number) => {
    setFormData(prev => ({
      ...prev,
      client_id: Math.max(1, prev.client_id + delta)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.requirements) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const jobData = {
        title: formData.title,
        department: formData.department,
        location: formData.location,
        experience_level: formData.experience_level,
        employment_type: formData.employment_type,
        description: formData.description,
        requirements: formData.requirements,
        client_id: formData.client_id,
      }

      await createJob(jobData)
      toast.success('Job created successfully!')
      
      // Reset form
      setFormData({
        title: '',
        department: 'Engineering',
        location: '',
        experience_level: 'Entry',
        employment_type: 'Full-time',
        client_id: 1,
        description: '',
        requirements: '',
      })
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/recruiter')
      }, 1500)
    } catch (error) {
      toast.error('Failed to create job')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 backdrop-blur-xl border border-green-300/20 dark:border-green-500/20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Job Position</h1>
        <p className="text-gray-400">Fill in the details to post a new job opening</p>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Senior Software Engineer"
            required
          />

          <FormInput
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            options={[
              { value: 'Engineering', label: 'Engineering' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Sales', label: 'Sales' },
              { value: 'HR', label: 'HR' },
              { value: 'Operations', label: 'Operations' },
            ]}
          />

          <FormInput
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Remote, New York, London"
            required
          />

          <FormInput
            label="Experience Level"
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            required
            options={[
              { value: 'Entry', label: 'Entry' },
              { value: 'Mid', label: 'Mid' },
              { value: 'Senior', label: 'Senior' },
              { value: 'Lead', label: 'Lead' },
            ]}
          />

          <FormInput
            label="Employment Type"
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            required
            options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Intern', label: 'Intern' },
            ]}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client ID
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleClientIdChange(-1)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 transition-all font-semibold"
              >
                −
              </button>
              <input
                type="number"
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                min="1"
                className="input-field flex-1 text-center"
                required
              />
              <button
                type="button"
                onClick={() => handleClientIdChange(1)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 transition-all font-semibold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <FormInput
            label="Job Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities, and requirements..."
            textarea
            rows={6}
            required
          />

          <FormInput
            label="Key Requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="List the essential skills, experience, and qualifications..."
            textarea
            rows={6}
            required
          />
        </div>

        <div className="mt-8 flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/recruiter')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
