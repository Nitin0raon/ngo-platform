import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDashboard } from '../hooks'
import MainLayout from '../layouts/MainLayout'

/* ─── Icon set ───────────────────────────────────────────────────────────────── */
const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/>
  </svg>
)
const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd"/>
  </svg>
)
const ChartIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z"/>
  </svg>
)
const UsersIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 17a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z"/>
  </svg>
)
const BellIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v2.172l-.707.707A1 1 0 003 12v1a1 1 0 001 1h12a1 1 0 001-1v-1a1 1 0 00-.293-.707L16 10.172V8a6 6 0 00-6-6zm0 15a2 2 0 01-2-2h4a2 2 0 01-2 2z" clipRule="evenodd"/>
  </svg>
)
const SettingsIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.205 1.251l-1.18 2.044a1 1 0 01-1.186.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.113a7.047 7.047 0 010-2.228L1.821 7.773a1 1 0 01-.206-1.251l1.18-2.044a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
  </svg>
)

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
function StatPill({ value, label, color = 'forest' }) {
  const colors = {
    forest: 'bg-forest-50 border-forest-100 text-forest-700',
    amber:  'bg-amber-50 border-amber-100 text-amber-700',
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    gray:   'bg-gray-50 border-gray-100 text-gray-600',
  }
  return (
    <div className={`flex flex-col items-center justify-center p-5 rounded-2xl border ${colors[color]} min-w-[110px]`}>
      <span className="font-display text-3xl font-semibold leading-none mb-1">{value ?? '—'}</span>
      <span className="text-xs font-medium opacity-80">{label}</span>
    </div>
  )
}

function QuickActionCard({ icon, title, desc, onClick, primary = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 group
        ${primary
          ? 'bg-forest-600 border-forest-700 hover:bg-forest-700 text-white shadow-sm hover:shadow-md'
          : 'bg-white border-gray-100 hover:border-forest-200 hover:shadow-card-hover'
        }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110
        ${primary ? 'bg-white/20' : 'bg-forest-50 border border-forest-100'}`}>
        <span className={primary ? 'text-white' : 'text-forest-600'}>{icon}</span>
      </div>
      <h3 className={`font-semibold text-sm mb-1 ${primary ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`text-xs leading-relaxed ${primary ? 'text-white/70' : 'text-gray-400'}`}>{desc}</p>
    </button>
  )
}

function CapacityBar({ current, capacity }) {
  const pct = capacity > 0 ? Math.min(100, (current / capacity) * 100) : 0
  const isFull = pct >= 100
  const isNear = pct >= 80
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-400' : isNear ? 'bg-amber-400' : 'bg-forest-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono text-gray-400 w-14 text-right">{current}/{capacity}</span>
    </div>
  )
}

function TimelineItem({ icon, title, desc, time, isLast }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center text-sm flex-shrink-0">
          {icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-gray-100 mt-2" />}
      </div>
      <div className={`pb-5 ${isLast ? '' : ''}`}>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
        <p className="text-[11px] text-gray-300 mt-1 font-mono">{time}</p>
      </div>
    </div>
  )
}

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */
function NGOLandingSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-36 bg-forest-50 rounded-3xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-gray-100 rounded-2xl" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  )
}

