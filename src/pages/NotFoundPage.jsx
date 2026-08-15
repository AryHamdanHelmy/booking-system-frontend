import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-sm font-semibold text-moss">404</p>
      <h1 className="text-2xl font-extrabold text-ink">Halaman tidak ditemukan</h1>
      <Link to={ROUTES.DASHBOARD} className="text-sm font-semibold text-pine underline">
        Kembali ke papan status
      </Link>
    </main>
  );
}