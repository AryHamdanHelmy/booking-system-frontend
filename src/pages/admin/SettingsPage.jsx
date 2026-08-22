import { useCallback, useEffect, useState } from 'react';
import { IoAddCircle } from "react-icons/io5";
import { errorMessage } from '@/api/client';
import { serviceApi, therapistApi } from '@/api/masterApi';
import { Button, EmptyState, Spinner } from '@/components/ui';
import { ServiceForm } from '@/components/settings/ServiceForm';
import { ServiceList } from '@/components/settings/ServiceList';
import { ShiftEditor } from '@/components/settings/ShiftEditor';
import { TherapistForm } from '@/components/settings/TherapistForm';
import { TherapistList } from '@/components/settings/TherapistList';

const TABS = [
  { key: 'therapists', label: 'Terapis' },
  { key: 'services',   label: 'Layanan' },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('therapists');

  const [therapists, setTherapists] = useState([]);
  const [services, setServices]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [pendingId, setPendingId]   = useState(null);

  // null = tertutup, undefined = tambah baru, objek = ubah
  const [therapistForm, setTherapistForm] = useState(null);
  const [serviceForm, setServiceForm]     = useState(null);
  const [shiftTarget, setShiftTarget]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const [t, s] = await Promise.all([therapistApi.list(), serviceApi.list()]);
      setTherapists(t);
      setServices(s);
      setError('');
    } catch (err) {
      setError(errorMessage(err, 'Gagal memuat data.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleTherapist(therapist, isActive) {
    setPendingId(therapist.id);

    try {
      await therapistApi.update(therapist.id, { is_active: isActive });
      await load();
    } catch (err) {
      setError(errorMessage(err, 'Gagal mengubah status terapis.'));
    } finally {
      setPendingId(null);
    }
  }

  async function toggleService(service, isActive) {
    setPendingId(service.id);

    try {
      await serviceApi.update(service.id, { is_active: isActive });
      await load();
    } catch (err) {
      setError(errorMessage(err, 'Gagal mengubah status layanan.'));
    } finally {
      setPendingId(null);
    }
  }

  const isTherapistTab = tab === 'therapists';

  return (
    <div className="space-y-5 pt-14 md:pt-0">
      <header>
        <h1 className="text-2xl font-extrabold leading-tight text-ink md:text-3xl">
          Pengaturan
        </h1>
        <p className="mt-0.5 text-sm text-ink/50">
          Terapis, layanan, dan jam kerja.
        </p>
      </header>

      <div className="flex gap-1 border-b border-line">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
              tab === item.key
                ? 'border-card text-ink'
                : 'border-transparent text-ink/50 hover:text-ink'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() =>
              isTherapistTab ? setTherapistForm(undefined) : setServiceForm(undefined)
            }
          >
            <IoAddCircle size={19} strokeWidth={2} />
            {isTherapistTab ? 'Tambah terapis' : 'Tambah layanan'}
          </Button>

          {isTherapistTab ? (
            therapists.length === 0 ? (
              <EmptyState
                title="Belum ada terapis"
                description="Tambahkan terapis lalu atur jam kerjanya."
              />
            ) : (
              <TherapistList
                therapists={therapists}
                pendingId={pendingId}
                onEdit={setTherapistForm}
                onSchedule={setShiftTarget}
                onToggleActive={toggleTherapist}
              />
            )
          ) : services.length === 0 ? (
            <EmptyState
              title="Belum ada layanan"
              description="Tambahkan layanan beserta durasi dan harganya."
            />
          ) : (
            <ServiceList
              services={services}
              pendingId={pendingId}
              onEdit={setServiceForm}
              onToggleActive={toggleService}
            />
          )}
        </>
      )}

      <TherapistForm
        isOpen={therapistForm !== null}
        therapist={therapistForm}
        onClose={() => setTherapistForm(null)}
        onSaved={load}
      />

      <ServiceForm
        isOpen={serviceForm !== null}
        service={serviceForm}
        onClose={() => setServiceForm(null)}
        onSaved={load}
      />

      <ShiftEditor
        isOpen={shiftTarget !== null}
        therapist={shiftTarget}
        onClose={() => setShiftTarget(null)}
        onSaved={load}
      />
    </div>
  );
}