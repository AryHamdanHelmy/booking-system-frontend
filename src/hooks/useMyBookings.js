import { useCallback, useEffect, useState } from 'react';
import { myBookingApi } from '@/api/authApi';
import { errorMessage } from '@/api/client';

export function useMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);

    try {
      const result = await myBookingApi.list();
      setBookings(result.data ?? []);
      setError('');
    } catch (err) {
      setError(errorMessage(err, 'Gagal memuat riwayat booking.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { bookings, loading, error, reload: load };
}