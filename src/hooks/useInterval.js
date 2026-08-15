import { useEffect, useRef } from 'react';

/**
 * Menjalankan callback tiap beberapa detik.
 * Dipakai papan status agar jadwal tetap segar tanpa perlu refresh manual.
 * Kirim delay = null untuk menghentikan.
 */
export function useInterval(callback, delay) {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return undefined;

    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}