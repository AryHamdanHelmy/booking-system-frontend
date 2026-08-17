import { EmptyState } from '@/components/ui';
import { formatDateLong } from '@/utils/formatTime';
import { BookingListItem } from './BookingListItem';

function groupByDate(bookings) {
  return bookings.reduce((acc, booking) => {
    const key = booking.start_at.substring(0, 10);
    (acc[key] ??= []).push(booking);
    return acc;
  }, {});
}

export function BookingGroupedList({ bookings }) {
  if (bookings.length === 0) {
    return (
      <EmptyState
        title="Tidak ada booking"
        description="Coba ubah kata kunci atau rentang tanggalnya."
      />
    );
  }

  const grouped = groupByDate(bookings);

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([date, items]) => (
        <section key={date}>
          <h3 className="px-1 text-label text-ink">
            {formatDateLong(date)}
          </h3>

          <div className="mt-2 space-y-2">
            {items.map((booking) => (
              <BookingListItem key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}