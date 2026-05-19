export default function Loader({ size = 'md', color = 'green', fullPage = false }) {
  const sizes = {
    sm: 'w-4 h-4 border-[2px]',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-[3px]',
    xl: 'w-16 h-16 border-4',
  }

  const colors = {
    green: 'border-forest-200 border-t-forest-600',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 border-t-gray-500',
  }

  const spinner = (
    <div
      className={`${sizes[size]} ${colors[color]} rounded-full animate-spin-slow`}
      role="status"
      aria-label="Loading"
    />
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm text-gray-500 animate-pulse-soft">Loading…</p>
        </div>
      </div>
    )
  }

  return spinner
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Loader size="lg" />
      <p className="text-sm text-gray-400">Loading…</p>
    </div>
  )
}
