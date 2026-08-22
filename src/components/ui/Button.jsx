const VARIANTS = {
  primary:   'bg-click text-white hover:bg-card/35 hover:text-ink border-click border disabled:bg-card/40',
  secondary: 'bg-click text-white hover:border-moss disabled:text-ink/40',
  ghost:     'text-ink/70 hover:text-ink hover:bg-ink/5',
  danger:    'bg-clay text-white hover:bg-clay/85 disabled:bg-clay/40',
  warning:   'bg-amber text-white hover:bg-amber/85 disabled:bg-amber/40',
};

const SIZES = {
  // Tinggi minimum 44px: target sentuh saat tamu menunggu di depan meja.
  md: 'h-11 px-4 text-sm',
  lg: 'h-14 px-6 text-base',
  sm: 'h-9 px-3 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  disabled = false,
  loading = false,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold
        transition-colors disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}