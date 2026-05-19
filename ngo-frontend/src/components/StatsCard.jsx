export default function StatsCard({ label, value, icon, trend, color = 'green', loading = false }) {
  const colors = {
    green: {
      bg: 'bg-forest-50',
      icon: 'text-forest-600',
      border: 'border-forest-100',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      border: 'border-amber-100',
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
      border: 'border-indigo-100',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      border: 'border-red-100',
    },
    gray: {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      border: 'border-gray-100',
    },
  }

  const c = colors[color] || colors.green

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border}`} />
          <div className="w-16 h-4 bg-gray-100 rounded-full" />
        </div>
        <div className="w-12 h-7 bg-gray-100 rounded mb-1" />
        <div className="w-24 h-4 bg-gray-50 rounded" />
      </div>
    )
  }

  return (
    <div className="card p-6 hover:shadow-card-hover transition-all duration-300 group animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center ${c.icon} group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend >= 0 ? 'bg-forest-50 text-forest-700' : 'bg-red-50 text-red-600'
          }`}>
            <span>{trend >= 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-display font-semibold text-gray-900 mb-1 tabular-nums">
        {value ?? '—'}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}
