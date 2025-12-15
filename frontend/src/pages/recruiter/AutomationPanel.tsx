import { useState } from 'react'
import toast from 'react-hot-toast'
import { triggerAutomation } from '../../services/api'

export default function AutomationPanel() {
  const [loading, setLoading] = useState<string | null>(null)

  const automations = [
    {
      id: 'shortlist',
      title: 'Shortlist Notification',
      description: 'Send email to candidates who have been shortlisted',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green',
    },
    {
      id: 'interview',
      title: 'Interview Notification',
      description: 'Send interview schedules to candidates',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'blue',
    },
    {
      id: 'offer',
      title: 'Offer Notification',
      description: 'Send offer letters to selected candidates',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'purple',
    },
    {
      id: 'rejection',
      title: 'Rejection Notification',
      description: 'Send polite rejection emails to candidates',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'red',
    },
    {
      id: 'reminder',
      title: 'Task Reminder',
      description: 'Remind candidates about pending tasks',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      color: 'yellow',
    },
    {
      id: 'feedback',
      title: 'Feedback Request',
      description: 'Request feedback from interviewers',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'blue',
    },
  ]

  const colorClasses = {
    green: 'from-green-500 to-green-700',
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-purple-700',
    red: 'from-red-500 to-red-700',
    yellow: 'from-yellow-500 to-yellow-700',
  }

  const handleTrigger = async (type: string, title: string) => {
    setLoading(type)
    try {
      await triggerAutomation(type)
      toast.success(`${title} triggered successfully!`)
    } catch (error) {
      toast.error(`Failed to trigger ${title}`)
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 backdrop-blur-xl border border-green-300/20 dark:border-green-500/20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Automation Panel</h1>
        <p className="text-gray-400">Trigger automated notifications and workflows</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((automation) => (
          <div key={automation.id} className="card hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[automation.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center text-white`}>
                {automation.icon}
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">{automation.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{automation.description}</p>
            
            <button
              onClick={() => handleTrigger(automation.id, automation.title)}
              disabled={loading === automation.id}
              className="w-full btn-primary"
            >
              {loading === automation.id ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Triggering...
                </span>
              ) : (
                'Trigger Now'
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Automation History */}
      <div className="mt-8 card">
        <h2 className="text-xl font-bold text-white mb-4">Recent Automation History</h2>
        <div className="space-y-3">
          {[
            { type: 'Shortlist Notification', time: '2 hours ago', status: 'success', count: 15 },
            { type: 'Interview Notification', time: '5 hours ago', status: 'success', count: 8 },
            { type: 'Offer Notification', time: '1 day ago', status: 'success', count: 3 },
            { type: 'Task Reminder', time: '2 days ago', status: 'success', count: 12 },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <p className="text-white font-medium">{item.type}</p>
                  <p className="text-gray-400 text-sm">{item.count} recipients • {item.time}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-xs font-medium">
                Success
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