/* ─── Main page ──────────────────────────────────────────────────────────────── */
export default function NGOLandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, loading } = useDashboard('ngo')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const orgName  = user?.organization_name || user?.first_name || 'there'

  const summary  = data?.summary || {}
  const topProgs = data?.top_programs_by_participation || []
  const allProgs = data?.per_program_breakdown || []

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {loading ? <NGOLandingSkeleton /> : (
          <>
            {/* ── Hero welcome banner ── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-600 via-forest-700 to-forest-800 p-8 animate-fade-in">
              {/* Grid texture */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")" }} />
              {/* Glow blobs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-forest-400/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-forest-900/30 rounded-full blur-2xl" />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-forest-200 text-sm mb-2">{greeting} 👋</p>
                  <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-2 leading-tight">
                    Welcome back,<br />
                    <span className="text-forest-200">{orgName}</span>
                  </h1>
                  <p className="text-forest-300 text-sm max-w-sm">
                    Your programs are{' '}
                    <span className="text-white font-medium">{summary.active_programs || 0} active</span>
                    {' '}with{' '}
                    <span className="text-white font-medium">{summary.total_participants_across_programs || 0} volunteers</span>
                    {' '}across all programs.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <StatPill value={summary.total_programs || 0}                      label="Programs"    color="forest" />
                  <StatPill value={summary.total_participants_across_programs || 0}  label="Volunteers"  color="forest" />
                  <StatPill value={summary.active_programs || 0}                     label="Active"      color="forest" />
                </div>
              </div>
            </div>

            {/* ── Quick actions ── */}
            <div>
              <h2 className="font-display font-semibold text-gray-900 text-lg mb-4">Quick actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <QuickActionCard
                  primary
                  icon={<PlusIcon />}
                  title="Create program"
                  desc="Publish a new volunteer program"
                  onClick={() => navigate('/create-program')}
                />
                <QuickActionCard
                  icon={<ChartIcon />}
                  title="View analytics"
                  desc="Dashboard stats & insights"
                  onClick={() => navigate('/dashboard')}
                />
                <QuickActionCard
                  icon={<UsersIcon />}
                  title="All programs"
                  desc="Browse and manage programs"
                  onClick={() => navigate('/programs')}
                />
                <QuickActionCard
                  icon={<SettingsIcon />}
                  title="Profile settings"
                  desc="Update org info & password"
                  onClick={() => navigate('/settings')}
                />
              </div>
            </div>

            {/* ── Programs performance + Timeline ── */}
            <div className="grid lg:grid-cols-3 gap-6">

              {/* Top programs */}
              <div className="lg:col-span-2 card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display font-semibold text-gray-900">Program performance</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Ranked by volunteer participation</p>
                  </div>
                  <button
                    onClick={() => navigate('/programs')}
                    className="flex items-center gap-1 text-xs text-forest-600 hover:text-forest-700 font-medium transition-colors"
                  >
                    View all <ArrowIcon />
                  </button>
                </div>

                {topProgs.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-3xl mb-3">📋</div>
                    <p className="text-sm text-gray-400 mb-4">No programs yet. Create your first one!</p>
                    <button
                      onClick={() => navigate('/create-program')}
                      className="btn-primary text-sm"
                    >
                      Create program
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topProgs.map((p, i) => (
                      <div key={p.id} className="flex items-center gap-4 group">
                        <div className="w-7 h-7 rounded-full bg-forest-50 border border-forest-100 text-forest-700 text-xs font-bold flex items-center justify-center flex-shrink-0 font-mono">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5 gap-2">
                            <span className="text-sm font-medium text-gray-900 truncate group-hover:text-forest-700 transition-colors">
                              {p.title}
                            </span>
                            <span className={`text-xs font-mono font-semibold flex-shrink-0 ${
                              p.current_participants >= p.capacity ? 'text-red-500' : 'text-forest-600'
                            }`}>
                              {p.capacity > 0 ? Math.round((p.current_participants / p.capacity) * 100) : 0}%
                            </span>
                          </div>
                          <CapacityBar current={p.current_participants} capacity={p.capacity} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar: summary + recent activity */}
              <div className="space-y-4">
                {/* Program status breakdown */}
                <div className="card p-5">
                  <h3 className="font-display font-semibold text-gray-900 text-sm mb-4">Program status</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Active',    val: summary.active_programs    || 0, dot: 'bg-forest-500', bar: 'bg-forest-400' },
                      { label: 'Completed', val: summary.completed_programs || 0, dot: 'bg-gray-400',   bar: 'bg-gray-300'   },
                      { label: 'Cancelled', val: summary.cancelled_programs || 0, dot: 'bg-red-400',    bar: 'bg-red-300'    },
                    ].map(r => {
                      const total = summary.total_programs || 1
                      const pct   = Math.round((r.val / total) * 100)
                      return (
                        <div key={r.label}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${r.dot}`} />
                              <span className="text-xs text-gray-600">{r.label}</span>
                            </div>
                            <span className="text-xs font-mono font-semibold text-gray-700">{r.val}</span>
                          </div>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${r.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Tips card */}
                <div className="card p-5 bg-gradient-to-br from-forest-50 to-white border-forest-100">
                  <h3 className="font-display font-semibold text-forest-900 text-sm mb-3">💡 Tips</h3>
                  <ul className="space-y-2 text-xs text-forest-700 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0">→</span>
                      Programs with locations get <strong>40%</strong> more volunteers.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0">→</span>
                      Set clear start & end dates to attract committed volunteers.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0">→</span>
                      Respond to join notifications quickly to keep volunteers engaged.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ── All programs table ── */}
            {allProgs.length > 0 && (
              <div className="card p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display font-semibold text-gray-900">All programs</h2>
                  <button
                    onClick={() => navigate('/create-program')}
                    className="btn-primary text-xs px-3.5 py-2"
                  >
                    + New program
                  </button>
                </div>
                <div className="overflow-x-auto -mx-px">
                  <table className="w-full text-sm min-w-[520px]">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Program', 'Status', 'Participants', 'Capacity', 'Fill'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-3 first:pl-0">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {allProgs.map(p => {
                        const pct = p.capacity > 0 ? Math.round((p.current_participants / p.capacity) * 100) : 0
                        return (
                          <tr key={p.id} className="hover:bg-forest-50/40 transition-colors">
                            <td className="py-3 pr-4">
                              <span className="font-medium text-gray-900 truncate block max-w-[200px]">{p.title}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                                p.status === 'active'    ? 'bg-forest-50 text-forest-700 border border-forest-100' :
                                p.status === 'completed' ? 'bg-gray-100 text-gray-600 border border-gray-200' :
                                                           'bg-red-50 text-red-600 border border-red-100'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  p.status === 'active' ? 'bg-forest-500 animate-pulse' : p.status === 'completed' ? 'bg-gray-400' : 'bg-red-400'
                                }`} />
                                {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-gray-600 text-sm">{p.current_participants}</td>
                            <td className="py-3 px-3 font-mono text-gray-400 text-sm">{p.capacity}</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${pct >= 100 ? 'bg-red-400' : pct >= 80 ? 'bg-amber-400' : 'bg-forest-500'}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs font-mono text-gray-400">{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Bottom CTA: if no programs ── */}
            {allProgs.length === 0 && (
              <div className="card p-12 text-center animate-fade-in">
                <div className="text-5xl mb-4">🌱</div>
                <h2 className="font-display text-2xl font-semibold text-gray-900 mb-3">
                  Ready to make an impact?
                </h2>
                <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                  Create your first volunteer program and start connecting with passionate volunteers in your community.
                </p>
                <button onClick={() => navigate('/create-program')} className="btn-primary">
                  <PlusIcon /> Create your first program
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}
