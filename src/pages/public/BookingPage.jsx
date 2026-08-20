import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { errorMessage } from '@/api/client';
import { publicApi } from '@/api/publicApi';
import { BookingDatePicker } from '@/components/booking/BookingDatePicker';
import { BookingServicePicker } from '@/components/booking/BookingServicePicker';
import { BookingTherapistPicker } from '../../components/booking/BookingTherapistPicker';
import { BookingSlotGrid } from '@/components/booking/BookingSlotGrid';
import { Button, ChoiceGroup, FormField, Input } from '@/components/ui';
import { useAvailability } from '@/hooks/useAvailability';
import { useServices } from '@/hooks/useServices';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTime, toDateParam } from '@/utils/formatTime';
import { useTherapists } from '../../hooks/useTherapists';

const genderOptions = [
  { value: 'any',    label: 'Siapa saja' },
  { value: 'male',   label: 'Pria' },
  { value: 'female', label: 'Wanita' },
];

function Section({ title, children }) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default function BookingPage() {
  const navigate = useNavigate();
  const { services, loading: loadingServices } = useServices();
  const { therapists } = useTherapists();

  const [serviceId, setServiceId] = useState('');
  const [date, setDate]           = useState(toDateParam());
  const [gender, setGender]       = useState('any');
  const [startAt, setStartAt]     = useState('');
  const [therapistId, setTherapistId] = useState('');
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

  const selectedSlot = useMemo(
    () => slots.find((s) => s.start_at === startAt),
    [slots, startAt],
  );


  // Slot yang dipilih bisa hilang saat tanggal atau layanan berubah.
  useEffect(() => {
    if (startAt && !slots.some((s) => s.start_at === startAt && s.is_available)) {
      setStartAt('');
    }
  }, [slots, startAt]);

  useEffect(() => {
    if (!therapistId) return;
 
    const masihBisa = selectedSlot?.available_therapist_ids?.includes(
      Number(therapistId),
    );
 
    if (!masihBisa) setTherapistId('');
  }, [selectedSlot, therapistId]);


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
        therapist_id: therapistId ? Number(therapistId) : undefined,
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

  return (
    <div className="space-y-6 pb-32">
      <header>
        <h1 className="text-heading text-ink">
          Booking sesi
        </h1>
        <p className="mt-1 text-label text-ink/55">
          Pilih layanan dan waktu. Tidak perlu membuat akun.
        </p>
      </header>

      <Section title="Layanan">
        {loadingServices ? (
          <div className="h-28 animate-pulse rounded-xl bg-line/50" />
        ) : (
          <BookingServicePicker
            services={services}
            value={serviceId}
            onChange={setServiceId}
          />
        )}
      </Section>

      <Section title="Tanggal">
        <BookingDatePicker value={date} onChange={setDate} />
      </Section>

      <Section title="Preferensi terapis">
        <ChoiceGroup
          options={genderOptions}
          value={gender}
          onChange={setGender}
          columns={3}
        />
      </Section>

      <Section title="Jam mulai">
        <BookingSlotGrid
          slots={slots}
          loading={loadingSlots}
          value={startAt}
          onChange={setStartAt}
        />
      </Section>

      {selectedSlot && (
        <Section title="Terapis">
          <BookingTherapistPicker
            therapists={therapists}
            availableIds={selectedSlot.available_therapist_ids ?? []}
            value={therapistId}
            onChange={setTherapistId}
          />
        </Section>
      )}


      <Section title="Data Anda">
        <div className="space-y-4">
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
        </div>
      </Section>

      {error && (
        <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
      )}

      {/* Ringkasan biaya menetap di bawah agar selalu terlihat. */}
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-white px-4 py-3
        pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
              Total biaya
            </p>
            <p className="tnum text-xl font-extrabold leading-tight text-ink">
              {selectedService ? formatCurrency(selectedService.price) : '—'}
            </p>
            {startAt && (
              <p className="tnum truncate text-xs text-ink/50">
                {formatTime(startAt)} · {selectedService?.name}
              </p>
            )}
          </div>

          <Button
            size="lg"
            className="shrink-0"
            disabled={!isValid}
            loading={pending}
            onClick={submit}
          >
            {startAt ? 'Pesan sekarang' : 'Pilih jam'}
          </Button>
        </div>
      </div>
    </div>
  );
}