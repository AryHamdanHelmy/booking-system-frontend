import { Card } from '@/components/ui';
import { BookingStatusBadge } from '@/components/dashboard/BookingStatusBadge';
import { DashboardConflictBadge } from '@/components/dashboard/DashboardConflictBadge';
import { BOOKING_SOURCE } from '@/constants/bookingSource';
import { formatCurrency } from '@/utils/formatCurrency';
import { displayPhone } from '@/utils/formatPhone';
import { formatTimeRange } from '@/utils/formatTime';

export function BookingListItem({ booking }) {
  const isWalkIn = booking.source === BOOKING_SOURCE.WALK_IN;

  return (
    <Card className={`p-4 ${booking.has_conflict ? 'border-amber' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="tnum text-label text-ink">
            {formatTimeRange(booking.start_at, booking.end_at)}
          </p>
          <p className="mt-1 truncate text-title text-ink">
            {booking.customer?.name}
          </p>
          <p className="tnum truncate text-label text-ink/50">
            {booking.customer?.phone ? displayPhone(booking.customer.phone) : ''}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <BookingStatusBadge status={booking.status} />
          {isWalkIn && (
            <span className="text-label text-ink/45">Walk-in</span>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2
        border-t border-line pt-3 text-label">
        <span className="text-ink/55">
          {booking.service?.name}
          <span className="text-ink/35">
            {' · '}
            {booking.therapist?.name ?? 'Belum ditentukan'}
          </span>
        </span>

        <span className="tnum text-label text-ink">
          {formatCurrency(booking.price_snapshot)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="tnum text-label text-ink/40">{booking.booking_code}</span>
        {booking.has_conflict && <DashboardConflictBadge />}
      </div>
    </Card>
  );
}