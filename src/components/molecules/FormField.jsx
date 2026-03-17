/**
 * Molecule: FormField
 * Label + Input combo with integrated error display.
 */
import Input from '../atoms/Input';

export default function FormField({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  error,
  prefix,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-zinc-500 dark:text-[#a0a3ab] uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        error={error}
        prefix={prefix}
      />
    </div>
  );
}
