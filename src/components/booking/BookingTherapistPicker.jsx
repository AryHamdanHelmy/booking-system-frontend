import { Check, Users } from 'lucide-react';

/**
 * Muncul setelah pelanggan memilih jam, bukan sebelumnya.
 *
 * Dengan urutan ini pelanggan tidak pernah menemui jalan buntu:
 * yang ditawarkan hanya terapis yang memang kosong di jam itu.
 */
export function BookingTherapistPicker({ therapists, availableIds = [], value, onChange }) {
  const tersedia = therapists.filter((t) => availableIds.includes(t.id));

  if (tersedia.length === 0) return null;

  // Kalau cuma satu terapis yang bisa, tidak ada yang perlu dipilih.
  if (tersedia.length === 1) {
    return (
      <p className="rounded-lg bg-ink/4 px-3 py-2.5 text-sm text-ink/60">
        Sesi ini akan ditangani{' '}
        <span className="font-semibold text-ink">{tersedia[0].name}</span>.
      </p>
    );
  }

  const options = [
    { id: '', name: 'Siapa saja', hint: 'Dipilihkan outlet' },
    ...tersedia,
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((therapist) => {
        const selected = String(therapist.id) === String(value);
        const bebas = therapist.id === '';

        return (
          <button
            key={therapist.id || 'any'}
            type="button"
            onClick={() => onChange(String(therapist.id))}
            aria-pressed={selected}
            className={`flex min-h-20 flex-col items-center justify-center gap-1
              rounded-lg border px-2 py-2.5 text-center transition-colors ${
                selected
                  ? 'border-line bg-card text-pine'
                  : 'border-line bg-white text-ink hover:border-moss'
              }`}
          >
            {bebas ? (
              <Users
                size={18}
                strokeWidth={1.75}
                className={selected ? 'text-pine' : 'text-ink/45'}
              />
            ) : (
              selected && <Check size={18} className="text-pine" />
            )}

            <span className="text-sm font-semibold leading-tight">
              {therapist.name}
            </span>

            {therapist.hint && (
              <span className="text-xs text-pine/70">{therapist.hint}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}