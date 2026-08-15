import { Input } from '@/components/ui';
import { DATE_PRESETS } from '@/utils/dateRange';

export function ReportDateRangeFilter({ preset, range, onPreset, onRangeChange }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {DATE_PRESETS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onPreset(item.key)}
            className={`h-9 rounded-lg border px-3 text-label transition-colors ${
              preset === item.key
                ? 'border-pine bg-pine/8 text-pine'
                : 'border-line bg-white text-ink/60 hover:border-moss'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Rentang bebas untuk kebutuhan di luar preset. */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <Input
          type="date"
          aria-label="Dari tanggal"
          value={range.from}
          max={range.to}
          onChange={(e) => onRangeChange({ ...range, from: e.target.value })}
          className="h-5 min-w-0 text-sm"
        />
        <span className="shrink-0 text-label text-ink/40">s/d</span>
        <Input
          type="date"
          aria-label="Sampai tanggal"
          value={range.to}
          min={range.from}
          onChange={(e) => onRangeChange({ ...range, to: e.target.value })}
          className="h-5 min-w-0 text-sm"
        />
      </div>
    </div>
  );
}