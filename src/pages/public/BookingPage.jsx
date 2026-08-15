import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { errorMessage } from '@/api/client';
import { publicApi } from '@/api/publicApi';
import { BookingDatePicker } from '@/components/booking/BookingDatePicker';
import { BookingSlotGrid } from '@/components/booking/BookingSlotGrid';
import { Button, ChoiceGroup, FormField, Input } from '@/components/ui';
import { useAvailability } from '@/hooks/useAvailability';
import { useServices } from '@/hooks/useServices';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTime } from '@/utils/formatTime';
import { toDateParam } from '@/utils/formatTime';

const genderOptions = [
  { value: 'any',    label: 'Siapa saja' },
  { value: 'male',   label: 'Pria' },
  { value: 'female', label: 'Wanita' },
];

export default function BookingPage() {
  const navigate = useNavigate();
  const { services, loading: loadingServices } = useServices();

  const [serviceId, setServiceId] = useState('');
  const [date, setDate]           = useState(toDateParam());
  const [gender, setGender]       = useState('any');
  const [startAt, setStartAt]     = useState('');
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [error, setError]         = useState('');
  const [pending, setPending]     = useState(false);

  // Pilih layanan pertama secara bawaan agar jadwal langsung tampil.
  useEffect(() => {
    if (!serviceId && services.length > 0) {
      setServiceId(String(services[0].id));
    }
  }, [services, serviceId]);

  const { slots, loading: loadingSlots } = useAvailability({
    date,
    serviceId,
    preferredGender: gender,
  });

  // Slot yang dipilih bisa hilang saat tanggal atau layanan berubah.
  useEffect(() => {
    if (startAt && !slots.some((s) => s.start_at === startAt)) {
      setStartAt('');
    }
  }, [slots, startAt]);

  const selectedService = useMemo(
    () => services.find((s) => String(s.id) === String(serviceId)),
    [services, serviceId],
  );

  const isValid = serviceId && startAt && name.trim() && phone.trim();

  async function submit() {
    setPending(true);
    setError('');

    try {
      const booking = await publicApi.createBooking({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        service_id: Number(serviceId),
        start_at: startAt,
        preferred_gender: gender,
      });

      navigate(`/booking/${booking.booking_code}`, {
        replace: true,
        state: { justCreated: true },
      });
    } catch (err) {
      setError(errorMessage(err, 'Gagal membuat booking. Silakan coba lagi.'));
    } finally {
      setPending(false);
    }
  }

  const serviceOptions = services.map((service) => ({
    value: String(service.id),
    label: service.name,
    hint: `${service.duration_minutes} menit · ${formatCurrency(service.price)}`,
  }));

  return (
    <div className="space-y-6 pb-28">
      <header>
        <h1 className="text-2xl font-extrabold leading-tight text-ink">
          Booking sesi
        </h1>
        <p className="mt-1 text-sm text-ink/55">
          Pilih layanan dan waktu. Tidak perlu membuat akun.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-ink">1. Layanan</h2>
        {loadingServices ? (
          <div className="h-24 animate-pulse rounded-lg bg-line/50" />
        ) : (
          <ChoiceGroup
            options={serviceOptions}
            value={serviceId}
            onChange={setServiceId}
            columns={1}
          />
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-ink">2. Tanggal</h2>
        <BookingDatePicker value={date} onChange={setDate} />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-ink">3. Preferensi terapis</h2>
        <ChoiceGroup
          options={genderOptions}
          value={gender}
          onChange={setGender}
          columns={3}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-ink">4. Jam mulai</h2>
        <BookingSlotGrid
          slots={slots}
          loading={loadingSlots}
          value={startAt}
          onChange={setStartAt}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold text-ink">5. Data Anda</h2>

        <FormField label="Nama" htmlFor="book-name">
          <Input
            id="book-name"
            placeholder="Nama lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormField>

        <FormField
          label="Nomor HP"
          htmlFor="book-phone"
          hint="Dipakai untuk menghubungi Anda bila ada perubahan."
        >
          <Input
            id="book-phone"
            type="tel"
            inputMode="numeric"
            placeholder="0812..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FormField>
      </section>

      {error && (
        <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
      )}

      {/* Ringkasan dan tombol menetap di bawah agar selalu terjangkau. */}
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-white px-4 py-3
        pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
        <div className="mx-auto max-w-lg">
          {startAt && selectedService && (
            <p className="tnum mb-2 text-sm text-ink/60">
              {formatTime(startAt)} · {selectedService.name} ·{' '}
              <span className="font-bold text-ink">
                {formatCurrency(selectedService.price)}
              </span>
            </p>
          )}

          <Button
            size="lg"
            className="w-full"
            disabled={!isValid}
            loading={pending}
            onClick={submit}
          >
            {startAt ? 'Pesan sekarang' : 'Pilih jam dulu'}
          </Button>
        </div>
      </div>
    </div>
  );
}