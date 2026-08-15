/**
 * Cermin dari App\Enums\BookingStatus di Laravel.
 * Kalau backend menambah status, ubah juga di sini.
 */
export const BOOKING_STATUS = {
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  ONGOING:   'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW:   'no_show',
};

export const STATUS_LABEL = {
  pending:   'Menunggu',
  confirmed: 'Terkonfirmasi',
  ongoing:   'Sedang berjalan',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  no_show:   'Tidak datang',
};

/** Kelas Tailwind per status, dipakai BookingStatusBadge. */
export const STATUS_STYLE = {
  pending:   'bg-line text-ink/70',
  confirmed: 'bg-pine/10 text-pine',
  ongoing:   'bg-moss text-white',
  completed: 'bg-ink/8 text-ink/55',
  cancelled: 'bg-clay/10 text-clay',
  no_show:   'bg-clay text-white',
};

export const ACTIVE_STATUSES = [
  BOOKING_STATUS.PENDING,
  BOOKING_STATUS.CONFIRMED,
  BOOKING_STATUS.ONGOING,
];

export const isActiveStatus = (status) => ACTIVE_STATUSES.includes(status);