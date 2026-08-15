import { useEffect, useState } from 'react';
import { errorMessage } from '@/api/client';
import { therapistApi } from '@/api/masterApi';
import { Button, ChoiceGroup, FormField, Input, Modal } from '@/components/ui';

const EMPTY = { name: '', gender: 'male', phone: '' };

const genderOptions = [
  { value: 'male', label: 'Pria' },
  { value: 'female', label: 'Wanita' },
];

export function TherapistForm({ isOpen, therapist, onClose, onSaved }) {
  const [form, setForm]       = useState(EMPTY);
  const [error, setError]     = useState('');
  const [pending, setPending] = useState(false);

  const isEdit = Boolean(therapist);

  useEffect(() => {
    if (!isOpen) return;

    setForm(
      therapist
        ? {
            name: therapist.name,
            gender: therapist.gender,
            phone: therapist.phone ?? '',
          }
        : EMPTY,
    );
    setError('');
  }, [isOpen, therapist]);

  const update = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function submit() {
    setPending(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      gender: form.gender,
      phone: form.phone.trim() || null,
    };

    try {
      const saved = isEdit
        ? await therapistApi.update(therapist.id, payload)
        : await therapistApi.create({ ...payload, is_active: true });

      onSaved(saved);
      onClose();
    } catch (err) {
      setError(errorMessage(err, 'Gagal menyimpan terapis.'));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Ubah terapis' : 'Terapis baru'}
      footer={
        <Button
          size="lg"
          className="w-full"
          disabled={!form.name.trim()}
          loading={pending}
          onClick={submit}
        >
          Simpan
        </Button>
      }
    >
      <div className="space-y-4">
        <FormField label="Nama" htmlFor="therapist-name">
          <Input
            id="therapist-name"
            autoFocus
            placeholder="Nama terapis"
            value={form.name}
            onChange={(e) => update('name')(e.target.value)}
          />
        </FormField>

        <FormField
          label="Jenis kelamin"
          hint="Dipakai saat pelanggan memilih preferensi terapis."
        >
          <ChoiceGroup
            options={genderOptions}
            value={form.gender}
            onChange={update('gender')}
          />
        </FormField>

        <FormField label="Nomor HP" htmlFor="therapist-phone">
          <Input
            id="therapist-phone"
            type="tel"
            inputMode="numeric"
            placeholder="0812... (opsional)"
            value={form.phone}
            onChange={(e) => update('phone')(e.target.value)}
          />
        </FormField>

        {!isEdit && (
          <p className="rounded-lg bg-pine/6 px-3 py-2 text-sm text-ink/65">
            Setelah tersimpan, atur jadwal kerjanya lewat tombol Jadwal.
            Tanpa jadwal, terapis tidak akan muncul di pilihan booking.
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
        )}
      </div>
    </Modal>
  );
}