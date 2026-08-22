import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { errorMessage } from '@/api/client';
import { Button, FormField, Input } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { isStaff as cekStaff } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';

export default function CustomerLoginPage() {
  const { login, isAuthenticated, isStaff, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [pending, setPending] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to={isStaff ? ROUTES.DASHBOARD : ROUTES.MY_BOOKINGS} replace />;
  }

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function submit() {
    setPending(true);
    setError('');

    try {
      const loggedIn = await login(form);
      // Pakai role dari hasil login langsung (bukan is_staff),
      // supaya tidak tergantung tick render context dan konsisten
      // dengan logic yang dipakai ProtectedRoute.
      const staff = cekStaff(loggedIn?.role);
      navigate(staff ? ROUTES.DASHBOARD : ROUTES.MY_BOOKINGS, { replace: true });
    } catch (err) {
      setError(errorMessage(err, 'Email atau kata sandi salah.'));
    } finally {
      setPending(false);
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className="mx-auto max-w-sm py-6">
      <header className="mb-7">
        <h1 className="text-2xl font-extrabold leading-tight text-ink">Masuk</h1>
        <p className="mt-1 text-sm text-ink/55">
          Lihat riwayat booking dan pesan lebih cepat tanpa mengisi data lagi.
        </p>
      </header>

      <div className="space-y-4">
        <FormField label="Email" htmlFor="cust-email">
          <Input
            id="cust-email"
            type="email"
            autoComplete="username"
            placeholder="nama@email.com"
            value={form.email}
            onChange={update('email')}
            onKeyDown={onKeyDown}
            invalid={Boolean(error)}
          />
        </FormField>

        <FormField label="Kata sandi" htmlFor="cust-password" error={error}>
          <Input
            id="cust-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={update('password')}
            onKeyDown={onKeyDown}
            invalid={Boolean(error)}
          />
        </FormField>

        <Button
          size="lg"
          className="w-full"
          onClick={submit}
          loading={pending}
          disabled={!form.email || !form.password}
        >
          Masuk
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-ink/55">
        Belum punya akun?{' '}
        <Link to={ROUTES.REGISTER} className="font-semibold text-pine underline">
          Daftar di sini
        </Link>
      </p>

      <p className="mt-3 text-center text-sm text-ink/45">
        Atau{' '}
        <Link to={ROUTES.BOOKING} className="font-semibold text-ink/70 underline">
          pesan tanpa akun
        </Link>
      </p>
    </div>
  );
}