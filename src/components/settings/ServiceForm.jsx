import { useEffect, useState } from 'react';
import { errorMessage } from '@/api/client';
import { serviceApi } from '@/api/masterApi';
import { Button, FormField, Input, Modal, Textarea} from '@/components/ui';
import { formatNumberInput, parseNumberInput } from '@/utils/formatCurrency';

const EMPTY = {
  name: '',
  duration_minutes: '60',
  buffer_minutes: '15',
  description: '',
  price: '',
};

export function ServiceForm({ isOpen, service, onClose, onSaved }) {
  const [form, setForm]       = useState(EMPTY);
  const [error, setError]     = useState('');
  const [pending, setPending] = useState(false);

  const isEdit = Boolean(service);

  useEffect(() => {
    if (!isOpen) return;

    setForm(
      service
        ? {
            name: service.name,
            duration_minutes: String(service.duration_minutes),
            buffer_minutes: String(service.buffer_minutes),
            description: service.description ?? '',
            price: String(service.price),
          }
        : EMPTY,
    );
    setError('');
  }, [isOpen, service]);

  const update = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function submit() {
    setPending(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      duration_minutes: Number(form.duration_minutes),
      buffer_minutes: Number(form.buffer_minutes),
      description: form.description.trim() || null,
      price: Number(form.price),
    };

    try {
      const saved = isEdit
        ? await serviceApi.update(service.id, payload)
        : await serviceApi.create({ ...payload, is_active: true });

      onSaved(saved);
      onClose();
    } catch (err) {
      setError(errorMessage(err, 'Gagal menyimpan layanan.'));
    } finally {
      setPending(false);
    }
  }

  const isValid =
    form.name.trim() && Number(form.duration_minutes) >= 15 && Number(form.price) >= 0;

  const totalMenit =
    Number(form.duration_minutes || 0) + Number(form.buffer_minutes || 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Ubah layanan' : 'Layanan baru'}
      footer={
        <Button
          size="lg"
          className="w-full"
          disabled={!isValid}
          loading={pending}
          onClick={submit}
        >
          Simpan
        </Button>
      }
    >
      <div className="space-y-4">
        <FormField label="Nama layanan" htmlFor="service-name">
          <Input
            id="service-name"
            autoFocus
            placeholder="Refleksi Kaki 60 Menit"
            value={form.name}
            onChange={(e) => update('name')(e.target.value)}
          />
        </FormField>

        <FormField label="Deskripsi service" htmlFor="service-description">
          <Textarea
            id="service-description"
            rows={2}
            maxLength={225}
            placeholder="Deskripsi service"
            value={form.description}
            onChange={(e) => update('description')(e.target.value)}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Durasi (menit)" htmlFor="service-duration">
            <Input
              id="service-duration"
              type="number"
              inputMode="numeric"
              min="15"
              step="15"
              value={form.duration_minutes}
              onChange={(e) => update('duration_minutes')(e.target.value)}
            />
          </FormField>

          <FormField
            label="Buffer (menit)"
            htmlFor="service-buffer"
          >
            <Input
              id="service-buffer"
              type="number"
              inputMode="numeric"
              min="0"
              step="5"
              value={form.buffer_minutes}
              onChange={(e) => update('buffer_minutes')(e.target.value)}
            />
          </FormField>
        </div>

        <p className="-mt-1 text-sm text-ink/50">
          Slot terpakai {totalMenit} menit. Buffer adalah jeda ganti handuk dan
          rapikan ruangan setelah sesi.
        </p>

        <FormField label="Harga" htmlFor="service-price">
          <Input
            id="service-price"
            inputMode="numeric"
            placeholder="100.000"
            value={formatNumberInput(form.price)}
            onChange={(e) => update('price')(String(parseNumberInput(e.target.value)))}
          />
        </FormField>

        {isEdit && (
          <p className="rounded-lg bg-pine/6 px-3 py-2 text-sm text-ink/65">
            Mengubah harga aman. Booking yang sudah dibuat tetap memakai harga
            saat dipesan.
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
        )}
      </div>
    </Modal>
  );
}