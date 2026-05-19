import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDashboard } from '../hooks'
import { programService } from '../services/programService'
import MainLayout from '../layouts/MainLayout'

/* ─── Icons ──────────────────────────────────────────────────────────────────── */
const CompassIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
  </svg>
)
const HeartIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.184C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.936a22.049 22.049 0 01-3.744 2.865l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z"/>
  </svg>
)
const TrophyIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v.387c-.827.157-1.5.854-1.5 1.778v1.826a3.001 3.001 0 002.632 2.977 9.028 9.028 0 006.125 6.384.75.75 0 01.514.806 1.5 1.5 0 01-1.494 1.372h-.738a.75.75 0 000 1.5h5.222a.75.75 0 000-1.5h-.738a1.5 1.5 0 01-1.494-1.372.75.75 0 01.514-.806 9.028 9.028 0 006.125-6.384 3.001 3.001 0 002.632-2.977v-1.83c0-.924-.673-1.62-1.5-1.778V2.175a.75.75 0 00-.629-.74A37.053 37.053 0 0010 1zM2.5 4.902v1.726a1.5 1.5 0 001.5 1.5h.013l.09-.007A7.03 7.03 0 014 7.5V4.164A36.009 36.009 0 002.5 4.902zm15 0A36.009 36.009 0 0016 4.164V7.5a7.03 7.03 0 01-.103.621l.09.007H16a1.5 1.5 0 001.5-1.5V4.902z" clipRule="evenodd"/>
  </svg>
)
const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd"/>
  </svg>
)

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
function ImpactCard({ icon, value, label, color = 'forest' }) {
  const palette = {
    forest: 'from-forest-500 to-forest-600 shadow-forest-200',
    amber:  'from-amber-500  to-amber-600  shadow-amber-200',
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-200',
  }
  return (
    <div className={`bg-gradient-to-br ${palette[color]} rounded-2xl p-5 text-white shadow-lg`}>
      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="font-display text-3xl font-semibold mb-0.5 leading-none">{value ?? '—'}</div>
      <div className="text-sm text-white/80">{label}</div>
    </div>
  )
}

