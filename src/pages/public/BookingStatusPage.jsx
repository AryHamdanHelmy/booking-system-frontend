import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { IoLogoWhatsapp } from "react-icons/io5";
import { errorMessage } from '@/api/client';
import { publicApi } from '@/api/publicApi';
import { BookingCodeCard } from '@/components/booking/BookingCodeCard';
import { Badge, Button, Card, EmptyState, Spinner } from '@/components/ui';
import { STATUS_LABEL, STATUS_STYLE } from '@/constants/bookingStatus';
import { OUTLET } from '@/constants/outlet';
import { formatCurrency } from '@/utils/formatCurrency';
import { whatsappLink } from '@/utils/formatPhone';
import { formatDateLong, formatTimeRange } from '@/utils/formatTime';

export default function BookingStatusPage() {
  const { code } = useParams();
  const location = useLocation();
  const justCreated = location.state?.justCreated === true;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      setBooking(await publicApi.showBooking(code));
      setError('');
    } catch (err) {
      setError(errorMessage(err, 'Booking tidak ditemukan.'));
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  async function cancel() {
    setPending(true);

    try {
      setBooking(await publicApi.cancelBooking(code));
      setConfirming(false);
    } catch (err) {
      setError(errorMessage(err, 'Gagal membatalkan booking.'));
    } finally {
      setPending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  if (!booking) {
    return (
      <EmptyState
        title="Booking tidak ditemukan"
        description={error || 'Periksa kembali kode booking Anda.'}
        action={
          <Link to="/" className="text-sm font-semibold text-pine underline">
            Buat booking baru
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      {justCreated && (
        <div className="rounded-lg bg-moss/10 px-4 py-3 text-center">
          <p className="font-bold text-pine">Booking berhasil</p>
          <p className="mt-0.5 text-sm text-ink/60">
            Sampai jumpa di {OUTLET.name}.
          </p>
        </div>
      )}

      <BookingCodeCard booking={booking} />

      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-label uppercase tracking-wide text-pine">
              Jadwal
            </p>
            <p className="mt-1 font-bold text-ink">
              {formatDateLong(booking.start_at)}
            </p>
            <p className="tnum mt-0.5 text-pine/70">
              {formatTimeRange(booking.start_at, booking.end_at)}
            </p>
          </div>

          <Badge className={STATUS_STYLE[booking.status] ?? 'bg-line text-ink/70'}>
            {STATUS_LABEL[booking.status] ?? booking.status}
          </Badge>
        </div>

        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-pine">Layanan</dt>
            <dd className="text-right font-semibold text-ink">
              {booking.service?.name}
            </dd>
          </div>

          <div className="flex justify-between gap-3">
            <dt className="text-pine">Terapis</dt>
            <dd className="text-right font-semibold text-ink">
              {booking.therapist?.name ?? 'Ditentukan outlet'}
            </dd>
          </div>

          <div className="flex justify-between gap-3">
            <dt className="text-pine">Biaya</dt>
            <dd className="tnum text-right font-bold text-ink">
              {formatCurrency(booking.price)}
            </dd>
          </div>
        </dl>
      </Card>

      {error && (
        <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
      )}

      {booking.can_cancel ? (
        confirming ? (
          <Card className="p-4">
            <p className="font-semibold text-ink">Batalkan booking ini?</p>
            <p className="mt-1 text-sm text-ink/55">
              Tindakan ini tidak bisa dibatalkan. Anda perlu memesan ulang.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setConfirming(false)}
              >
                Tidak jadi
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                loading={pending}
                onClick={cancel}
              >
                Ya, batalkan
              </Button>
            </div>
          </Card>
        ) : (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setConfirming(true)}
          >
            Batalkan booking
          </Button>
        )
      ) : (
        // Di bawah 2 jam sebelum jadwal, pembatalan mandiri ditutup —
        // arahkan ke admin agar tetap ada jalan keluar.
        booking.status === 'confirmed' && (
          <a
            href={whatsappLink(
              OUTLET.whatsapp,
              `Halo, saya ingin mengubah booking ${booking.booking_code}.`,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2
              rounded-lg border border-line bg-white text-sm font-semibold text-ink
              transition-colors hover:border-moss"
          >
            <IoLogoWhatsapp size={18} />
            Hubungi outlet untuk ubah jadwal
          </a>
        )
      )}
    </div>
  );
}