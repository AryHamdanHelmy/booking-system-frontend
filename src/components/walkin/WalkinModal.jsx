import { useEffect, useMemo, useState } from 'react';
import { errorMessage } from '@/api/client';
import { walkinApi, conflictsFrom, isConflictWarning } from '@/api/walkinApi';
import { Button, ChoiceGroup, FormField, Input, Modal } from '@/components/ui';
import { BOOKING_STATUS } from '@/constants/bookingStatus';
import { useServices } from '@/hooks/useServices';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTime } from '@/utils/formatTime';
import { WalkinConflictDialog } from './WalkinConflictDialog';

const EMPTY = { customer_name: '', customer_phone: '', service_id: '', therapist_id: '' };

export function WalkinModal({ isOpen, onClose, onCreated, therapists = [], bookings = [] }) {
  const { services } = useServices();

  const [form, setForm]           = useState(EMPTY);
  const [error, setError]         = useState('');
  const [pending, setPending]     = useState(false);
  const [conflicts, setConflicts] = useState(null);

  /** Terapis yang sedang tidak menangani tamu. */
  const freeTherapistIds = useMemo(() => {
    const busy = new Set(
      bookings
        .filter((b) => b.status === BOOKING_STATUS.ONGOING)
        .map((b) => b.therapist?.id),
    );
    return therapists.filter((t) => !busy.has(t.id)).map((t) => t.id);
  }, [therapists, bookings]);

  // Bila hanya satu terapis yang bebas, pilih otomatis — menghemat
  // satu ketukan saat tamu sudah berdiri di depan meja.
  useEffect(() => {
    if (!isOpen) return;

    setForm({
      ...EMPTY,
      service_id: services.length === 1 ? String(services[0].id) : '',
      therapist_id: freeTherapistIds.length === 1 ? String(freeTherapistIds[0]) : '',
    });
    setError('');
    setConflicts(null);
  }, [isOpen, services, freeTherapistIds]);

  const update = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const selectedService = services.find(
    (s) => String(s.id) === String(form.service_id),
  );

  const isValid =
    form.customer_name.trim() &&
    form.customer_phone.trim() &&
    form.service_id &&
    form.therapist_id;

  async function submit({ force = false } = {}) {
    setPending(true);
    setError('');

    try {
      const booking = await walkinApi.create(
        {
          customer_name: form.customer_name.trim(),
          customer_phone: form.customer_phone.trim(),
          service_id: Number(form.service_id),
          therapist_id: Number(form.therapist_id),
        },
        { force },
      );

      setConflicts(null);
      onCreated(booking);
      onClose();
    } catch (err) {
      // 409 bukan kegagalan — backend meminta konfirmasi admin.
      if (isConflictWarning(err)) {
        setConflicts(conflictsFrom(err));
      } else {
        setError(errorMessage(err, 'Gagal menyimpan walk-in.'));
      }
    } finally {
      setPending(false);
    }
  }

  const therapistOptions = therapists.map((therapist) => {
    const ongoing = bookings.find(
      (b) => b.therapist?.id === therapist.id && b.status === BOOKING_STATUS.ONGOING,
    );

    return {
      value: String(therapist.id),
      label: therapist.name,
      hint: ongoing ? `sibuk s/d ${formatTime(ongoing.end_at)}` : 'kosong',
    };
  });

  const serviceOptions = services.map((service) => ({
    value: String(service.id),
    label: service.name.replace(/^Refleksi\s*/i, ''),
    hint: `${service.duration_minutes} mnt · ${formatCurrency(service.price)}`,
  }));

  return (
    <>
      <Modal
        isOpen={isOpen && !conflicts}
        onClose={onClose}
        title="Walk-in"
        description="Sesi langsung dimulai setelah disimpan."
        footer={
          <Button
            size="lg"
            className="w-full"
            disabled={!isValid}
            loading={pending}
            onClick={() => submit()}
          >
            Mulai sesi
            {selectedService ? ` · ${formatCurrency(selectedService.price)}` : ''}
          </Button>
        }
      >
        <div className="space-y-4">
          <FormField label="Nama tamu" htmlFor="walkin-name">
            <Input
              id="walkin-name"
              autoFocus
              placeholder="Nama"
              value={form.customer_name}
              onChange={(e) => update('customer_name')(e.target.value)}
            />
          </FormField>

          <FormField
            label="Nomor HP"
            htmlFor="walkin-phone"
            hint="Dipakai sebagai identitas tamu untuk kunjungan berikutnya."
          >
            <Input
              id="walkin-phone"
              type="tel"
              inputMode="numeric"
              placeholder="0812..."
              value={form.customer_phone}
              onChange={(e) => update('customer_phone')(e.target.value)}
            />
          </FormField>

          <FormField label="Layanan">
            <ChoiceGroup
              options={serviceOptions}
              value={form.service_id}
              onChange={update('service_id')}
              columns={1}
            />
          </FormField>

          <FormField label="Terapis">
            <ChoiceGroup
              options={therapistOptions}
              value={form.therapist_id}
              onChange={update('therapist_id')}
            />
          </FormField>

          {error && (
            <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
          )}
        </div>
      </Modal>

      <WalkinConflictDialog
        isOpen={Boolean(conflicts)}
        conflicts={conflicts ?? []}
        pending={pending}
        onCancel={() => setConflicts(null)}
        onConfirm={() => submit({ force: true })}
      />
    </>
  );
}