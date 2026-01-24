import { useState, useEffect } from 'react'
import { getJobs, getTopMatches, Job, MatchResult } from '../../services/api'
import Loading from '../../components/Loading'
import { toast } from 'react-hot-toast'

export default function MatchResults() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMatches, setLoadingMatches] = useState(false)

  useEffect(() => {
    loadJobs()
  }, [])

  useEffect(() => {
    if (selectedJobId) {
      loadMatches(selectedJobId)
    }
    // Auto-refresh every 30 seconds for real-time data
    const interval = setInterval(() => {
      if (selectedJobId) {
        loadMatches(selectedJobId)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [selectedJobId])

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

  const loadMatches = async (jobId: string) => {
    try {
      setLoadingMatches(true)
      const matchResults = await getTopMatches(jobId, 10)
      setMatches(matchResults)
    } catch (error) {
      console.error('Failed to load matches:', error)
      toast.error('Failed to load AI matches')
      setMatches([])
    } finally {
      setLoadingMatches(false)
    }
  }

  const handleGetMatches = () => {
    if (selectedJobId) {
      loadMatches(selectedJobId)
    } else {
      toast.error('Please select a job first')
    }
  }

  if (loading) {
    return <Loading message="Loading jobs..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 backdrop-blur-xl border border-blue-300/20 dark:border-blue-500/20 mb-8">
        <h1 className="page-title">AI Match Results</h1>
        <p className="page-subtitle">Get AI-powered candidate matches for your job postings</p>
      </div>

      {/* Job Selection */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Job for AI Matching
        </label>
        <div className="flex gap-4">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} (ID: {job.id})
              </option>
            ))}
          </select>
          <button
            onClick={handleGetMatches}
            disabled={loadingMatches || !selectedJobId}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingMatches ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Get AI Matches
              </>
            )}
          </button>
        </div>
      </div>

      {/* Matches Results */}
      {loadingMatches ? (
        <Loading message="Getting AI matches..." />
      ) : matches.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No matches found. Click "Get AI Matches" to find candidates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">
              Top {matches.length} Matches
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sorted by match score
            </span>
          </div>

          {matches.map((match, index) => (
            <div
              key={match.candidate_id || index}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {match.candidate_name?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {match.candidate_name || 'Unknown Candidate'}
                        </h3>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-semibold">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{match.email}</p>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Match Score</span>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {Math.round(match.match_score || 0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${match.match_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Detailed Scores */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Skills Match</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(match.skills_match || 0)}%
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Experience</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {Math.round(match.experience_match || 0)}%
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Location</p>
                      <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                        {Math.round(match.location_match || 0)}%
                      </p>
                    </div>
                  </div>

                  {/* Matched Skills */}
                  {match.matched_skills && match.matched_skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Matched Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {match.matched_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  {match.recommendation && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <span className="font-semibold">AI Recommendation:</span> {match.recommendation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="ml-4 flex flex-col gap-2">
                  <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium">
                    Shortlist
                  </button>
                  <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium">
                    View Profile
                  </button>
                  <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
