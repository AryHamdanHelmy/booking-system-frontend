import { useEffect, useRef, useState } from 'react';
import { IoCalendarOutline, IoClose, IoSearch } from "react-icons/io5";
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

function formatShort(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function DateRangeFilter({ from, to, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  let label = 'Semua tanggal';
  if (from && to) label = `${formatShort(from)} – ${formatShort(to)}`;
  else if (from) label = `Dari ${formatShort(from)}`;
  else if (to) label = `Sampai ${formatShort(to)}`;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 w-full items-center gap-2 rounded-lg border px-3 text-left text-title
          ${from || to ? 'border-pine bg-white text-ink' : 'border-line bg-white text-ink/50'}`}
      >
        <IoCalendarOutline size={18} className="shrink-0 text-ink/60" />
        <span className="truncate">{label}</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full min-w-[240px] space-y-3 rounded-lg border border-line bg-white p-4 shadow-lg">
          <div className="space-y-1">
            <label className="text-label text-ink/50">Dari tanggal</label>
            <Input
              type="date"
              aria-label="Dari tanggal"
              value={from}
              max={to || undefined}
              onChange={(e) => onChange({ from: e.target.value })}
              className="h-10 w-full"
            />
          </div>
          <div className="space-y-1">
            <label className="text-label text-ink/50">Sampai tanggal</label>
            <Input
              type="date"
              aria-label="Sampai tanggal"
              value={to}
              min={from || undefined}
              onChange={(e) => onChange({ to: e.target.value })}
              className="h-10 w-full"
            />
          </div>
          {(from || to) && (
            <button
              type="button"
              onClick={() => onChange({ from: '', to: '' })}
              className="text-label text-ink/50 underline underline-offset-2 hover:text-ink"
            >
              Hapus filter tanggal
            </button>
          )}
        </div>
      )}
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

      <DateRangeFilter
        from={filters.from}
        to={filters.to}
        onChange={(patch) => update(patch)}
      />
    </div>
  );
}