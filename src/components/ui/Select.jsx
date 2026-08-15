export function Select({ className = '', invalid = false, children, ...props }) {
  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border bg-white px-3 text-base
        focus:outline-none
        ${invalid ? 'border-clay' : 'border-line focus:border-moss'} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}