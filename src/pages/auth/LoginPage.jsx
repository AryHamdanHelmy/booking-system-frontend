import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { errorMessage } from '@/api/client';
import { Button, FormField, Input } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [pending, setPending] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  async function handleSubmit() {
    setPending(true);
    setError('');

    try {
      await login(form);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setError(errorMessage(err, 'Email atau kata sandi salah.'));
    } finally {
      setPending(false);
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') handleSubmit();
  };

  return (
    <main className="flex min-h-dvh flex-col justify-center px-5 py-10 sm:items-center">
      <div className="w-full sm:max-w-sm">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">
            Refleksi
          </p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight text-ink">
            Masuk ke panel
          </h1>
          <p className="mt-2 text-sm text-ink/55">
            Kelola jadwal terapis, walk-in, dan pembayaran.
          </p>
        </div>

        <div className="space-y-4">
          <FormField label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="admin@refleksi.test"
              value={form.email}
              onChange={update('email')}
              onKeyDown={handleKeyDown}
              invalid={Boolean(error)}
            />
          </FormField>

          <FormField label="Kata sandi" htmlFor="password" error={error}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={update('password')}
              onKeyDown={handleKeyDown}
              invalid={Boolean(error)}
            />
          </FormField>

          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            loading={pending}
            disabled={!form.email || !form.password}
          >
            Masuk
          </Button>
        </div>
      </div>
    </main>
  );
}