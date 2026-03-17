/**
 * Atom: Badge
 * Small label with semantic color variants.
 * Variants: default | success | warning | danger | info
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-zinc-100 text-zinc-600 dark:bg-white/8 dark:text-[#a0a3ab]',
    success: 'bg-green-50 text-green-600 dark:bg-green-500/12 dark:text-green-400',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/12 dark:text-amber-400',
    danger:  'bg-red-50 text-red-600 dark:bg-red-500/12 dark:text-red-400',
    info:    'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/12 dark:text-indigo-400',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
