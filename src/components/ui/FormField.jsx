export function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-label text-ink/80">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-clay">{error}</p>
      ) : hint ? (
        <p className="text-sm text-ink/50">{hint}</p>
      ) : null}
    </div>
  );
}