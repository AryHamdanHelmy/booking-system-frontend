import { Badge, Button, Card, Toggle } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';

export function ServiceList({ services, onEdit, onToggleActive, pendingId }) {
  return (
    <div className="space-y-2">
      {services.map((service) => (
        <Card
          key={service.id}
          className={`p-4 ${service.is_active ? '' : 'bg-ink/3'}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-ink">{service.name}</p>
                {!service.is_active && (
                  <Badge className="bg-ink/8 text-ink/50">Nonaktif</Badge>
                )}
              </div>

              <p className="tnum mt-1 text-label text-ink/80">
                {service.duration_minutes} menit
                <span className="text-ink/45"> + {service.buffer_minutes} buffer</span>
              </p>
              <p className="tnum mt-0.5 text-title text-ink">
                {formatCurrency(service.price)}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-3">
              <Toggle
                checked={service.is_active}
                disabled={pendingId === service.id}
                label={`Aktifkan ${service.name}`}
                onChange={(next) => onToggleActive(service, next)}
              />
              <Button size="sm" variant="secondary" onClick={() => onEdit(service)}>
                Ubah
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}