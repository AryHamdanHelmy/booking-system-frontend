import { Card } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';

/**
 * Grafik batang sederhana tanpa pustaka tambahan.
 * Tinggi batang relatif terhadap hari tertinggi dalam rentang.
 */
export function ReportDailyChart({ byDay = [] }) {
  if (byDay.length === 0) return null;

  const max = Math.max(...byDay.map((d) => d.total));

  return (
    <Card className="p-4">
      <p className="text-label text-ink">
        Per hari
      </p>

      <div className="mt-4 flex items-end gap-1 overflow-x-auto pb-1"
        style={{ minHeight: '7rem' }}>
        {byDay.map((day) => {
          const tinggi = max > 0 ? Math.max((day.total / max) * 100, 4) : 4;
          const tanggal = new Date(day.date);

          return (
            <div
              key={day.date}
              className="flex min-w-8 flex-1 flex-col items-center gap-1"
              title={`${day.date} · ${formatCurrency(day.total)}`}
            >
              <div className="flex h-24 w-full items-end">
                <div
                  className="w-full rounded-t bg-pine"
                  style={{ height: `${tinggi}%` }}
                />
              </div>
              <span className="tnum text-label text-ink">
                {tanggal.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}