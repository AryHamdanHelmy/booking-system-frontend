export function Textarea({ className = '', invalid = false, rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-title
        placeholder:text-ink/35 focus:outline-none
        ${invalid ? 'border-clay' : 'border-line focus:border-pine'} ${className}`}
      {...props}
    />
  );
}