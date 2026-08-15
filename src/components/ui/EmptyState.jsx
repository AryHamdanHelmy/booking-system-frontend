/** Layar kosong adalah ajakan bertindak, bukan sekadar pemberitahuan. */
export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <p className="font-semibold text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink/55">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}