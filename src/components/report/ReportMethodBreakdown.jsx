import { Card } from '@/components/ui';
import { PAYMENT_METHOD_LABEL } from '@/constants/paymentMethod';
import { formatCurrency } from '@/utils/formatCurrency';

export function ReportMethodBreakdown({ byMethod = [], total = 0 }) {
  if (byMethod.length === 0) return null;

  return (
    <Card className="p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink">
        Metode bayar
      </p>

      <ul className="mt-3 space-y-3">
        {byMethod.map((item) => {
          const persen = total > 0 ? Math.round((item.total / total) * 100) : 0;

          return (
            <li key={item.method}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-ink">
                  {PAYMENT_METHOD_LABEL[item.method] ?? item.method}
                </span>
                <span className="tnum text-sm font-bold text-ink">
                  {formatCurrency(item.total)}
                </span>
              </div>

              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-pine"
                    style={{ width: `${persen}%` }}
                  />
                </div>
                <span className="tnum w-14 shrink-0 text-right text-xs text-pine">
                  {item.count}&times; · {persen}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}