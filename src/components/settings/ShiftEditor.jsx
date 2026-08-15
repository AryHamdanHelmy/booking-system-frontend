import { useEffect, useState } from 'react';
import { errorMessage } from '@/api/client';
import { shiftApi } from '@/api/masterApi';
import { Button, Input, Modal, Spinner, Toggle } from '@/components/ui';
import { DEFAULT_CLOSE, DEFAULT_OPEN, WEEKDAYS } from '@/constants/weekdays';

/** Tujuh hari, sesuai urutan WEEKDAYS. */
function buildDefault() {
  return WEEKDAYS.map((day) => ({
    day_of_week: day.value,
    is_day_off: false,
    start_time: DEFAULT_OPEN,
    end_time: DEFAULT_CLOSE,
  }));
}

/** Backend mengirim "09:00:00", input time butuh "09:00". */
const trimSeconds = (time) => (time ? time.substring(0, 5) : DEFAULT_OPEN);

export function ShiftEditor({ isOpen, therapist, onClose, onSaved }) {
  const [shifts, setShifts]   = useState(buildDefault);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!isOpen || !therapist) return;

    let active = true;
    setLoading(true);
    setError('');

    shiftApi
      .list(therapist.id)
      .then((data) => {
        if (!active) return;

        // Isi hari yang belum punya baris dengan nilai bawaan,
        // supaya tujuh hari selalu lengkap saat disimpan.
        const merged = WEEKDAYS.map((day) => {
          const found = data.find((s) => s.day_of_week === day.value);

          return found
            ? {
                day_of_week: day.value,
                is_day_off: Boolean(found.is_day_off),
                start_time: trimSeconds(found.start_time),
                end_time: found.end_time ? trimSeconds(found.end_time) : DEFAULT_CLOSE,
              }
            : {
                day_of_week: day.value,
                is_day_off: false,
                start_time: DEFAULT_OPEN,
                end_time: DEFAULT_CLOSE,
              };
        });

        setShifts(merged);
      })
      .catch(() => active && setShifts(buildDefault()))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [isOpen, therapist]);

  function updateDay(dayValue, patch) {
    setShifts((prev) =>
      prev.map((s) => (s.day_of_week === dayValue ? { ...s, ...patch } : s)),
    );
  }

  /** Menerapkan jam hari pertama yang bekerja ke semua hari lain. */
  function applyToAll() {
    const source = shifts.find((s) => !s.is_day_off);
    if (!source) return;

    setShifts((prev) =>
      prev.map((s) =>
        s.is_day_off
          ? s
          : { ...s, start_time: source.start_time, end_time: source.end_time },
      ),
    );
  }

  async function submit() {
    setPending(true);
    setError('');

    try {
      await shiftApi.update(therapist.id, shifts);
      onSaved?.();
      onClose();
    } catch (err) {
      setError(errorMessage(err, 'Gagal menyimpan jadwal.'));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Jadwal ${therapist?.name ?? ''}`}
      description="Jam kerja mingguan yang berulang."
      footer={
        <Button size="lg" className="w-full" loading={pending} onClick={submit}>
          Simpan jadwal
        </Button>
      }
    >
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={applyToAll}
            className="text-sm font-semibold text-pine underline"
          >
            Samakan jam semua hari
          </button>

          {shifts.map((shift) => {
            const day = WEEKDAYS.find((d) => d.value === shift.day_of_week);

            return (
              <div
                key={shift.day_of_week}
                className="rounded-lg border border-line px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-ink">{day.label}</span>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-ink/50">
                      {shift.is_day_off ? 'Libur' : 'Kerja'}
                    </span>
                    <Toggle
                      checked={!shift.is_day_off}
                      label={`${day.label} bekerja`}
                      onChange={(bekerja) =>
                        updateDay(shift.day_of_week, { is_day_off: !bekerja })
                      }
                    />
                  </div>
                </div>

                {!shift.is_day_off && (
                  <div className="mt-2.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <Input
                      type="time"
                      aria-label={`Jam buka ${day.label}`}
                      value={shift.start_time}
                      onChange={(e) =>
                        updateDay(shift.day_of_week, { start_time: e.target.value })
                      }
                      className="h-10 min-w-0"
                    />
                    <span className="text-sm text-ink/40">s/d</span>
                    <Input
                      type="time"
                      aria-label={`Jam tutup ${day.label}`}
                      value={shift.end_time}
                      onChange={(e) =>
                        updateDay(shift.day_of_week, { end_time: e.target.value })
                      }
                      className="h-10 min-w-0"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {error && (
            <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
          )}
        </div>
      )}
    </Modal>
  );
}