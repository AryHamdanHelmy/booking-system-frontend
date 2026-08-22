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
import BookingListPage from '../pages/admin/BookingListPage';
import CustomerLoginPage from '../pages/auth/CustomerLoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import MyBookingsPage from '../pages/public/MyBookingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Publik — tanpa login */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.BOOKING} element={<BookingPage/>} />
        <Route path="/booking/:code" element={<BookingStatusPage />} />
        <Route path={ROUTES.CUSTOMER_LOGIN} element={<CustomerLoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      
        <Route element={<ProtectedRoute allow="customer" />}>
          <Route path={ROUTES.MY_BOOKINGS} element={<MyBookingsPage />} />
        </Route>
      </Route>

      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Admin — wajib login */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.REVENUE} element={<RevenuePage />} />
          <Route path={ROUTES.BOOKINGS} element={<BookingListPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}