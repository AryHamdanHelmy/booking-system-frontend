import { Route, Routes } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import PublicLayout from '@/components/layouts/PublicLayout';
import { ROUTES } from '@/constants/routes';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import RevenuePage from '@/pages/admin/RevenuePage';
import SettingsPage from '@/pages/admin/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import BookingPage from '../pages/public/BookingPage';
import BookingStatusPage from '../pages/public/BookingStatusPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Publik — tanpa login */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.BOOKING} element={<BookingPage/>} />
        <Route path="/booking/:code" element={<BookingStatusPage />} />
      </Route>

      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Admin — wajib login */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.REVENUE} element={<RevenuePage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}