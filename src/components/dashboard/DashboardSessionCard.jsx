import { Button, Card } from '@/components/ui';
import { BOOKING_STATUS } from '@/constants/bookingStatus';
import { BOOKING_SOURCE } from '@/constants/bookingSource';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTime } from '@/utils/formatTime';
import { BookingStatusBadge } from './BookingStatusBadge';
import { DashboardConflictBadge } from './DashboardConflictBadge';

/** Tindakan yang masuk akal dari status saat ini. */
function primaryAction(booking) {
  switch (booking.status) {
    case BOOKING_STATUS.CONFIRMED:
      return { label: 'Mulai sesi', next: BOOKING_STATUS.ONGOING };
    case BOOKING_STATUS.PENDING:
      return { label: 'Konfirmasi', next: BOOKING_STATUS.CONFIRMED };
    default:
      return null;
  }
}

export function DashboardSessionCard({
  booking,
  onChangeStatus,
  onCheckout,
  onNoShow,
  pending = false,
}) {
  const action    = primaryAction(booking);
  const isOngoing = booking.status === BOOKING_STATUS.ONGOING;
  const isWalkIn  = booking.source === BOOKING_SOURCE.WALK_IN;
  const isLate    =
    booking.status === BOOKING_STATUS.CONFIRMED &&
    new Date(booking.start_at) < new Date();

  return (
    <Card
      className={`p-4 ${booking.has_conflict ? 'border-amber' : ''} ${
        isOngoing ? 'border-moss' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="tnum text-title leading-none text-pine">
            {formatTime(booking.start_at)}
            <span className="text-pine/45"> – {formatTime(booking.end_at)}</span>
          </p>
          <p className="mt-1.5 truncate text-title text-ink">
            {booking.customer?.name}
          </p>
          <p className="mt-1 text-label text-ink">
            {booking.service?.name}
          </p>
          <p className=" text-label text-pine">
            {booking.therapist?.name ?? 'Belum ditentukan'}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <BookingStatusBadge status={booking.status} />
          {isWalkIn && (
            <span className="text-label text-pine/55">Walk-in</span>
          )}
        </div>
      </div>

      {(booking.has_conflict || isLate) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {booking.has_conflict && <DashboardConflictBadge />}
          {isLate && (
            <span className="text-label text-clay">
              Lewat jadwal, belum dimulai
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {action && (
          <Button
            size="sm"
            loading={pending}
            onClick={() => onChangeStatus(booking, action.next)}
          >
            {action.label}
          </Button>
        )}

        {isOngoing && (
          <Button size="sm" loading={pending} onClick={() => onCheckout(booking)}>
            Selesai &amp; bayar
          </Button>
        )}

        {booking.status === BOOKING_STATUS.CONFIRMED && (
          <Button
            size="sm"
            variant="secondary"
            loading={pending}
            onClick={() => onNoShow(booking)}
          >
            Tidak datang
          </Button>
        )}

        <span className="tnum ml-auto text-sm font-semibold text-ink/60">
          {formatCurrency(booking.price_snapshot)}
        </span>
      </div>
    </Card>
  );
}