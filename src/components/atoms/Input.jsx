/**
 * Atom: Input
 * A clean text input with optional left icon/prefix and error state.
 */
export default function Input({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  disabled,
  error,
  prefix,   // Emoji or text prefix (e.g. icon)
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64676f] text-base pointer-events-none select-none">
          {prefix}
        </span>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        className={`
          w-full bg-white dark:bg-[#2c2d33] border rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white
          placeholder:text-zinc-400 dark:placeholder:text-[#64676f] outline-none transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:shadow-none
          ${prefix ? 'pl-9' : ''}
          ${error
            ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-zinc-300 dark:border-[#3a3b42] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          }
        `}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
