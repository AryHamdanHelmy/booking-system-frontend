import { Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from './AdminSidebar';
import { AdminTabBar } from './AdminTabBar';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <div className="min-h-dvh">
      <AdminSidebar user={user} onLogout={handleLogout} />

      <div className="flex min-h-dvh flex-col md:pl-60">
        {/* Header ringkas, hanya di HP. Di desktop identitas ada di sidebar. */}
        <header className="flex h-14 items-center justify-between border-b border-line
          bg-layout px-4 lg:hidden">
          <span className="text-label uppercase tracking-[0.18em] text-pine">
            Refleksi
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="text-label text-pine/55"
          >
            Keluar
          </button>
        </header>

        {/* pb-20 memberi ruang untuk tab bawah agar kartu terakhir tetap terbaca. */}
        <main className="flex-1 px-4 py-5 pb-20 lg:px-8 lg:py-7 lg:pb-8">
          <Outlet />
        </main>
      </div>

      <AdminTabBar />
    </div>
  );
}