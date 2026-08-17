import { useCallback, useEffect, useState } from 'react';
import { bookingApi } from '@/api/bookingApi';
import { errorMessage } from '@/api/client';

export function useBookingList(filters) {
  const [bookings, setBookings] = useState([]);
  const [meta, setMeta]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const { q, from, to, status, source, page } = filters;

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const result = await bookingApi.list({
        q: q || undefined,
        from: from || undefined,
        to: to || undefined,
        status: status || undefined,
        source: source || undefined,
        page,
      });
      console.log('q dikirim:', q, '| total diterima:', result.meta?.total, '| jumlah data:', result.data?.length);

      setBookings(result.data ?? []);
      setMeta(result.meta ?? null);
      setError('');
    } catch (err) {
      setError(errorMessage(err, 'Gagal memuat daftar booking.'));
    } finally {
      setLoading(false);
    }
  }, [q, from, to, status, source, page]);

  useEffect(() => {
    load();
  }, [load]);

  return { bookings, meta, loading, error, reload: load };
}