import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  getTopMatches, 
  getJobById, 
  shortlistCandidate, 
  rejectCandidate,
  scheduleInterview,
  type MatchResult,
  type Job
} from '../../services/api'
import Table from '../../components/Table'
import Loading from '../../components/Loading'

export default function ApplicantsMatching() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job | null>(null)
  const [candidates, setCandidates] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<MatchResult | null>(null)

  useEffect(() => {
    loadData()
  }, [jobId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [jobData, matchResults] = await Promise.all([
        getJobById(jobId!).catch(() => null),
        getTopMatches(jobId!, 20).catch(() => [])
      ])
      setJob(jobData)
      setCandidates(matchResults)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load applicants')
    } finally {
      setLoading(false)
    }
  }

  const handleShortlist = async (candidateId: string) => {
    try {
      await shortlistCandidate(jobId!, candidateId)
      toast.success('Candidate shortlisted successfully')
      loadData()
    } catch (error) {
      toast.error('Failed to shortlist candidate')
    }
  }

  const handleReject = async (candidateId: string) => {
    try {
      await rejectCandidate(jobId!, candidateId)
      toast.success('Candidate rejected')
      loadData()
    } catch (error) {
      toast.error('Failed to reject candidate')
    }
  }

  const handleScheduleInterview = async (candidateId: string) => {
    try {
      await scheduleInterview({
        candidate_id: candidateId,
        job_id: jobId!,
        job_title: job?.title,
        scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        interview_type: 'video',
        status: 'scheduled'
      })
      toast.success('Interview scheduled')
    } catch (error) {
      toast.error('Failed to schedule interview')
    }
  }

  const formatSalary = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'badge-success'
    if (score >= 60) return 'badge-warning'
    return 'badge-danger'
  }

  if (loading) {
    return <Loading message="Loading applicants..." />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Button & Header */}
      <div>
        <button
          onClick={() => navigate('/recruiter')}
          className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
        <h1 className="page-title">{job?.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className="badge badge-info">{job?.location}</span>
          <span className="badge badge-purple">{job?.job_type}</span>
          <span className="badge badge-success">{job?.department}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Applicants</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{candidates.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="card bg-emerald-50 dark:bg-emerald-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Salary Range</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatSalary(job?.salary_min ?? 0)} - {formatSalary(job?.salary_max ?? 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Experience Required</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{job?.experience_required || 'Not specified'}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="section-title mb-1">Matched Candidates</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI-ranked based on job requirements</p>
          </div>
          <div className="flex gap-2">
            <span className="badge badge-success">High Match (80%+)</span>
            <span className="badge badge-warning">Medium (60-79%)</span>
            <span className="badge badge-danger">Low (&lt;60%)</span>
          </div>
        </div>
        
        {candidates.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="empty-state-text">No applicants yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Candidates will appear here once they apply</p>
          </div>
        ) : (
          <Table
            columns={['Candidate', 'Match Score', 'Skills Match', 'Experience', 'Location', 'Matched Skills', 'Actions']}
            data={candidates}
            renderRow={(candidate) => (
              <>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {candidate.candidate_name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{candidate.candidate_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${getMatchScoreColor(candidate.match_score)}`}>
                    {candidate.match_score}%
                  </span>
                </td>
                <td className="text-gray-600 dark:text-gray-400">{candidate.skills_match}%</td>
                <td className="text-gray-600 dark:text-gray-400">{candidate.experience_match}%</td>
                <td className="text-gray-600 dark:text-gray-400">{candidate.location_match}%</td>
                <td>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {candidate.matched_skills.slice(0, 3).map((skill: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {candidate.matched_skills.length > 3 && (
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
                        +{candidate.matched_skills.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                      title="View Details"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-purple-600 dark:text-purple-400 transition-colors"
                      title="View Details"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleShortlist(candidate.candidate_id)}
                      className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400 transition-colors"
                      title="Shortlist"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleScheduleInterview(candidate.candidate_id)}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                      title="Schedule Interview"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => navigate(`/recruiter/feedback/${candidate.candidate_id}`)}
                      className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400 transition-colors"
                      title="Add Feedback"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleReject(candidate.candidate_id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                      title="Reject"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </td>
              </>
            )}
          />
        )}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200 dark:border-gray-700 animate-scale-in">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {selectedCandidate.candidate_name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCandidate.candidate_name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{selectedCandidate.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Match Score Banner */}
              <div className={`rounded-xl p-4 mb-6 ${
                selectedCandidate.match_score >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800' :
                selectedCandidate.match_score >= 60 ? 'bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800' :
                'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Match Score</span>
                  <span className={`text-3xl font-bold ${
                    selectedCandidate.match_score >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                    selectedCandidate.match_score >= 60 ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>{selectedCandidate.match_score}%</span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience Match</p>
                  <p className="text-gray-900 dark:text-white font-semibold mt-1">{selectedCandidate.experience_match}%</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location Match</p>
                  <p className="text-gray-900 dark:text-white font-semibold mt-1">{selectedCandidate.location_match}%</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills Match</p>
                  <p className="text-gray-900 dark:text-white font-semibold mt-1">{selectedCandidate.skills_match}%</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Matched Skills</p>
                  <p className="text-gray-900 dark:text-white font-semibold mt-1">{selectedCandidate.matched_skills.length}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Matched Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.matched_skills.map((skill: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg font-medium text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              {selectedCandidate.missing_skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Missing Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.missing_skills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-medium text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    handleShortlist(selectedCandidate.candidate_id)
                    setSelectedCandidate(null)
                  }}
                  className="btn-success flex-1"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Shortlist Candidate
                </button>
                <button
                  onClick={() => {
                    navigate(`/recruiter/feedback/${selectedCandidate.candidate_id}`)
                  }}
                  className="btn-primary flex-1"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Add Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
