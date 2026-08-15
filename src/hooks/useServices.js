import { useEffect, useState } from 'react';
import { publicApi } from '@/api/publicApi';

/** Daftar layanan aktif. Jarang berubah, jadi cukup diambil sekali per halaman. */
export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let active = true;

    publicApi
      .services()
      .then((data) => active && setServices(data))
      .catch(() => active && setServices([]))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return { services, loading };
}