export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl border border-line bg-card/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}