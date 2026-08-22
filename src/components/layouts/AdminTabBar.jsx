import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/constants/nav';

/**
 * Navigasi utama di HP. Menetap di bawah agar terjangkau ibu jari
 * saat panel dipakai sambil berdiri di meja depan.
 */
export function AdminTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-layout/70
        pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md md:hidden"
      aria-label="Navigasi utama"
    >
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex h-16 flex-col items-center justify-center gap-1 text-label transition-colors ${
                  isActive ? 'text-click' : 'text-card/55'
                }`
              }
            >
              <Icon size={22} strokeWidth={1.75} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}