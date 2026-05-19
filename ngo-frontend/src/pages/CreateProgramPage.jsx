import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { programService } from '../services/programService'
import MainLayout from '../layouts/MainLayout'
import Button from '../components/Button'

const SuccessScreen = ({ title, onGoBack, onCreateAnother }) => (
  <div className="max-w-lg mx-auto text-center py-16 animate-slide-up">
    <div className="w-20 h-20 bg-forest-50 border-4 border-forest-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
      🎉
    </div>
    <h2 className="font-display text-2xl font-semibold text-gray-900 mb-3">
      Program created!
    </h2>
    <p className="text-gray-500 mb-8">
      <span className="font-medium text-gray-700">"{title}"</span> is now live.
      Volunteers can discover and join it immediately.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <Button variant="primary" onClick={onGoBack}>
        View programs
      </Button>
      <Button variant="secondary" onClick={onCreateAnother}>
        Create another
      </Button>
    </div>
  </div>
)

const FormSection = ({ title, children }) => (
  <div className="card p-6 space-y-5">
    <h3 className="font-display font-semibold text-gray-900 text-sm uppercase tracking-wider text-gray-500">
      {title}
    </h3>
    {children}
  </div>
)

const Field = ({ label, required, hint, error, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-400">*</span>}
      {hint && <span className="text-gray-400 font-normal ml-1">({hint})</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-600 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
)

export default function CreateProgramPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    capacity: '',
    status: 'active',
    start_date: '',
    end_date: '',
    location: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required.'
    else if (form.title.length < 5) errs.title = 'Title must be at least 5 characters.'
    if (!form.description.trim()) errs.description = 'Description is required.'
    else if (form.description.length < 20) errs.description = 'Description must be at least 20 characters.'
    if (!form.capacity) errs.capacity = 'Capacity is required.'
    else if (parseInt(form.capacity) < 1) errs.capacity = 'Capacity must be at least 1.'
    else if (parseInt(form.capacity) > 10000) errs.capacity = 'Capacity cannot exceed 10,000.'
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      errs.end_date = 'End date cannot be before start date.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const payload = {
        ...form,
        capacity: parseInt(form.capacity),
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        location: form.location || null,
      }
      await programService.createProgram(payload)
      setSuccess(form.title)
    } catch (err) {
      const errData = err?.response?.data
      if (errData && typeof errData === 'object') {
        const mapped = {}
        Object.keys(errData).forEach(k => {
          mapped[k] = Array.isArray(errData[k]) ? errData[k][0] : errData[k]
        })
        setErrors(mapped)
      } else {
        setErrors({ general: 'Failed to create program. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSuccess(null)
    setForm({
      title: '',
      description: '',
      capacity: '',
      status: 'active',
      start_date: '',
      end_date: '',
      location: '',
    })
    setErrors({})
  }

  if (success) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SuccessScreen
            title={success}
            onGoBack={() => navigate('/programs')}
            onCreateAnother={handleReset}
          />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4 transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <h1 className="font-display text-3xl font-semibold text-gray-900 mb-2">
            Create a new program
          </h1>
          <p className="text-gray-500 text-sm">
            Fill in the details below to publish your volunteer program.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">

          {/* Basic info */}
          <FormSection title="Basic Information">
            <Field label="Program title" required error={errors.title}>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Tree Plantation Drive 2024"
                className={`input-field ${errors.title ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : ''}`}
                maxLength={255}
              />
              <div className="text-xs text-gray-300 text-right mt-1">{form.title.length}/255</div>
            </Field>

            <Field label="Description" required error={errors.description}>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe what volunteers will do, what to bring, and why this program matters…"
                className={`input-field resize-none ${errors.description ? 'border-red-300 focus:ring-red-400' : ''}`}
              />
              <div className="text-xs text-gray-300 text-right mt-1">{form.description.length} chars</div>
            </Field>
          </FormSection>

          {/* Capacity & Status */}
          <FormSection title="Program Details">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Volunteer capacity" required hint="max participants" error={errors.capacity}>
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  max="10000"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="50"
                  className={`input-field ${errors.capacity ? 'border-red-300 focus:ring-red-400' : ''}`}
                />
              </Field>

              <Field label="Program status" error={errors.status}>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="active">Active — open for volunteers</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>
            </div>

            <Field label="Location" hint="optional" error={errors.location}>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. City Central Park, Mumbai"
                className="input-field"
              />
            </Field>
          </FormSection>

          {/* Dates */}
          <FormSection title="Schedule">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Start date" hint="optional" error={errors.start_date}>
                <input
                  name="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </Field>

              <Field label="End date" hint="optional" error={errors.end_date}>
                <input
                  name="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={handleChange}
                  min={form.start_date || new Date().toISOString().split('T')[0]}
                  className={`input-field ${errors.end_date ? 'border-red-300' : ''}`}
                />
              </Field>
            </div>
          </FormSection>

          {/* Preview card */}
          {form.title && (
            <div className="animate-fade-in">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">
                Preview
              </p>
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-gray-900">{form.title || 'Program title'}</h3>
                  <span className="px-2.5 py-1 bg-forest-50 text-forest-700 text-xs font-medium rounded-full border border-forest-100">
                    ● Active
                  </span>
                </div>
                {form.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{form.description}</p>
                )}
                <div className="flex gap-4 text-xs text-gray-400">
                  {form.location && <span>📍 {form.location}</span>}
                  {form.capacity && <span>👥 0 / {form.capacity} participants</span>}
                </div>
              </div>
            </div>
          )}

          {/* Global error */}
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 animate-fade-in">
              {errors.general}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
            >
              Publish program
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
