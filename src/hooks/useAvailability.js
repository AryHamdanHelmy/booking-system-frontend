import { useCallback, useEffect, useState } from 'react';
import { errorMessage } from '@/api/client';
import { publicApi } from '@/api/publicApi';

/**
 * Slot tersedia untuk satu tanggal & layanan.
 *
 * Backend sudah memfilter gender sebelum menghitung slot, jadi
 * apa pun yang tampil di sini benar-benar bisa dipesan.
 */
export function useAvailability({ date, serviceId, preferredGender, therapistId }) {
  const [slots, setSlots]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const load = useCallback(async () => {
    if (!date || !serviceId) {
      setSlots([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await publicApi.availability({
        date,
        service_id: serviceId,
        preferred_gender: preferredGender,
        therapist_id: therapistId || undefined,
      });
      setSlots(data);
    } catch (err) {
      setError(errorMessage(err, 'Gagal memuat jadwal.'));
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [date, serviceId, preferredGender, therapistId]);

  useEffect(() => {
    load();
  }, [load]);

  return { slots, loading, error, reload: load };
}