import { IoToday, IoBook, IoStatsChart, IoSettings } from 'react-icons/io5';
import { ROUTES } from './routes';

/** Dipakai bersama oleh sidebar (desktop) dan tab bawah (mobile). */
export const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Hari ini', icon: IoToday, end: true },
  { to: ROUTES.BOOKINGS,  label: 'Booking',  icon: IoBook },
  { to: ROUTES.SETTINGS,  label: 'Atur',     icon: IoSettings },
  { to: ROUTES.REVENUE,   label: 'Laporan',  icon: IoStatsChart },
];