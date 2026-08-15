export function Spinner({ className = 'h-5 w-5' }) {
  return (
    <span
      role="status"
      aria-label="Memuat"
      className={`inline-block animate-spin rounded-full border-2
        border-moss border-t-transparent ${className}`}
    />
  );
}