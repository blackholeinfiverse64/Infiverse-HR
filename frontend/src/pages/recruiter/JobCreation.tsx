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
    department: '',
    location: '',
    jobType: '',
    experienceRange: '',
    salaryMin: '',
    salaryMax: '',
    educationLevel: '',
    skills: '',
    certifications: '',
    description: '',
    contractPeriod: '',
    workingHours: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createJob(formData)
      toast.success('Job created successfully!')
      navigate('/recruiter')
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Job</h1>
        <p className="text-gray-400">Fill in the details to post a new job opening</p>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Senior Frontend Developer"
            required
          />

          <FormInput
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            options={[
              { value: 'IT', label: 'IT' },
              { value: 'Sales', label: 'Sales' },
              { value: 'HR', label: 'HR' },
              { value: 'Finance', label: 'Finance' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Operations', label: 'Operations' },
            ]}
          />

          <FormInput
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Bangalore"
            required
          />

          <FormInput
            label="Job Type"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            required
            options={[
              { value: 'Remote', label: 'Remote' },
              { value: 'On-site', label: 'On-site' },
              { value: 'Hybrid', label: 'Hybrid' },
            ]}
          />

          <FormInput
            label="Experience Range"
            name="experienceRange"
            value={formData.experienceRange}
            onChange={handleChange}
            required
            options={[
              { value: '0-1', label: '0-1 years' },
              { value: '1-3', label: '1-3 years' },
              { value: '3-5', label: '3-5 years' },
              { value: '5+', label: '5+ years' },
            ]}
          />

          <FormInput
            label="Education Level"
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            required
            options={[
              { value: 'High School', label: 'High School' },
              { value: 'Bachelor', label: 'Bachelor' },
              { value: 'Master', label: 'Master' },
              { value: 'PhD', label: 'PhD' },
            ]}
          />

          <FormInput
            label="Salary Min (₹)"
            name="salaryMin"
            type="number"
            value={formData.salaryMin}
            onChange={handleChange}
            placeholder="e.g., 1200000"
            required
          />

          <FormInput
            label="Salary Max (₹)"
            name="salaryMax"
            type="number"
            value={formData.salaryMax}
            onChange={handleChange}
            placeholder="e.g., 2000000"
            required
          />

          <FormInput
            label="Contract Period (Optional)"
            name="contractPeriod"
            value={formData.contractPeriod}
            onChange={handleChange}
            placeholder="e.g., 6 months, 1 year"
          />

          <FormInput
            label="Working Hours (Optional)"
            name="workingHours"
            value={formData.workingHours}
            onChange={handleChange}
            placeholder="e.g., 9 AM - 6 PM"
          />
        </div>

        <div className="mt-6">
          <FormInput
            label="Required Skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., React, TypeScript, Tailwind CSS (comma separated)"
            required
          />

          <FormInput
            label="Certifications / Special Skills (Optional)"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            placeholder="e.g., AWS Certified, PMP"
          />

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