function ProgramDiscoverCard({ program, isJoined, onJoin, onLeave }) {
  const [loading, setLoading] = useState(false)
  const [joined,  setJoined]  = useState(isJoined)
  const [error,   setError]   = useState(null)
  const isFull = program.current_participants >= program.capacity

  const handleJoin = async () => {
    setLoading(true); setError(null)
    try {
      await programService.joinProgram(program.id)
      setJoined(true); onJoin?.(program.id)
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not join')
    } finally { setLoading(false) }
  }

  const handleLeave = async () => {
    setLoading(true); setError(null)
    try {
      await programService.leaveProgram(program.id)
      setJoined(false); onLeave?.(program.id)
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not leave')
    } finally { setLoading(false) }
  }

  const pct = program.capacity > 0 ? Math.min(100, (program.current_participants / program.capacity) * 100) : 0

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300 group flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-gray-900 truncate group-hover:text-forest-700 transition-colors">
            {program.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{program.created_by?.organization_name}</p>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-forest-50 text-forest-700 text-xs font-medium rounded-full border border-forest-100 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
          Active
        </span>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">{program.description}</p>

      {/* Capacity */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>{program.current_participants}/{program.capacity} joined</span>
          <span className={isFull ? 'text-red-500' : 'text-forest-600'}>
            {isFull ? 'Full' : `${program.capacity - program.current_participants} left`}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-400' : pct > 80 ? 'bg-amber-400' : 'bg-forest-500'}`}
               style={{ width: `${pct}%` }} />
        </div>
      </div>

      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

      {joined ? (
        <button
          onClick={handleLeave}
          disabled={loading}
          className="btn-secondary text-sm w-full"
        >
          {loading ? 'Leaving…' : 'Leave program'}
        </button>
      ) : (
        <button
          onClick={handleJoin}
          disabled={loading || isFull}
          className="btn-primary text-sm w-full"
        >
          {loading ? 'Joining…' : isFull ? 'Program full' : 'Join program'}
        </button>
      )}

      {joined && (
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
          <span className="text-xs text-forest-700 font-medium">You're participating</span>
        </div>
      )}
    </div>
  )
}

function ActivityRow({ item }) {
  const isActive  = item.status === 'active'
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
      isActive ? 'border-forest-100 bg-forest-50/40' : 'border-gray-100 bg-white'
    }`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 border ${
        isActive ? 'bg-forest-50 border-forest-100' : 'bg-gray-50 border-gray-100'
      }`}>
        {isActive ? '🙋' : '👋'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{item.program__title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{item.program__created_by__organization_name}</p>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
        isActive
          ? 'bg-forest-50 text-forest-700 border-forest-100'
          : 'bg-gray-100 text-gray-500 border-gray-200'
      }`}>
        {isActive ? 'Active' : 'Left'}
      </span>
    </div>
  )
}

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */
function VolunteerLandingSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-40 bg-gradient-to-br from-forest-100 to-forest-50 rounded-3xl" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl bg-gray-100" />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-40 rounded-2xl bg-gray-100" />)}
        </div>
        <div className="h-72 rounded-2xl bg-gray-100" />
      </div>
    </div>
  )
}

/* ─── Main page ──────────────────────────────────────────────────────────────── */
export default function VolunteerLandingPage() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const { data, loading } = useDashboard('volunteer')

  const [featuredPrograms, setFeaturedPrograms] = useState([])
  const [joinedIds,        setJoinedIds]        = useState(new Set())
  const [loadingProgs,     setLoadingProgs]     = useState(true)

  useEffect(() => {
    Promise.all([
      programService.getPrograms({ status: 'active', page_size: 3 }),
      programService.getMyParticipations({ status: 'active' }),
    ]).then(([progs, parts]) => {
      setFeaturedPrograms(progs.results || [])
      setJoinedIds(new Set((parts.results || []).map(p => p.program.id)))
    }).catch(() => {}).finally(() => setLoadingProgs(false))
  }, [])

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.first_name || 'there'

  const summary = data?.summary || {}
  const recentActs = data?.recent_activity || []

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {loading ? <VolunteerLandingSkeleton /> : (
          <>
            {/* ── Hero ── */}
            <div className="relative overflow-hidden rounded-3xl p-8 animate-fade-in"
                 style={{ background: 'linear-gradient(135deg, #1f6e34 0%, #2d8a45 40%, #4fa562 100%)' }}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")" }} />
              <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 left-1/4 w-40 h-40 bg-forest-900/20 rounded-full blur-2xl" />

              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <p className="text-forest-200 text-sm mb-2">{greeting} 👋</p>
                  <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-2 leading-tight">
                    Welcome back,<br />
                    <span className="text-forest-200">{firstName}!</span>
                  </h1>
                  <p className="text-forest-300 text-sm max-w-sm">
                    You've joined{' '}
                    <span className="text-white font-semibold">{summary.total_programs_joined || 0} programs</span>
                    {' '}and are currently active in{' '}
                    <span className="text-white font-semibold">{summary.currently_active_participations || 0}</span>.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/programs')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-forest-700 font-medium text-sm rounded-xl hover:bg-forest-50 transition-all shadow-sm"
                  >
                    <CompassIcon />
                    Explore programs
                  </button>
                </div>
              </div>
            </div>

            {/* ── Impact stats ── */}
            <div>
              <h2 className="font-display font-semibold text-gray-900 text-lg mb-4">Your impact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ImpactCard
                  icon={<TrophyIcon />}
                  value={summary.total_programs_joined || 0}
                  label="Programs joined"
                  color="forest"
                />
                <ImpactCard
                  icon={<HeartIcon />}
                  value={summary.currently_active_participations || 0}
                  label="Currently active"
                  color="indigo"
                />
                <ImpactCard
                  icon={<CompassIcon />}
                  value={summary.completed_programs_count || 0}
                  label="Completed programs"
                  color="amber"
                />
              </div>
            </div>

            {/* ── Discover + Activity ── */}
            <div className="grid lg:grid-cols-2 gap-8">

              {/* Featured programs to discover */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-display font-semibold text-gray-900">Discover programs</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Active programs you can join right now</p>
                  </div>
                  <button
                    onClick={() => navigate('/programs')}
                    className="flex items-center gap-1 text-xs text-forest-600 hover:text-forest-700 font-medium transition-colors"
                  >
                    Browse all <ArrowIcon />
                  </button>
                </div>

                {loadingProgs ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-44 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : featuredPrograms.length === 0 ? (
                  <div className="card p-10 text-center">
                    <div className="text-3xl mb-3">🌍</div>
                    <p className="text-sm text-gray-400">No active programs right now. Check back soon!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {featuredPrograms.map(p => (
                      <ProgramDiscoverCard
                        key={p.id}
                        program={p}
                        isJoined={joinedIds.has(p.id)}
                        onJoin={id => setJoinedIds(prev => new Set([...prev, id]))}
                        onLeave={id => setJoinedIds(prev => { const n = new Set(prev); n.delete(id); return n })}
                      />
                    ))}
                    <button
                      onClick={() => navigate('/programs')}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-forest-300 hover:text-forest-600 transition-all"
                    >
                      View all programs →
                    </button>
                  </div>
                )}
              </div>

              {/* Recent activity */}
              <div>
                <div className="mb-4">
                  <h2 className="font-display font-semibold text-gray-900">Recent activity</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Your latest program interactions</p>
                </div>

                {recentActs.length === 0 ? (
                  <div className="card p-10 text-center">
                    <div className="text-4xl mb-4">🌱</div>
                    <h3 className="font-display font-semibold text-gray-900 mb-2">Start your journey</h3>
                    <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
                      Join your first program and start making a difference in your community.
                    </p>
                    <button onClick={() => navigate('/programs')} className="btn-primary text-sm">
                      Browse programs
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActs.slice(0, 6).map(a => (
                      <ActivityRow key={a.id} item={a} />
                    ))}

                    {/* Journey progress */}
                    <div className="card p-5 mt-4 bg-gradient-to-br from-forest-50 to-white border-forest-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700">
                          🎯
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-forest-900">Volunteer journey</p>
                          <p className="text-xs text-forest-600">{summary.total_programs_joined || 0} of 10 milestone programs</p>
                        </div>
                      </div>
                      <div className="h-2 bg-forest-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-forest-500 rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(100, ((summary.total_programs_joined || 0) / 10) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-forest-500 mt-2">
                        {Math.max(0, 10 - (summary.total_programs_joined || 0))} more programs to reach your next milestone! 🏆
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Quick links ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
              {[
                { icon: '🔔', label: 'Notifications', to: '/notifications' },
                { icon: '📋', label: 'All programs',  to: '/programs'      },
                { icon: '👤', label: 'My profile',    to: '/settings'      },
                { icon: '📊', label: 'Dashboard',     to: '/dashboard'     },
              ].map(l => (
                <button
                  key={l.to}
                  onClick={() => navigate(l.to)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 bg-white hover:border-forest-200 hover:bg-forest-50/30 hover:shadow-card transition-all duration-200 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{l.icon}</span>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-forest-700 transition-colors">{l.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}
