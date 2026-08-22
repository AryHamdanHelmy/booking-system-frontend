import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';
import { myBookingApi } from '@/api/authApi';
import { errorMessage } from '@/api/client';
import { Badge, Button, Card, EmptyState, Spinner } from '@/components/ui';
import { isActiveStatus, STATUS_LABEL, STATUS_STYLE } from '@/constants/bookingStatus';
import { ROUTES } from '@/constants/routes';
import { useMyBookings } from '@/hooks/useMyBookings';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateLong, formatTimeRange } from '@/utils/formatTime';

function BookingItem({ booking, onCancel, pending }) {
  const [konfirmasi, setKonfirmasi] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-ink">{formatDateLong(booking.start_at)}</p>
          <p className="tnum mt-0.5 text-sm text-ink/70">
            {formatTimeRange(booking.start_at, booking.end_at)}
          </p>
        </div>
        <Badge className={STATUS_STYLE[booking.status] ?? 'bg-line text-ink/70'}>
          {STATUS_LABEL[booking.status] ?? booking.status}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2
        border-t border-line pt-3 text-sm">
        <span className="text-ink/60">
          {booking.service?.name}
          {booking.therapist?.name && (
            <span className="text-ink/50"> · {booking.therapist.name}</span>
          )}
        </span>
        <span className="tnum font-semibold text-ink">
          {formatCurrency(booking.price)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="tnum text-xs text-pine">{booking.booking_code}</span>

        <Link
          to={ROUTES.BOOKING_STATUS(booking.booking_code)}
          className="ml-auto text-sm font-semibold text-pine underline"
        >
          Lihat detail
        </Link>
      </div>

      {booking.can_cancel && (
        konfirmasi ? (
          <div className="mt-3 rounded-lg bg-clay/8 px-3 py-3">
            <p className="text-sm font-semibold text-ink">Batalkan booking ini?</p>
            <div className="mt-2 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setKonfirmasi(false)}
              >
                Tidak jadi
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                loading={pending}
                onClick={() => onCancel(booking.booking_code)}
              >
                Ya, batalkan
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 w-full"
            onClick={() => setKonfirmasi(true)}
          >
            Batalkan
          </Button>
        )
      )}
    </Card>
  );
}

export default function MyBookingsPage() {
  const { bookings, loading, error, reload } = useMyBookings();
  const [pendingCode, setPendingCode] = useState(null);
  const [actionError, setActionError] = useState('');

  async function cancel(code) {
    setPendingCode(code);
    setActionError('');

    try {
      await myBookingApi.cancel(code);
      await reload({ silent: true });
    } catch (err) {
      setActionError(errorMessage(err, 'Gagal membatalkan booking.'));
    } finally {
      setPendingCode(null);
    }
  }

  const mendatang = bookings.filter((b) => isActiveStatus(b.status));
  const riwayat   = bookings.filter((b) => !isActiveStatus(b.status));

  return (
    <div className="space-y-5 py-2">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold leading-tight text-ink">
            Booking saya
          </h1>
          <p className="mt-0.5 text-sm text-ink/55">
            Jadwal mendatang dan riwayat kunjungan.
          </p>
        </div>

        <Link
          to={ROUTES.BOOKING}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-click
            px-4 text-sm font-semibold text-white transition-colors hover:bg-ink"
        >
          <CalendarPlus size={18} />
          Pesan
        </Link>
      </header>

      {actionError && (
        <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{actionError}</p>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : error ? (
        <EmptyState title="Gagal memuat" description={error} />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="Belum ada booking"
          description="Booking pertama Anda akan muncul di sini."
          action={
            <Link
              to={ROUTES.BOOKING}
              className="text-sm font-semibold text-pine underline"
            >
              Pesan sesi sekarang
            </Link>
          }
        />
      ) : (
        <>
          {mendatang.length > 0 && (
            <section>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/40">
                Mendatang
              </h2>
              <div className="space-y-2">
                {mendatang.map((b) => (
                  <BookingItem
                    key={b.booking_code}
                    booking={b}
                    pending={pendingCode === b.booking_code}
                    onCancel={cancel}
                  />
                ))}
              </div>
            </section>
          )}

          {riwayat.length > 0 && (
            <section>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/40">
                Riwayat
              </h2>
              <div className="space-y-2 opacity-75">
                {riwayat.map((b) => (
                  <BookingItem
                    key={b.booking_code}
                    booking={b}
                    pending={false}
                    onCancel={cancel}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}