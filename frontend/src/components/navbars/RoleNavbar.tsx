import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useSidebar } from '../../context/SidebarContext'

interface RoleNavbarProps {
  role: 'candidate' | 'recruiter' | 'client'
}

const roleConfig = {
  candidate: {
    gradient: 'from-blue-500 to-cyan-500',
    title: 'Candidate Portal',
    homePath: '/candidate/dashboard',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  recruiter: {
    gradient: 'from-emerald-500 to-teal-500',
    title: 'Recruiter Console',
    homePath: '/recruiter',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  client: {
    gradient: 'from-purple-500 to-pink-500',
    title: 'Client Dashboard',
    homePath: '/client',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
}

export default function RoleNavbar({ role }: RoleNavbarProps) {
  const { theme, toggleTheme } = useTheme()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const navigate = useNavigate()
  const config = roleConfig[role]

  const handleLogout = () => {
    localStorage.removeItem('user_role')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_name')
    localStorage.removeItem('isAuthenticated')
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-b border-gray-200/50 dark:border-slate-700/50 z-50 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo - Click to Toggle Sidebar */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="flex items-center space-x-3 group"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
              {config.icon}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xl font-bold">
                <span className="bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Infiverse
                </span>
                <span className="text-gray-900 dark:text-white"> HR</span>
              </span>
              <p className={`text-xs bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent font-medium`}>
                {config.title}
              </p>
            </div>
          </button>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Search Bar */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 pl-10 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 text-gray-700 dark:text-gray-300 hover:scale-110"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          
          {/* Notifications */}
          <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 text-gray-700 dark:text-gray-300 hover:scale-110 relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200 dark:border-slate-700">
            <div className={`w-8 h-8 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center shadow-md`}>
              <span className="text-white font-semibold text-sm">
                {localStorage.getItem('user_name')?.charAt(0).toUpperCase() || role.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {localStorage.getItem('user_name') || role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {config.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
