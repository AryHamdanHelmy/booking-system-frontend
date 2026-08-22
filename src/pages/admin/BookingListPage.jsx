import { useMemo, useState } from 'react';
import { Button, EmptyState, Spinner } from '@/components/ui';
import { BookingFilters } from '@/components/bookinglist/BookingFilters';
import { BookingGroupedList } from '@/components/bookinglist/BookingGroupedList';
import { useBookingList } from '@/hooks/useBookingList';
import { useDebounce } from '@/hooks/useDebounce';

const INITIAL = {
  q: '',
  from: '',
  to: '',
  status: '',
  source: '',
  page: 1,
};

export default function BookingListPage() {
  const [filters, setFilters] = useState(INITIAL);

  // Pencarian ditunda agar tidak memanggil API tiap ketukan.
  const debouncedQuery = useDebounce(filters.q);

  const applied = useMemo(
    () => ({
      from: filters.from,
      to: filters.to,
      status: filters.status,
      source: filters.source,
      page: filters.page,
      q: debouncedQuery,
    }),
    [filters.from, filters.to, filters.status, filters.source, filters.page, debouncedQuery],
  );

  const { bookings, meta, loading, error } = useBookingList(applied);

  const hasFilter =
    filters.q || filters.from || filters.to || filters.status || filters.source;

  const currentPage = meta?.current_page ?? 1;
  const lastPage    = meta?.last_page ?? 1;

  return (
    <div className="space-y-5 pt-14 md:pt-0">
      <header>
        <h1 className="text-heading text-ink md:text-3xl">
          Booking
        </h1>
        <p className="mt-0.5 text-label text-ink/50">
          Semua booking online dan walk-in.
        </p>
      </header>

      <BookingFilters filters={filters} onChange={setFilters} />

      {hasFilter && (
        <button
          type="button"
          onClick={() => setFilters(INITIAL)}
          className="text-label text-pine underline"
        >
          Hapus semua filter
        </button>
      )}

      {error ? (
        <EmptyState title="Gagal memuat" description={error} />
      ) : loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          {meta?.total > 0 && (
            <p className="text-label text-ink/50">
              {meta.total} booking ditemukan
            </p>
          )}

          <BookingGroupedList bookings={bookings} />

          {lastPage > 1 && (
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              >
                Sebelumnya
              </Button>

              <span className="tnum text-label text-ink/50">
                {currentPage} / {lastPage}
              </span>

              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage >= lastPage}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              >
                Berikutnya
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}