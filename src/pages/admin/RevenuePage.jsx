import { useState } from 'react';
import { EmptyState, Spinner } from '@/components/ui';
import { ReportDailyChart } from '@/components/report/ReportDailyChart';
import { ReportDateRangeFilter } from '@/components/report/ReportDateRangeFilter';
import { ReportMethodBreakdown } from '@/components/report/ReportMethodBreakdown';
import { ReportSummary } from '@/components/report/ReportSummary';
import { ReportTransactionList } from '@/components/report/ReportTransactionList';
import { useRevenueReport } from '@/hooks/useRevenueReport';
import { buildPreset, DEFAULT_PRESET } from '@/utils/dateRange';

export default function RevenuePage() {
  const [preset, setPreset] = useState(DEFAULT_PRESET);
  const [range, setRange]   = useState(() => buildPreset(DEFAULT_PRESET));

  const { summary, transactions, loading, error } = useRevenueReport(range);

  function applyPreset(key) {
    setPreset(key);
    setRange(buildPreset(key));
  }

  function applyRange(next) {
    // Rentang bebas berarti tidak ada preset yang aktif.
    setPreset(null);
    setRange(next);
  }

  return (
    <div className="space-y-5 md:space-y-6 pt-14 md:pt-0">
      <header>
        <h1 className="text-2xl font-extrabold leading-tight text-ink lg:text-3xl">
          Laporan
        </h1>
        <p className="mt-0.5 text-sm text-ink/50">
          Omzet dari transaksi yang sudah lunas.
        </p>
      </header>

      <ReportDateRangeFilter
        preset={preset}
        range={range}
        onPreset={applyPreset}
        onRangeChange={applyRange}
      />

      {error ? (
        <EmptyState title="Gagal memuat" description={error} />
      ) : loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          <ReportSummary summary={summary} />

          <div className="grid gap-4 lg:grid-cols-2">
            <ReportDailyChart byDay={summary?.by_day} />
            <ReportMethodBreakdown
              byMethod={summary?.by_method}
              total={summary?.total}
            />
          </div>

          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-ink/40">
              Rincian transaksi
            </h2>
            <ReportTransactionList transactions={transactions} />
          </section>
        </>
      )}
    </div>
  );
}