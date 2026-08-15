/**
 * Pilihan berbentuk tombol, bukan dropdown.
 * Untuk daftar pendek (2-4 item) ini lebih cepat: satu ketukan,
 * dan semua pilihan terlihat sekaligus tanpa membuka apa pun.
 */
export function ChoiceGroup({ options, value, onChange, columns = 2 }) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const selected = String(option.value) === String(value);

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={option.disabled}
            className={`min-h-11 rounded-lg border px-3 py-2 text-left transition-colors
              disabled:cursor-not-allowed disabled:opacity-45
              ${
                selected
                  ? 'border-pine bg-pine/8 text-pine'
                  : 'border-line bg-white text-ink hover:border-moss'
              }`}
          >
            <span className="block text-label">
              {option.label}
            </span>
            {option.hint && (
              <span className="mt-0.5 block text-label text-ink/50">{option.hint}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}