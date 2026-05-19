import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await authService.login(form.email, form.password)
      login(data.user, data.access, data.refresh)

      const dest = data.user.role === 'ngo' ? '/ngo-home' : '/volunteer-home'
      navigate(from !== '/dashboard' ? from : dest, { replace: true })
    } catch {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">

      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8">

        <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
          Welcome back
        </h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Sign in to continue
        </p>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition"
          />

          <button
            type="submit"
            className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-green-700 font-medium hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}