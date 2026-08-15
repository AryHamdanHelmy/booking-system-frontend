import { useCallback, useEffect, useState } from 'react';
import { dashboardApi } from '@/api/dashboardApi';
import { errorMessage } from '@/api/client';
import { toDateParam } from '@/utils/formatTime';
import { useInterval } from './useInterval';

/** Papan status menyegarkan diri tiap 60 detik. */
const REFRESH_MS = 60_000;

export function useTodayBoard(date = toDateParam()) {
  const [data, setData]       = useState(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);

      try {
        const result = await dashboardApi.today(date);
        setData(result);
        setError('');
      } catch (err) {
        setError(errorMessage(err, 'Gagal memuat papan status.'));
      } finally {
        setLoading(false);
      }
    },
    [date],
  );

  useEffect(() => {
    load();
  }, [load]);

  // Silent agar layar tidak berkedip saat menyegarkan sendiri.
  useInterval(() => load({ silent: true }), REFRESH_MS);

  return { data, loading, error, reload: load };
}