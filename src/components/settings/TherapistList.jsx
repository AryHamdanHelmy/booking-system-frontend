import { Badge, Button, Card, Toggle } from '@/components/ui';
import { displayPhone } from '@/utils/formatPhone';

const genderLabel = { male: 'Pria', female: 'Wanita' };

export function TherapistList({ therapists, onEdit, onSchedule, onToggleActive, pendingId }) {
  return (
    <div className="space-y-2">
      {therapists.map((therapist) => (
        <Card
          key={therapist.id}
          className={`p-4 ${therapist.is_active ? '' : 'bg-ink/3'}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-ink">{therapist.name}</p>
                {!therapist.is_active && (
                  <Badge className="bg-ink/8 text-ink/50">Nonaktif</Badge>
                )}
              </div>

              <p className="mt-1 text-sm text-ink/55">
                {genderLabel[therapist.gender] ?? therapist.gender}
                {therapist.phone ? ` · ${displayPhone(therapist.phone)}` : ''}
              </p>
            </div>

            <Toggle
              checked={therapist.is_active}
              disabled={pendingId === therapist.id}
              label={`Aktifkan ${therapist.name}`}
              onChange={(next) => onToggleActive(therapist, next)}
            />
          </div>

          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => onEdit(therapist)}>
              Ubah
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onSchedule(therapist)}>
              Jadwal
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}