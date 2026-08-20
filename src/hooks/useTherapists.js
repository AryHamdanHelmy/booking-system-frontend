import { useEffect, useState } from 'react';
import { publicApi } from '@/api/publicApi';

/** Terapis aktif. Jarang berubah, cukup diambil sekali per halaman. */
export function useTherapists() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    let active = true;

    publicApi
      .therapists()
      .then((data) => active && setTherapists(data))
      .catch(() => active && setTherapists([]))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return { therapists, loading };
}