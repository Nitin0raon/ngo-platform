import { useState } from 'react'
import Badge from './Badge'
import Button from './Button'
import { programService } from '../services/programService'
import { useAuth } from '../context/AuthContext'

const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
  </svg>
)

const LocationIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
  </svg>
)

const UsersIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 17a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
  </svg>
)

function CapacityBar({ current, capacity }) {
  const pct = capacity > 0 ? Math.min(100, (current / capacity) * 100) : 0
  const isFull = pct >= 100
  const isNearFull = pct >= 80

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <UsersIcon />
          <span>{current} / {capacity} participants</span>
        </span>
        <span className={`font-medium ${isFull ? 'text-red-600' : isNearFull ? 'text-amber-600' : 'text-forest-600'}`}>
          {isFull ? 'Full' : `${capacity - current} slots left`}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isFull ? 'bg-red-400' : isNearFull ? 'bg-amber-400' : 'bg-forest-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function ProgramCard({
  program,
  isJoined = false,
  showActions = true,
  onJoin,
  onLeave,
  variant = 'default',
}) {
  const { isVolunteer } = useAuth()
  const [joining, setJoining] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [joined, setJoined] = useState(isJoined)
  const [error, setError] = useState(null)

  const isFull = program.is_full || program.current_participants >= program.capacity
  const isActive = program.status === 'active'

  const handleJoin = async () => {
    setJoining(true)
    setError(null)
    try {
      await programService.joinProgram(program.id)
      setJoined(true)
      onJoin && onJoin(program.id)
    } catch (err) {
      const msg = err?.response?.data?.error
        || err?.response?.data?.program_id?.[0]
        || 'Failed to join program'
      setError(msg)
    } finally {
      setJoining(false)
    }
  }

  const handleLeave = async () => {
    setLeaving(true)
    setError(null)
    try {
      await programService.leaveProgram(program.id)
      setJoined(false)
      onLeave && onLeave(program.id)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to leave program')
    } finally {
      setLeaving(false)
    }
  }

  return (
    <div className={`card overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col group ${
      variant === 'compact' ? 'p-4' : 'p-5'
    } animate-slide-up`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-display font-semibold text-gray-900 leading-snug group-hover:text-forest-700 transition-colors truncate ${
            variant === 'compact' ? 'text-base' : 'text-lg'
          }`}>
            {program.title}
          </h3>
          {program.created_by?.organization_name && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              by {program.created_by.organization_name}
            </p>
          )}
        </div>
        <Badge status={program.status} size="sm" />
      </div>

      {/* Description */}
      {variant !== 'compact' && (
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
          {program.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-400">
        {program.location && (
          <span className="flex items-center gap-1">
            <LocationIcon />
            <span className="truncate max-w-[120px]">{program.location}</span>
          </span>
        )}
        {program.start_date && (
          <span className="flex items-center gap-1">
            <CalendarIcon />
            <span>{new Date(program.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </span>
        )}
      </div>

      {/* Capacity bar */}
      <div className="mb-4">
        <CapacityBar current={program.current_participants} capacity={program.capacity} />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg mb-3">
          {error}
        </p>
      )}

      {/* Actions */}
      {showActions && isVolunteer && isActive && (
        <div className="pt-3 border-t border-gray-50">
          {joined ? (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              loading={leaving}
              onClick={handleLeave}
            >
              Leave Program
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              loading={joining}
              disabled={isFull}
              onClick={handleJoin}
            >
              {isFull ? 'Program Full' : 'Join Program'}
            </Button>
          )}
        </div>
      )}

      {/* Joined indicator */}
      {joined && isVolunteer && (
        <div className="flex items-center gap-1.5 pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse-soft" />
          <span className="text-xs text-forest-700 font-medium">You're participating</span>
        </div>
      )}
    </div>
  )
}
