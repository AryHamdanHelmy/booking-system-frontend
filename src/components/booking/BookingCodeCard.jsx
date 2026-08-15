import { useState } from 'react';
import { Check, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { OUTLET } from '@/constants/outlet';
import { whatsappLink } from '@/utils/formatPhone';

/**
 * Kode adalah satu-satunya cara pelanggan mengakses bookingnya —
 * tidak ada akun. Karena itu disediakan berlapis: tampil besar,
 * bisa disalin, dan bisa dikirim ke WhatsApp agar tersimpan permanen
 * di riwayat chat kedua pihak.
 */
export function BookingCodeCard({ booking }) {
  const [copied, setCopied] = useState(false);

  const statusUrl = `${window.location.origin}/booking/${booking.booking_code}`;

  const pesan = [
    `Halo, saya sudah booking di ${OUTLET.name}.`,
    ``,
    `Kode: ${booking.booking_code}`,
    `Nama: ${booking.customer_name ?? ''}`,
    `Layanan: ${booking.service?.name ?? ''}`,
    `Waktu: ${new Date(booking.start_at).toLocaleString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })}`,
    ``,
    `Cek status: ${statusUrl}`,
  ].join('\n');

  async function copy() {
    try {
      await navigator.clipboard.writeText(booking.booking_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-xl border border-pine/25 bg-pine/5 px-5 py-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
        Kode booking
      </p>

      <p className="tnum mt-1.5 text-3xl font-extrabold tracking-tight text-pine">
        {booking.booking_code}
      </p>

      <p className="mx-auto mt-2 max-w-xs text-sm text-ink/55">
        Simpan kode ini. Sebutkan saat datang, atau pakai untuk mengecek dan
        membatalkan booking.
      </p>

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={copy}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Tersalin' : 'Salin kode'}
        </Button>

        <a
          href={whatsappLink(OUTLET.whatsapp, pesan)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2
            rounded-lg bg-pine px-4 text-sm font-semibold text-white
            transition-colors hover:bg-ink"
        >
          <MessageCircle size={18} />
          Kirim ke WA
        </a>
      </div>
    </div>
  );
}