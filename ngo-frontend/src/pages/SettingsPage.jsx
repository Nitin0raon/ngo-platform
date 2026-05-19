import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import MainLayout from '../layouts/MainLayout'

/* ─── Icons ──────────────────────────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
  </svg>
)
const EyeOpen = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
  </svg>
)
const EyeClosed = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd"/>
    <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z"/>
  </svg>
)

/* ─── Reusable primitives ────────────────────────────────────────────────────── */
function SectionCard({ title, subtitle, children }) {
  return (
    <div className="card p-6 space-y-5">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="font-display font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, hint, error, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-400 text-xs">*</span>}
        {hint && <span className="text-gray-400 text-xs font-normal">({hint})</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
            <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.75 2.75a.75.75 0 011.5 0v2.5a.75.75 0 01-1.5 0v-2.5zm.75 5a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

function SuccessToast({ message }) {
  return (
    <div className="fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-forest-100 rounded-2xl shadow-popup animate-slide-in-right">
      <div className="w-7 h-7 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-600">
        <CheckIcon />
      </div>
      <span className="text-sm font-medium text-gray-900">{message}</span>
    </div>
  )
}

/* ─── Avatar section ─────────────────────────────────────────────────────────── */
function AvatarSection({ user }) {
  const initials = ((user?.first_name?.[0] || '') + (user?.last_name?.[0] || '')).toUpperCase() || '?'
  return (
    <div className="flex items-center gap-5">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-forest-600 flex items-center justify-center text-white font-display text-2xl font-semibold shadow-sm">
          {initials}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-forest-500" />
      </div>
      <div>
        <p className="font-semibold text-gray-900">
          {user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Your Name'}
        </p>
        <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full mt-2 ${
          user?.role === 'ngo'
            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
            : 'bg-amber-50 text-amber-700 border border-amber-100'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {user?.role === 'ngo' ? 'NGO Account' : 'Volunteer'}
        </span>
      </div>
    </div>
  )
}

/* ─── Profile section (shared name/email fields) ─────────────────────────────── */
function ProfileSection({ user, updateUser, onSuccess }) {
  const [form, setForm]     = useState({
    first_name:  user?.first_name  || '',
    last_name:   user?.last_name   || '',
    phone_number: user?.phone_number || '',
  })
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})

  const set = e => {
    setForm(p => ({...p, [e.target.name]: e.target.value}))
    setErrors(p => ({...p, [e.target.name]: ''}))
  }

  const validate = () => {
    const e = {}
    if (!form.first_name.trim()) e.first_name = 'First name is required.'
    if (!form.last_name.trim())  e.last_name  = 'Last name is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async e => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const updated = await authService.updateProfile(form)
      updateUser(updated)
      onSuccess('Profile updated successfully!')
    } catch (err) {
      const d = err?.response?.data || {}
      if (typeof d === 'object') {
        const mapped = {}
        Object.keys(d).forEach(k => { mapped[k] = Array.isArray(d[k]) ? d[k][0] : d[k] })
        setErrors(mapped)
      } else {
        setErrors({ general: 'Update failed. Please try again.' })
      }
    } finally { setLoading(false) }
  }

  return (
    <SectionCard title="Personal information" subtitle="Update your name and contact details.">
      <AvatarSection user={user} />

      <form onSubmit={submit} className="space-y-4 pt-2">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First name" required error={errors.first_name}>
            <input
              name="first_name" value={form.first_name} onChange={set}
              placeholder="John"
              className={`input-field ${errors.first_name ? 'border-red-300 focus:ring-red-400' : ''}`}
            />
          </Field>
          <Field label="Last name" required error={errors.last_name}>
            <input
              name="last_name" value={form.last_name} onChange={set}
              placeholder="Doe"
              className={`input-field ${errors.last_name ? 'border-red-300 focus:ring-red-400' : ''}`}
            />
          </Field>
        </div>

        <Field label="Email address" hint="cannot be changed">
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="input-field opacity-50 cursor-not-allowed bg-gray-50"
          />
        </Field>

        <Field label="Phone number" hint="optional" error={errors.phone_number}>
          <input
            name="phone_number" value={form.phone_number} onChange={set}
            placeholder="+91-98765-43210"
            className="input-field"
          />
        </Field>

        {errors.general && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{errors.general}</p>
        )}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : 'Save changes'}
          </button>
        </div>
      </form>
    </SectionCard>
  )
}

