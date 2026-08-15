import { useState } from 'react';
import { errorMessage } from '@/api/client';
import { bookingApi } from '@/api/bookingApi';
import { EmptyState, Spinner } from '@/components/ui';
import { DashboardSessionCard } from '@/components/dashboard/DashboardSessionCard';
import { DashboardSummaryBar } from '@/components/dashboard/DashboardSummaryBar';
import { DashboardTherapistStatus } from '@/components/dashboard/DashboardTherapistStatus';
import { DashboardWalkinButton } from '@/components/dashboard/DashboardWalkinButton';
import { isActiveStatus } from '@/constants/bookingStatus';
import { useTodayBoard } from '@/hooks/useTodayBoard';
import { useDisclosure } from '../../hooks/useDisclosure';
import { WalkinModal } from '../../components/walkin/WalkinModal';
import { CashierModal } from '../../components/cashier/CashierModal';

export default function DashboardPage() {
  const { data, loading, error, reload } = useTodayBoard();
  const [pendingId, setPendingId]     = useState(null);
  const [actionError, setActionError] = useState('');
  const walkin = useDisclosure();
  const [checkoutBooking, setCheckoutBooking] = useState(null);

  async function runAction(booking, fn) {
    setPendingId(booking.id);
    setActionError('');

    try {
      await fn();
      await reload({ silent: true });
    } catch (err) {
      setActionError(errorMessage(err, 'Gagal memperbarui sesi.'));
    } finally {
      setPendingId(null);
    }
  }

  const handleChangeStatus = (booking, status) =>
    runAction(booking, () => bookingApi.updateStatus(booking.id, status));

  const handleNoShow = (booking) =>
    runAction(booking, () => bookingApi.markNoShow(booking.id));

  const handleCheckout = (booking) => {setCheckoutBooking(booking)};

  if (loading && !data) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  if (error && !data) {
    return <EmptyState title="Gagal memuat" description={error} />;
  }

  const bookings = data?.bookings ?? [];
  const aktif    = bookings.filter((b) => isActiveStatus(b.status));
  const selesai  = bookings.filter((b) => !isActiveStatus(b.status));

  const cardProps = {
    onChangeStatus: handleChangeStatus,
    onCheckout: handleCheckout,
    onNoShow: handleNoShow,
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      <DashboardSummaryBar date={data?.date} summary={data?.summary} />

      {actionError && (
        <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">
          {actionError}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-6">
        {/* Kolom utama: status terapis + sesi aktif */}
        <div className="space-y-5">
          <DashboardTherapistStatus
            therapists={data?.therapists ?? []}
            bookings={bookings}
          />

          {aktif.length === 0 ? (
            <EmptyState
              title="Tidak ada sesi berjalan"
              description="Tamu yang datang langsung bisa dicatat lewat tombol walk-in."
            />
          ) : (
            <div className="space-y-2">
              {aktif.map((booking) => (
                <DashboardSessionCard
                  key={booking.id}
                  booking={booking}
                  pending={pendingId === booking.id}
                  {...cardProps}
                />
              ))}
            </div>
          )}
        </div>

        {/* Kolom kanan di desktop, menumpuk di bawah pada HP */}
        <div className="space-y-15">
          <DashboardWalkinButton onClick={walkin.open} />

          {selesai.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wide text-ink/40">
                Sudah selesai
              </h2>
              <div className="mt-2 space-y-2">
                {selesai.map((booking) => (
                  <div key={booking.id} className="opacity-70">
                    <DashboardSessionCard
                      booking={booking}
                      pending={false}
                      {...cardProps}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <CashierModal
        isOpen={checkoutBooking !== null}
        booking={checkoutBooking}
        onClose={()=> setCheckoutBooking(null)}
        onPaid={()=> reload({ silent: true })}
      />

      <WalkinModal
        isOpen={walkin.isOpen}
        onClose={walkin.close}
        therapists={data?.therapists ?? []}
        bookings={bookings}
        onCreated={() => reload({ silent:true})}
      />
    </div>
    
  );
}