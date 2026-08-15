import { Card } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';

export function ReportSummary({ summary }) {
  const total = summary?.total ?? 0;
  const count = summary?.count ?? 0;
  const rata  = count > 0 ? Math.round(total / count) : 0;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Card className="p-4 sm:col-span-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
          Omzet
        </p>
        <p className="tnum mt-1 text-2xl font-extrabold text-ink lg:text-3xl">
          {formatCurrency(total)}
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
          Transaksi
        </p>
        <p className="tnum mt-1 text-2xl font-extrabold text-ink lg:text-3xl">
          {count}
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
          Rata-rata
        </p>
        <p className="tnum mt-1 text-2xl font-extrabold text-ink lg:text-3xl">
          {formatCurrency(rata)}
        </p>
      </Card>
    </div>
  );
}