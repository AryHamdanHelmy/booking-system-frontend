import { useEffect, useState } from 'react';
import { errorMessage } from '@/api/client';
import { transactionApi } from '@/api/transactionApi';
import { Button, ChoiceGroup, Modal } from '@/components/ui';
import {
  ON_SITE_METHODS,
  PAYMENT_METHOD,
  PAYMENT_METHOD_ICON,
  PAYMENT_METHOD_LABEL,
} from '@/constants/paymentMethod';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTimeRange } from '@/utils/formatTime';

const methodOptions = ON_SITE_METHODS.map((method) => ({
  value: method,
  label: PAYMENT_METHOD_LABEL[method],
  icon: PAYMENT_METHOD_ICON[method],
}));

export function CashierModal({ isOpen, booking, onClose, onPaid }) {
  const [method, setMethod]   = useState(PAYMENT_METHOD.CASH);
  const [error, setError]     = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setMethod(PAYMENT_METHOD.CASH);
    setError('');
  }, [isOpen]);

  async function submit() {
    setPending(true);
    setError('');

    try {
      const transaction = await transactionApi.checkout({
        booking_id: booking.id,
        payment_method: method,
      });

      onPaid(transaction);
      onClose();
    } catch (err) {
      setError(errorMessage(err, 'Gagal menyimpan pembayaran.'));
    } finally {
      setPending(false);
    }
  }

  if (!booking) return null;

  // Harga diambil dari snapshot saat booking dibuat, bukan dari tarif
  // layanan sekarang — supaya kenaikan tarif tidak mengubah tagihan.
  const total = booking.price_snapshot;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pembayaran"
      description="Sesi ditandai selesai setelah pembayaran tersimpan."
      footer={
        <Button size="lg" className="w-full" loading={pending} onClick={submit}>
          Terima {formatCurrency(total)}
        </Button>
      }
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-line bg-card/20 px-4 py-3">
          <p className="text-title text-ink">{booking.customer?.name}</p>
          <p className="mt-0.5 text-label text-ink">{booking.service?.name}</p>
          <p className="tnum mt-0.5 text-label text-pine">
            {formatTimeRange(booking.start_at, booking.end_at)} ·{' '}
            {booking.therapist?.name}
          </p>

          <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
            <span className="text-label text-ink">Total</span>
            <span className="tnum text-heading text-ink">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-label text-ink/80">Metode bayar</p>
          <ChoiceGroup
            options={methodOptions}
            value={method}
            onChange={setMethod}
            columns={3}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-clay/10 px-3 py-2 text-label text-clay">{error}</p>
        )}
      </div>
    </Modal>
  );
}