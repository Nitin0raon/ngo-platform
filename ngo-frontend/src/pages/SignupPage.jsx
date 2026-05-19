import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

export default function SignupPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    role: '',
    email: '',
    first_name: '',
    last_name: '',
    organization_name: '',
    bio: '',
    phone_number: '',
    password: '',
    password_confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateStep = () => {
    const errs = {}

    if (step === 0 && !form.role) errs.role = 'Select account type'

    if (step === 1) {
      if (!form.email) errs.email = 'Email required'
      if (!form.first_name) errs.first_name = 'Required'
      if (!form.last_name) errs.last_name = 'Required'
      if (form.role === 'ngo' && !form.organization_name)
        errs.organization_name = 'Required'
    }

    if (step === 2) {
      if (!form.password) errs.password = 'Required'
      if (form.password !== form.password_confirm)
        errs.password_confirm = 'Passwords mismatch'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1)
  }

  const handleBack = () => {
    setStep(s => s - 1)
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep()) return

    setLoading(true)
    try {
      const payload = {
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role,
        password: form.password,
        password_confirm: form.password_confirm,
        ...(form.role === 'ngo' && { organization_name: form.organization_name }),
        ...(form.bio && { bio: form.bio }),
        ...(form.phone_number && { phone_number: form.phone_number }),
      }

      const data = await authService.register(payload)
      login(data.user, data.tokens.access, data.tokens.refresh)

      navigate(data.user.role === 'ngo' ? '/ngo-home' : '/volunteer-home')
    } catch (err) {
      setErrors({ general: 'Registration failed. Check inputs.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8">

        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900">
          Create account
        </h1>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {[0,1,2].map(i => (
            <div
              key={i}
              className={`h-1 w-8 rounded-full ${
                i <= step ? 'bg-green-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Error */}
        {errors.general && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {errors.general}
          </p>
        )}

        <form onSubmit={step === 2 ? handleSubmit : (e)=>{e.preventDefault();handleNext()}}>

          {/* STEP 0 */}
          {step === 0 && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={()=>setForm({...form,role:'volunteer'})}
                className={`w-full p-4 rounded-lg border ${
                  form.role==='volunteer' ? 'border-green-600 bg-green-50' : ''
                }`}
              >
                Volunteer
              </button>

              <button
                type="button"
                onClick={()=>setForm({...form,role:'ngo'})}
                className={`w-full p-4 rounded-lg border ${
                  form.role==='ngo' ? 'border-green-600 bg-green-50' : ''
                }`}
              >
                NGO
              </button>

              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First name" className="input-field" />
              <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last name" className="input-field" />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input-field" />

              {form.role === 'ngo' && (
                <input name="organization_name" value={form.organization_name} onChange={handleChange} placeholder="Organization" className="input-field" />
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" className="input-field" />
              <input name="password_confirm" value={form.password_confirm} onChange={handleChange} type="password" placeholder="Confirm password" className="input-field" />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            {step > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 hover:text-black"
              >
                Back
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 transition"
            >
              {step === 2 ? 'Create account' : 'Continue'}
            </button>
          </div>

        </form>

        <p className="text-center text-sm mt-6 text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-green-700">Sign in</Link>
        </p>

      </div>
    </div>
  )
}