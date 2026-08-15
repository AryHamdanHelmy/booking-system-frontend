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
        title="Tidak ada jadwal kosong"
        description="Coba pilih tanggal lain atau ubah preferensi terapis."
      />
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => {
        const selected = slot.start_at === value;

        return (
          <button
            key={slot.start_at}
            type="button"
            onClick={() => onChange(slot.start_at)}
            className={`tnum h-11 rounded-lg border text-sm font-semibold
              transition-colors ${
                selected
                  ? 'border-pine bg-pine text-white'
                  : 'border-line bg-white text-ink hover:border-moss'
              }`}
          >
            {formatTime(slot.start_at)}
          </button>
        );
      })}
    </div>
  );
}