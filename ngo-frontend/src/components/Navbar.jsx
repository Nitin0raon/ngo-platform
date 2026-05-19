import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { notificationService } from '../services/notificationService'

export default function Navbar() {
  const { user, isAuthenticated, isNGO, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    notificationService.getUnreadCount()
      .then(d => setUnreadCount(d.unread_count || 0))
      .catch(() => {})
  }, [isAuthenticated, location.pathname])

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh_token')
    await logout(refresh)
    navigate('/')
  }

  const navLinks = isAuthenticated
    ? [
        { to: isNGO ? '/ngo-home' : '/volunteer-home', label: 'Home' },
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/programs', label: 'Programs' },
        ...(isNGO ? [{ to: '/create-program', label: 'Create Program' }] : []),
        { to: '/settings', label: 'Settings' },
      ]
    : []

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link
            to={isAuthenticated ? (isNGO ? '/ngo-home' : '/volunteer-home') : '/'}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition">
              V
            </div>
            <span className="text-xl font-semibold tracking-tight text-gray-900 group-hover:text-green-700 transition">
              Volunect
            </span>
          </Link>

          {/* NAV LINKS */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `relative text-sm font-medium transition-all duration-300 ${
                      isActive ? 'text-green-700' : 'text-gray-600'
                    } hover:text-green-700`
                  }
                >
                  {label}

                  {/* underline animation */}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              ))}
            </div>
          )}

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {isAuthenticated ? (
              <>
                {/* Notification */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 text-[10px] bg-red-500 text-white px-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-700 to-green-600 rounded-lg shadow hover:shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-green-700 transition"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-5 py-2 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-lg shadow hover:shadow-lg hover:scale-[1.05] active:scale-95 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </nav>
  )
}