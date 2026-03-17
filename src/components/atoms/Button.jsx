/**
 * Atom: Button
 * Variants: primary | secondary | ghost | danger
 * Sizes: sm | md | lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#24252a]';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const variants = {
    primary:
      'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white focus-visible:ring-indigo-500',
    secondary:
      'bg-white dark:bg-[#34353c] hover:bg-zinc-50 dark:hover:bg-[#3e3f47] active:bg-zinc-100 dark:active:bg-[#44454e] text-zinc-900 dark:text-white border border-zinc-200 dark:border-[#3a3b42] focus-visible:ring-indigo-500 dark:focus-visible:ring-[#6366f1] shadow-sm dark:shadow-none',
    ghost:
      'bg-transparent hover:bg-zinc-100 dark:hover:bg-white/6 active:bg-zinc-200 dark:active:bg-white/10 text-zinc-500 dark:text-[#a0a3ab] hover:text-zinc-900 dark:hover:text-white focus-visible:ring-zinc-200 dark:focus-visible:ring-white/20',
    danger:
      'bg-red-50 hover:bg-red-100 dark:bg-red-500/15 dark:hover:bg-red-500/25 active:bg-red-200 dark:active:bg-red-500/35 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 focus-visible:ring-red-500 shadow-sm dark:shadow-none',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full anim-spin" />
      )}
      {children}
    </button>
  );
}
