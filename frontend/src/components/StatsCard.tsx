interface CardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  color?: string
  trend?: { value: number; label: string }
}

export default function StatsCard({ title, value, icon, color = 'blue', trend }: CardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    yellow: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    pink: 'from-pink-500 to-pink-600',
  }

  const bgColors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-emerald-50 dark:bg-emerald-900/20',
    yellow: 'bg-amber-50 dark:bg-amber-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    pink: 'bg-pink-50 dark:bg-pink-900/20',
  }

  return (
    <div className={`card relative overflow-hidden ${bgColors[color as keyof typeof bgColors] || bgColors.blue}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-xs sm:text-sm ${trend.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.value >= 0 ? (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="font-semibold">{Math.abs(trend.value)}%</span>
              <span className="text-gray-500 dark:text-gray-400 truncate">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>
      {/* Decorative element */}
      <div className={`absolute -right-6 sm:-right-8 -bottom-6 sm:-bottom-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full opacity-10 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`} />
    </div>
  )
}
