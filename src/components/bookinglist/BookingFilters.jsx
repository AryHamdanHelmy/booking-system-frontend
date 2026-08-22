import { IoClose, IoSearch } from "react-icons/io5";
import { Input } from '@/components/ui';
import { BOOKING_STATUS, STATUS_LABEL } from '@/constants/bookingStatus';
import { BOOKING_SOURCE, SOURCE_LABEL } from '@/constants/bookingSource';

const STATUS_CHIPS = [
  { value: '', label: 'Semua' },
  { value: BOOKING_STATUS.CONFIRMED, label: STATUS_LABEL.confirmed },
  { value: BOOKING_STATUS.ONGOING,   label: STATUS_LABEL.ongoing },
  { value: BOOKING_STATUS.COMPLETED, label: STATUS_LABEL.completed },
  { value: BOOKING_STATUS.CANCELLED, label: STATUS_LABEL.cancelled },
  { value: BOOKING_STATUS.NO_SHOW,   label: STATUS_LABEL.no_show },
];

const SOURCE_CHIPS = [
  { value: '', label: 'Semua' },
  { value: BOOKING_SOURCE.ONLINE,  label: SOURCE_LABEL.online },
  { value: BOOKING_SOURCE.WALK_IN, label: SOURCE_LABEL.walk_in },
];

function Chips({ options, value, onChange, label }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`h-9 shrink-0 rounded-lg border px-3 text-label
            transition-colors ${
              value === option.value
                ? 'border-line bg-card text-white'
                : 'border-line bg-white text-ink/60 hover:border-moss'
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function BookingFilters({ filters, onChange }) {
  const update = (patch) => onChange({ ...filters, ...patch, page: 1 });
  const updateQuery = (q) => onChange({ ...filters, q });

  return (
    <div className="space-y-3">
      <div className="relative">
        <IoSearch
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35"
        />
        <Input
          value={filters.q}
          onChange={(e) => updateQuery(e.target.value)}
          placeholder="Cari nama, nomor HP, atau kode"
          className="pl-10 pr-10"
        />
        {filters.q && (
          <button
            type="button"
            onClick={() => updateQ('')}
            aria-label="Hapus pencarian"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-ink/40 hover:text-ink"
          >
            <IoClose size={16} />
          </button>
        )}
      </div>

      <Chips
        label="Filter status"
        options={STATUS_CHIPS}
        value={filters.status}
        onChange={(status) => update({ status })}
      />

      <Chips
        label="Filter sumber"
        options={SOURCE_CHIPS}
        value={filters.source}
        onChange={(source) => update({ source })}
      />

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <Input
          type="date"
          aria-label="Dari tanggal"
          value={filters.from}
          max={filters.to || undefined}
          onChange={(e) => update({ from: e.target.value })}
          className="h-10 min-w-0 text-sm md:text-title"
        />
        <span className="text-sm text-ink/40">s/d</span>
        <Input
          type="date"
          aria-label="Sampai tanggal"
          value={filters.to}
          min={filters.from || undefined}
          onChange={(e) => update({ to: e.target.value })}
          className="h-10 min-w-0 text-sm md:text-title"
        />
      </div>
    </div>
  );
}