/* ─── NGO-specific section ───────────────────────────────────────────────────── */
function NGOSection({ user, updateUser, onSuccess }) {
  const [form, setForm] = useState({
    organization_name:        user?.organization_name        || '',
    organization_description: user?.organization_description || '',
  })
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})

  const set = e => {
    setForm(p => ({...p, [e.target.name]: e.target.value}))
    setErrors(p => ({...p, [e.target.name]: ''}))
  }

  const submit = async e => {
    e.preventDefault()
    if (!form.organization_name.trim()) {
      setErrors({ organization_name: 'Organization name is required.' })
      return
    }
    setLoading(true)
    try {
      const updated = await authService.updateProfile(form)
      updateUser(updated)
      onSuccess('Organization info updated!')
    } catch {
      setErrors({ general: 'Update failed. Please try again.' })
    } finally { setLoading(false) }
  }

  return (
    <SectionCard title="Organization details" subtitle="Update your NGO's name and public description.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Organization name" required error={errors.organization_name}>
          <input
            name="organization_name" value={form.organization_name} onChange={set}
            placeholder="e.g. Green Earth Foundation"
            className={`input-field ${errors.organization_name ? 'border-red-300' : ''}`}
          />
        </Field>

        <Field label="Organization description" hint="shown to volunteers">
          <textarea
            name="organization_description" value={form.organization_description} onChange={set}
            rows={4}
            placeholder="Tell volunteers about your NGO's mission, values, and the kind of programs you run…"
            className="input-field resize-none"
          />
          <div className="text-xs text-gray-300 text-right mt-1 font-mono">{form.organization_description.length} chars</div>
        </Field>

        {errors.general && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{errors.general}</p>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : 'Update organization'}
          </button>
        </div>
      </form>
    </SectionCard>
  )
}

/* ─── Volunteer-specific section ─────────────────────────────────────────────── */
function VolunteerSection({ user, updateUser, onSuccess }) {
  const [bio, setBio]     = useState(user?.bio || '')
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await authService.updateProfile({ bio })
      updateUser(updated)
      onSuccess('Bio updated successfully!')
    } catch {
      // silent
    } finally { setLoading(false) }
  }

  return (
    <SectionCard title="Volunteer bio" subtitle="A short bio shown to NGOs when you join their programs.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Bio" hint="optional">
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            placeholder="Tell NGOs a bit about yourself — your skills, interests, and why you volunteer…"
            className="input-field resize-none"
            maxLength={500}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-300">Max 500 characters</span>
            <span className="text-xs text-gray-300 font-mono">{bio.length}/500</span>
          </div>
        </Field>
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : 'Update bio'}
          </button>
        </div>
      </form>
    </SectionCard>
  )
}

