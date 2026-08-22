import { Info } from 'lucide-react';
import { EmptyState, Spinner } from '@/components/ui';
import { formatTime } from '@/utils/formatTime';

export function BookingSlotGrid({ slots, loading, value, onChange }) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <EmptyState
        title="Tidak ada jadwal"
        description="Coba pilih tanggal lain atau ubah preferensi terapis."
      />
    );
  }

  const adaYangPenuh = slots.some((slot) => !slot.is_available);

  return (
    <div className="space-y-3">
      {adaYangPenuh && (
        <p className="flex items-start gap-2 rounded-lg bg-ink/4 px-3 py-2 text-sm text-ink/55">
          <Info size={16} className="mt-0.5 shrink-0" />
          Jam yang dicoret sudah terisi.
        </p>
      )}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((slot) => {
          const selected = slot.start_at === value;
          const penuh = !slot.is_available;

          return (
            <button
              key={slot.start_at}
              type="button"
              disabled={penuh}
              onClick={() => onChange(slot.start_at)}
              className={`tnum h-11 rounded-lg border text-sm font-semibold
                transition-colors ${
                  penuh
                    ? 'cursor-not-allowed border-transparent bg-ink/5 text-ink/30 line-through'
                    : selected
                      ? 'border-line bg-click text-white'
                      : 'border-line bg-white text-ink hover:border-line'
                }`}
            >
              {formatTime(slot.start_at)}
            </button>
          );
        })}
      </div>
    </div>
  );
}