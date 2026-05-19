const DotIcon = ({ className }) => (
  <span className={`w-1.5 h-1.5 rounded-full ${className}`} />
)

export default function Badge({ status, children, size = 'sm' }) {
  const config = {
    active: {
      wrapper: 'bg-forest-50 text-forest-700 border border-forest-100',
      dot: 'bg-forest-500',
      label: children || 'Active',
    },
    completed: {
      wrapper: 'bg-gray-100 text-gray-600 border border-gray-200',
      dot: 'bg-gray-400',
      label: children || 'Completed',
    },
    cancelled: {
      wrapper: 'bg-red-50 text-red-600 border border-red-100',
      dot: 'bg-red-400',
      label: children || 'Cancelled',
    },
    ngo: {
      wrapper: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
      dot: 'bg-indigo-400',
      label: children || 'NGO',
    },
    volunteer: {
      wrapper: 'bg-amber-50 text-amber-700 border border-amber-100',
      dot: 'bg-amber-400',
      label: children || 'Volunteer',
    },
    full: {
      wrapper: 'bg-orange-50 text-orange-600 border border-orange-100',
      dot: 'bg-orange-400',
      label: children || 'Full',
    },
    left: {
      wrapper: 'bg-gray-100 text-gray-500 border border-gray-200',
      dot: 'bg-gray-400',
      label: children || 'Left',
    },
  }

  const cfg = config[status] || config.active

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-1.5',
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${cfg.wrapper} ${sizeClasses[size]}`}
    >
      <DotIcon className={cfg.dot} />
      {cfg.label}
    </span>
  )
}
