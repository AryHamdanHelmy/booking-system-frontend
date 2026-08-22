import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { errorMessage } from '@/api/client';
import { Button, FormField, Input } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
};

export default function RegisterPage() {
  const { register, isAuthenticated, isStaff, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
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
    setErrors({});

    try {
      await register(form);
      navigate(ROUTES.MY_BOOKINGS, { replace: true });
    } catch (err) {
      setErrors(err?.response?.data?.errors ?? {});
      setError(errorMessage(err, 'Pendaftaran gagal. Periksa kembali isian Anda.'));
    } finally {
      setPending(false);
    }
  }

  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.password.length >= 8 &&
    form.password === form.password_confirmation;

  const fieldError = (key) => errors[key]?.[0];

  return (
    <div className="mx-auto max-w-sm py-6">
      <header className="mb-7">
        <h1 className="text-2xl font-extrabold leading-tight text-ink">Daftar</h1>
        <p className="mt-1 text-sm text-ink/55">
          Booking Anda sebelumnya dengan nomor yang sama akan otomatis terhubung.
        </p>
      </header>

      <div className="space-y-4">
        <FormField label="Nama" htmlFor="reg-name" error={fieldError('name')}>
          <Input
            id="reg-name"
            placeholder="Nama lengkap"
            value={form.name}
            onChange={update('name')}
            invalid={Boolean(fieldError('name'))}
          />
        </FormField>

        <FormField label="Email" htmlFor="reg-email" error={fieldError('email')}>
          <Input
            id="reg-email"
            type="email"
            autoComplete="username"
            placeholder="nama@email.com"
            value={form.email}
            onChange={update('email')}
            invalid={Boolean(fieldError('email'))}
          />
        </FormField>

        <FormField
          label="Nomor HP"
          htmlFor="reg-phone"
          error={fieldError('phone')}
          hint="Dipakai sebagai identitas saat datang ke outlet."
        >
          <Input
            id="reg-phone"
            type="tel"
            inputMode="numeric"
            placeholder="0812..."
            value={form.phone}
            onChange={update('phone')}
            invalid={Boolean(fieldError('phone'))}
          />
        </FormField>

        <FormField
          label="Kata sandi"
          htmlFor="reg-password"
          error={fieldError('password')}
          hint="Minimal 8 karakter."
        >
          <Input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.password}
            onChange={update('password')}
            invalid={Boolean(fieldError('password'))}
          />
        </FormField>

        <FormField
          label="Ulangi kata sandi"
          htmlFor="reg-confirm"
          error={
            form.password_confirmation && form.password !== form.password_confirmation
              ? 'Kata sandi tidak sama.'
              : undefined
          }
        >
          <Input
            id="reg-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.password_confirmation}
            onChange={update('password_confirmation')}
          />
        </FormField>

        {error && !Object.keys(errors).length && (
          <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
        )}

        <Button
          size="lg"
          className="w-full"
          onClick={submit}
          loading={pending}
          disabled={!isValid}
        >
          Buat akun
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-ink/55">
        Sudah punya akun?{' '}
        <Link to={ROUTES.CUSTOMER_LOGIN} className="font-semibold text-pine underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}