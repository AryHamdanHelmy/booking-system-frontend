import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarCheck, LogOut, User } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

export default function PublicLayout() {
  const { isCustomer, user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate(ROUTES.BOOKING, { replace: true });
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-layout">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-5">
          <Link
            to={ROUTES.BOOKING}
            className="text-xs font-bold uppercase tracking-[0.18em] text-click"
          >
            Refleksi
          </Link>

          {isCustomer ? (
            <div className="flex items-center gap-1">
              <NavLink
                to={ROUTES.MY_BOOKINGS}
                className={({ isActive }) =>
                  `inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold
                   ${isActive ? 'text-card' : 'text-ink/55 hover:text-ink'}`
                }
              >
                <CalendarCheck size={17} />
                <span className="hidden sm:inline">Booking saya</span>
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                aria-label={`Keluar dari akun ${user?.name ?? ''}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5
                  text-sm font-semibold text-ink/55 hover:text-clay"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <Link
              to={ROUTES.CUSTOMER_LOGIN}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5
                text-sm font-semibold text-ink/55 hover:text-ink"
            >
              <User size={17} />
              Masuk
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 py-6">
        <Outlet />
      </main>
    </div>
  );
}