import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

/**
 * Penjaga rute berdasarkan peran.
 *
 * Ini kenyamanan, bukan keamanan — siapa pun bisa membuka DevTools.
 * Yang benar-benar menjaga data adalah middleware role di Laravel.
 *
 * @param {'staff'|'customer'} allow Peran yang boleh masuk.
 */
export default function ProtectedRoute({ allow = 'staff' }) {
  const { isAuthenticated, isStaff, isCustomer, loading } = useAuth();
  const location = useLocation();

  // Tanpa penanganan loading, pengguna terlempar ke login setiap refresh.
  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const tujuan = allow === 'customer' ? ROUTES.CUSTOMER_LOGIN : ROUTES.LOGIN;
    return <Navigate to={tujuan} replace state={{ from: location }} />;
  }

  // Peran tidak sesuai. Sengaja tidak mengalihkan ke rute terlindungi lain,
  // karena keduanya bisa saling melempar dan menghasilkan pengalihan tak berujung.
  const salahPeran =
    (allow === 'staff' && !isStaff) || (allow === 'customer' && !isCustomer);

  if (salahPeran) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-bold text-ink">Halaman ini bukan untuk akun Anda</p>
        <p className="max-w-sm text-sm text-ink/55">
          Masuk dengan akun yang sesuai untuk membukanya.
        </p>
        <a
          href={isStaff ? ROUTES.DASHBOARD : ROUTES.MY_BOOKINGS}
          className="text-sm font-semibold text-pine underline"
        >
          Ke halaman saya
        </a>
      </div>
    );
  }

  return <Outlet />;
}