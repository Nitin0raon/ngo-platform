import Button from './Button'

const illustrations = {
  programs: (
    <svg viewBox="0 0 120 100" className="w-32 h-28" fill="none">
      <rect x="15" y="20" width="90" height="60" rx="8" fill="#f0f7f1" stroke="#d9eddc" strokeWidth="1.5"/>
      <rect x="25" y="32" width="45" height="6" rx="3" fill="#b3dbb9"/>
      <rect x="25" y="44" width="70" height="4" rx="2" fill="#d9eddc"/>
      <rect x="25" y="52" width="60" height="4" rx="2" fill="#d9eddc"/>
      <rect x="25" y="62" width="30" height="10" rx="5" fill="#2d8a45" opacity="0.7"/>
      <circle cx="88" cy="28" r="12" fill="#2d8a45" opacity="0.15"/>
      <path d="M84 28l3 3 5-5" stroke="#2d8a45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  notifications: (
    <svg viewBox="0 0 120 100" className="w-32 h-28" fill="none">
      <path d="M60 20c-16.569 0-30 10.745-30 24 0 5.523 2.26 10.593 6 14.485V72l12-8h12c16.569 0 30-10.745 30-24S76.569 20 60 20z" fill="#f0f7f1" stroke="#d9eddc" strokeWidth="1.5"/>
      <rect x="50" y="40" width="20" height="4" rx="2" fill="#b3dbb9"/>
      <rect x="46" y="48" width="28" height="4" rx="2" fill="#d9eddc"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 120 100" className="w-32 h-28" fill="none">
      <circle cx="52" cy="45" r="22" fill="#f0f7f1" stroke="#d9eddc" strokeWidth="1.5"/>
      <path d="M68 61l15 15" stroke="#b3dbb9" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M46 38h12M46 44h8" stroke="#b3dbb9" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  general: (
    <svg viewBox="0 0 120 100" className="w-32 h-28" fill="none">
      <rect x="30" y="25" width="60" height="50" rx="8" fill="#f0f7f1" stroke="#d9eddc" strokeWidth="1.5"/>
      <rect x="42" y="38" width="36" height="5" rx="2.5" fill="#b3dbb9"/>
      <rect x="42" y="48" width="26" height="4" rx="2" fill="#d9eddc"/>
      <rect x="42" y="56" width="30" height="4" rx="2" fill="#d9eddc"/>
    </svg>
  ),
}

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Get started by adding something.',
  type = 'general',
  action,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in">
      <div className="mb-5 opacity-90">
        {illustrations[type] || illustrations.general}
      </div>
      <h3 className="font-display font-semibold text-gray-800 text-lg mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-400 text-center max-w-xs mb-6 leading-relaxed">
        {description}
      </p>
      {action && actionLabel && (
        <Button variant="primary" size="md" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
