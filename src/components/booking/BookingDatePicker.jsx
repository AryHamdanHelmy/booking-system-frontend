import { toDateParam } from '@/utils/formatTime';

/** Tujuh hari ke depan sebagai tombol, plus input tanggal untuk yang lebih jauh. */
function nextDays(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

const dayShort = (d) =>
  d.toLocaleDateString('id-ID', { weekday: 'short' });

export function BookingDatePicker({ value, onChange }) {
  const days = nextDays();
  const today = toDateParam();

  return (
    <div className="space-y-3">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {days.map((d) => {
          const param = toDateParam(d);
          const selected = param === value;

          return (
            <button
              key={param}
              type="button"
              onClick={() => onChange(param)}
              className={`flex min-w-14 shrink-0 flex-col items-center rounded-lg border
                px-3 py-2 transition-colors ${
                  selected
                    ? 'border-pine bg-pine/8 text-pine'
                    : 'border-line bg-white text-ink hover:border-moss'
                }`}
            >
              <span className="text-[11px] font-semibold uppercase">
                {param === today ? 'Hari ini' : dayShort(d)}
              </span>
              <span className="tnum text-lg font-extrabold leading-tight">
                {d.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      <input
        type="date"
        aria-label="Pilih tanggal lain"
        value={value}
        min={today}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-line bg-white px-3
          text-base focus:border-moss focus:outline-none"
      />
    </div>
  );
}