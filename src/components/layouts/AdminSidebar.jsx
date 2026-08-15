import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/constants/nav';

/** Hanya tampil di layar lebar. Di HP digantikan tab bawah. */
export function AdminSidebar({ user, onLogout }) {
  return (
    <aside className="fixed inset-y-0 left0 z-30 hidden w-60 shrink-0 flex-col border-r border-line bg-white md:flex">
      <div className="px-5 py-7">
        <p className="text-title text-ink">Refleksi</p>
        <p className="mt-0.5 text-label text-ink/45">Panel operasional</p>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-label transition-colors ${
                    isActive
                      ? 'bg-pine/8 text-pine'
                      : 'text-ink/55 hover:bg-ink/4 hover:text-ink'
                  }`
                }
              >
                <Icon size={20} strokeWidth={1.75} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-line px-3 py-2">
        <p className="truncate px-3 pb-2 text-label text-ink">
          {user?.name}
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5
            text-label text-clay transition-colors hover:bg-clay/8"
        >
          <LogOut size={20} strokeWidth={1.75} />
          Keluar
        </button>
      </div>
    </aside>
  );
}