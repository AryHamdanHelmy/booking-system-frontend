import { Button, Modal } from '@/components/ui';
import { formatTime } from '@/utils/formatTime';

/**
 * Muncul saat backend membalas 409.
 *
 * Ini peringatan, bukan penolakan — admin yang memutuskan. Karena itu
 * tombol lanjut tetap tersedia, tapi diberi warna amber agar terasa
 * sebagai keputusan sadar, bukan langkah biasa.
 */
export function WalkinConflictDialog({ isOpen, conflicts, onCancel, onConfirm, pending }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Jadwal bentrok"
      description="Terapis ini sudah punya sesi di jam tersebut."
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Batal
          </Button>
          <Button
            variant="warning"
            className="flex-1"
            loading={pending}
            onClick={onConfirm}
          >
            Tetap lanjut
          </Button>
        </div>
      }
    >
      <ul className="space-y-2">
        {conflicts.map((conflict) => (
          <li
            key={conflict.id}
            className="rounded-lg border border-amber/40 bg-amber/8 px-3 py-2.5"
          >
            <p className="tnum font-bold text-ink">
              {conflict.time_label ??
                `${formatTime(conflict.start_at)} – ${formatTime(conflict.end_at)}`}
            </p>
            <p className="mt-0.5 text-sm text-ink/70">
              {conflict.customer_name}
              {conflict.service_name ? ` · ${conflict.service_name}` : ''}
            </p>
            <p className="mt-0.5 text-xs text-ink/45">{conflict.booking_code}</p>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm text-ink/60">
        Kalau dilanjutkan, sesi ini tetap tersimpan dan ditandai bentrok di papan
        status. Anda perlu mengatur ulang salah satunya nanti.
      </p>
    </Modal>
  );
}