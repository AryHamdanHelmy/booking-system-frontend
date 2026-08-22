import { Card, EmptyState } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTime } from '@/utils/formatTime';

function groupByDate(transactions) {
  return transactions.reduce((acc, trx) => {
    const key = trx.paid_at?.substring(0, 10) ?? '-';
    (acc[key] ??= []).push(trx);
    return acc;
  }, {});
}

const dayLabel = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

export function ReportTransactionList({ transactions = [] }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="Belum ada transaksi"
        description="Tidak ada pembayaran tercatat pada rentang tanggal ini."
      />
    );
  }

  const grouped = groupByDate(transactions);

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([date, items]) => {
        const subtotal = items.reduce((sum, t) => sum + t.total, 0);

        return (
          <section key={date}>
            <div className="flex items-baseline justify-between gap-3 px-1">
              <h3 className="text-sm font-bold text-ink">{dayLabel(date)}</h3>
              <span className="tnum text-label text-ink/55">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="mt-2 space-y-2">
              {items.map((trx) => (
                <Card key={trx.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">
                        {trx.booking?.customer_name ?? '-'}
                      </p>
                      <p className="truncate text-label text-ink">
                        {trx.booking?.service_name}
                      </p>
                      <p className="tnum mt-0.5 text-label text-pine">
                        {formatTime(trx.paid_at)} · {trx.booking?.therapist_name} ·{' '}
                        {trx.invoice_number}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="tnum font-bold text-ink">
                        {formatCurrency(trx.total)}
                      </p>
                      <p className="mt-0.5 text-label text-pine">
                        {trx.payment_method_label}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}