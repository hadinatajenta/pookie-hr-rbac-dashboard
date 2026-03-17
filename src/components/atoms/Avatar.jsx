/**
 * Atom: Avatar
 * Shows initials in a colored circle.
 */
export default function Avatar({ name = '', size = 'md', className = '' }) {
  const initials = name
    ? name.charAt(0).toUpperCase()
    : '?';

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-semibold shrink-0 ${className}`}
      aria-label={name || 'User avatar'}
    >
      {initials}
    </div>
  );
}
