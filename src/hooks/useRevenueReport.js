import { useCallback, useEffect, useState } from 'react';
import { errorMessage } from '@/api/client';
import { reportApi } from '@/api/reportApi';
import { transactionApi } from '@/api/transactionApi';

/**
 * Memuat ringkasan omzet dan daftar transaksinya sekaligus,
 * karena keduanya selalu ditampilkan bersama di halaman laporan.
 */
export function useRevenueReport(range) {
  const [summary, setSummary]           = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  const { from, to } = range;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [revenue, list] = await Promise.all([
        reportApi.revenue({ from, to }),
        transactionApi.list({ from, to }),
      ]);

      setSummary(revenue);
      setTransactions(list.data ?? []);
    } catch (err) {
      setError(errorMessage(err, 'Gagal memuat laporan.'));
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);

  return { summary, transactions, loading, error, reload: load };
}