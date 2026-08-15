import { Card } from '@/components/ui';
import { BOOKING_STATUS } from '@/constants/bookingStatus';
import { formatTime } from '@/utils/formatTime';

/**
 * Menjawab pertanyaan tersering di meja depan:
 * siapa yang bisa menangani tamu sekarang?
 */
export function DashboardTherapistStatus({ therapists = [], bookings = [] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {therapists.map((therapist) => {
        const ongoing = bookings.find(
          (b) =>
            b.therapist?.id === therapist.id &&
            b.status === BOOKING_STATUS.ONGOING,
        );

        const next = bookings
          .filter(
            (b) =>
              b.therapist?.id === therapist.id &&
              b.status === BOOKING_STATUS.CONFIRMED &&
              new Date(b.start_at) > new Date(),
          )
          .sort((a, b) => new Date(a.start_at) - new Date(b.start_at))[0];

        const busy = Boolean(ongoing);

        return (
          <Card
            key={therapist.id}
            className={`p-3 ${busy ? 'border-moss bg-moss/5' : ''}`}
          >
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={`h-2 w-2 shrink-0 rounded-full ${
                  busy ? 'bg-moss' : 'bg-ink/25'
                }`}
              />
              <p className="truncate text-title text-ink">{therapist.name}</p>
            </div>

            {busy ? (
              <>
                <p className="mt-2 truncate text-label text-ink/70">
                  {ongoing.customer?.name}
                </p>
                <p className="tnum mt-0.5 text-label text-moss">
                  selesai {formatTime(ongoing.end_at)}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-label text-ink">Kosong</p>
                <p className="tnum mt-0.5 text-label text-ink/50">
                  {next ? `terisi ${formatTime(next.start_at)}` : 'seharian'}
                </p>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}