/* ─── Password section ───────────────────────────────────────────────────────── */
function PasswordSection({ onSuccess }) {
  const [form, setForm] = useState({
    old_password: '', new_password: '', new_password_confirm: '',
  })
  const [showOld,    setShowOld]    = useState(false)
  const [showNew,    setShowNew]    = useState(false)
  const [showConf,   setShowConf]   = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [errors,     setErrors]     = useState({})

  const set = e => {
    setForm(p => ({...p, [e.target.name]: e.target.value}))
    setErrors(p => ({...p, [e.target.name]: ''}))
  }

  const validate = () => {
    const e = {}
    if (!form.old_password) e.old_password = 'Current password is required.'
    if (!form.new_password) e.new_password = 'New password is required.'
    else if (form.new_password.length < 8) e.new_password = 'At least 8 characters required.'
    if (form.new_password !== form.new_password_confirm) e.new_password_confirm = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Strength indicator
  const strength = (() => {
    const p = form.new_password
    if (!p) return 0
    let s = 0
    if (p.length >= 8)         s++
    if (/[A-Z]/.test(p))       s++
    if (/[0-9]/.test(p))       s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()

  const strengthConfig = [
    { label: 'Weak',   color: 'bg-red-400'    },
    { label: 'Fair',   color: 'bg-orange-400' },
    { label: 'Good',   color: 'bg-amber-400'  },
    { label: 'Strong', color: 'bg-forest-500' },
  ]

  const submit = async e => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await authService.changePassword(form)
      setForm({ old_password: '', new_password: '', new_password_confirm: '' })
      setErrors({})
      onSuccess('Password changed successfully!')
    } catch (err) {
      const d = err?.response?.data || {}
      if (d.old_password) setErrors({ old_password: Array.isArray(d.old_password) ? d.old_password[0] : d.old_password })
      else if (d.new_password) setErrors({ new_password: Array.isArray(d.new_password) ? d.new_password[0] : d.new_password })
      else setErrors({ general: 'Failed to change password. Check your current password and try again.' })
    } finally { setLoading(false) }
  }

  function PasswordInput({ name, value, show, onToggle, placeholder, error }) {
    return (
      <div className="relative">
        <input
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={set}
          placeholder={placeholder}
          className={`input-field pr-11 ${error ? 'border-red-300 focus:ring-red-400' : ''}`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOpen /> : <EyeClosed />}
        </button>
      </div>
    )
  }

  return (
    <SectionCard title="Change password" subtitle="Choose a strong password with at least 8 characters.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Current password" required error={errors.old_password}>
          <PasswordInput
            name="old_password" value={form.old_password}
            show={showOld} onToggle={() => setShowOld(p => !p)}
            placeholder="Enter current password"
            error={errors.old_password}
          />
        </Field>

        <Field label="New password" required error={errors.new_password}>
          <PasswordInput
            name="new_password" value={form.new_password}
            show={showNew} onToggle={() => setShowNew(p => !p)}
            placeholder="Min. 8 characters"
            error={errors.new_password}
          />
          {/* Strength meter */}
          {form.new_password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[0,1,2,3].map(i => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                    i < strength ? strengthConfig[strength - 1]?.color : 'bg-gray-100'
                  }`} />
                ))}
              </div>
              <p className={`text-xs font-medium ${
                strength <= 1 ? 'text-red-600' : strength === 2 ? 'text-amber-600' : strength === 3 ? 'text-amber-500' : 'text-forest-600'
              }`}>
                {strengthConfig[strength - 1]?.label || 'Enter a password'}
              </p>
            </div>
          )}
        </Field>

        <Field label="Confirm new password" required error={errors.new_password_confirm}>
          <PasswordInput
            name="new_password_confirm" value={form.new_password_confirm}
            show={showConf} onToggle={() => setShowConf(p => !p)}
            placeholder="Re-enter new password"
            error={errors.new_password_confirm}
          />
          {/* Match indicator */}
          {form.new_password && form.new_password_confirm && (
            <div className={`flex items-center gap-1.5 mt-1.5 text-xs font-medium ${
              form.new_password === form.new_password_confirm ? 'text-forest-600' : 'text-red-500'
            }`}>
              {form.new_password === form.new_password_confirm ? (
                <><CheckIcon /><span>Passwords match</span></>
              ) : (
                <><span>✗</span><span>Passwords don't match</span></>
              )}
            </div>
          )}
        </Field>

        {errors.general && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{errors.general}</p>
        )}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Changing…
              </>
            ) : 'Change password'}
          </button>
        </div>
      </form>
    </SectionCard>
  )
}

/* ─── Danger zone ────────────────────────────────────────────────────────────── */
function DangerZone({ onLogout }) {
  return (
    <SectionCard title="Account" subtitle="Manage your session and account settings.">
      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
        <div>
          <p className="text-sm font-medium text-gray-900">Sign out of Volunect</p>
          <p className="text-xs text-gray-400 mt-0.5">You'll need to sign in again to access your account.</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 bg-white rounded-xl hover:bg-red-50 hover:border-red-300 transition-all"
        >
          Sign out
        </button>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/30 mt-3">
        <div>
          <p className="text-sm font-medium text-red-700">Delete account</p>
          <p className="text-xs text-red-400 mt-0.5">This action is permanent and cannot be undone.</p>
        </div>
        <button
          disabled
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 bg-white rounded-xl opacity-40 cursor-not-allowed"
          title="Contact support to delete your account"
        >
          Delete
        </button>
      </div>
    </SectionCard>
  )
}

/* ─── Sidebar nav ────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'profile',      label: 'Profile',         icon: '👤' },
  { id: 'organization', label: 'Organization',     icon: '🏢', ngoOnly: true },
  { id: 'bio',          label: 'Bio',              icon: '📝', volunteerOnly: true },
  { id: 'password',     label: 'Change password',  icon: '🔒' },
  { id: 'account',      label: 'Account',          icon: '⚙️' },
]

/* ─── Main page ──────────────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const { user, isNGO, isVolunteer, updateUser, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('profile')
  const [toast, setToast] = useState(null)

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const handleLogout = () => {
    const rt = localStorage.getItem('refresh_token')
    authService.logout?.(rt).catch(() => {})
    logout()
    window.location.href = '/'
  }

  const visibleNav = NAV_ITEMS.filter(item => {
    if (item.ngoOnly && !isNGO)         return false
    if (item.volunteerOnly && !isVolunteer) return false
    return true
  })

  return (
    <MainLayout>
      {toast && <SuccessToast message={toast} />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your profile, organization details, and account security.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 animate-slide-up">

          {/* ── Sidebar nav ── */}
          <nav className="sm:w-52 flex-shrink-0">
            <ul className="space-y-0.5">
              {visibleNav.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                      activeSection === item.id
                        ? 'bg-forest-50 text-forest-700 border border-forest-100'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-base leading-none">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Content area ── */}
          <div className="flex-1 min-w-0">
            {activeSection === 'profile' && (
              <ProfileSection user={user} updateUser={updateUser} onSuccess={showToast} />
            )}
            {activeSection === 'organization' && isNGO && (
              <NGOSection user={user} updateUser={updateUser} onSuccess={showToast} />
            )}
            {activeSection === 'bio' && isVolunteer && (
              <VolunteerSection user={user} updateUser={updateUser} onSuccess={showToast} />
            )}
            {activeSection === 'password' && (
              <PasswordSection onSuccess={showToast} />
            )}
            {activeSection === 'account' && (
              <DangerZone onLogout={handleLogout} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
