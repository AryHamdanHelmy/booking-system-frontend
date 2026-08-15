export function Input({ className = '', invalid = false, ...props }) {
  return (
    <input
      className={`h-11 w-full rounded-lg border bg-white px-3 text-title
        placeholder:text-ink/35 focus:outline-none
        ${invalid ? 'border-clay' : 'border-line focus:border-moss'} ${className}`}
      {...props}
    />
  );
}