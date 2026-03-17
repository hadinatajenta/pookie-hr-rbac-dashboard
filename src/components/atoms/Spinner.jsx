/**
 * Atom: Spinner
 * Sizes: sm | md | lg
 */
export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-9 h-9' };
  return (
    <span
      className={`inline-block border-2 border-[#3a3b42] border-t-indigo-500 rounded-full anim-spin ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
