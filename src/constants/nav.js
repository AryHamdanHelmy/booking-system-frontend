import { BarChart3, CalendarDays, NotebookPen, Settings } from 'lucide-react';
import { ROUTES } from './routes';

/** Dipakai bersama oleh sidebar (desktop) dan tab bawah (mobile). */
export const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Hari ini', icon: CalendarDays, end: true },
  { to: ROUTES.BOOKINGS,  label: 'Booking',  icon: NotebookPen },
  { to: ROUTES.SETTINGS,  label: 'Atur',     icon: Settings },
  { to: ROUTES.REVENUE,   label: 'Laporan',  icon: BarChart3 },
];