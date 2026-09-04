const variants = {
  primary: 'bg-brand-blue text-white hover:bg-blue-700',
  ai: 'bg-cyan-ai text-white hover:bg-cyan-600',
  secondary: 'bg-white text-navy border border-slate-200 hover:bg-slate-50',
  danger: 'bg-danger text-white hover:bg-red-700',
}

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
