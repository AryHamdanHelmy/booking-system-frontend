/**
 * Pilihan berbentuk tombol, bukan dropdown.
 * Untuk daftar pendek (2-4 item) ini lebih cepat: satu ketukan,
 * dan semua pilihan terlihat sekaligus tanpa membuka apa pun.
 *
 * Beri `icon` pada option untuk tata letak vertikal (ikon di atas label).
 * Tanpa ikon, tetap memakai tata letak teks rata kiri seperti semula.
 */
export function ChoiceGroup({ options, value, onChange, columns = 2 }) {
  const pakaiIkon = options.some((option) => option.icon);

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const selected = String(option.value) === String(value);
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={option.disabled}
            aria-pressed={selected}
            className={`rounded-lg border px-3 transition-colors
              disabled:cursor-not-allowed disabled:opacity-45
              ${
                pakaiIkon
                  ? 'flex min-h-20 flex-col items-center justify-center gap-1.5 py-3 text-center'
                  : 'min-h-11 py-2 text-left'
              }
              ${
                selected
                  ? 'border-pine bg-pine text-white'
                  : 'border-line bg-white text-ink hover:border-pine'
              }`}
          >
            {Icon && (
              <Icon
                size={22}
                strokeWidth={1.75}
                className={selected ? 'text-white' : 'text-pine/45'}
              />
            )}

            <span className="block text-label">
              {option.label}
            </span>

            {option.hint && (
              <span className="mt-0.5 block text-label text-ink">{option.hint}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}