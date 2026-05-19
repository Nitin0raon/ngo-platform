import Loader from './Loader'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-forest-600 text-white rounded-xl hover:bg-forest-700 active:bg-forest-800 focus:ring-2 focus:ring-forest-500 focus:ring-offset-2',
    secondary: 'bg-white text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2',
    danger: 'bg-red-600 text-white rounded-xl hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    ghost: 'text-forest-700 rounded-xl hover:bg-forest-50 active:bg-forest-100',
    outline: 'border-2 border-forest-600 text-forest-600 rounded-xl hover:bg-forest-50',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader size="sm" color={variant === 'secondary' ? 'gray' : 'white'} />
          <span>Loading…</span>
        </>
      ) : children}
    </button>
  )
}
