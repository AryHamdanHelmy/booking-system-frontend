export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl border border-line bg-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}