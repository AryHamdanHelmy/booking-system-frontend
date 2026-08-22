import { IoCheckmark } from "react-icons/io5";
import { formatCurrency } from '@/utils/formatCurrency';
import { serviceIcon } from '@/utils/serviceIcon';

export function BookingServicePicker({ services, value, onChange }) {
  return (
    <div className="space-y-2">
      {services.map((service) => {
        const Icon = serviceIcon(service.name);
        const selected = String(service.id) === String(value);

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onChange(String(service.id))}
            aria-pressed={selected}
            className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left
              transition-colors ${
                selected
                  ? 'border-line bg-card'
                  : 'border-line bg-layout hover:border-line'
              }`}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                ${selected ? 'bg-click text-pine' : 'bg-click/35 text-pine'}`}
            >
              <Icon size={20} strokeWidth={1.75} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-start justify-between gap-2">
                <span className="font-bold text-ink">{service.name}</span>
                {selected && (
                  <IoCheckmark size={18} className="mt-0.5 shrink-0 text-pine" />
                )}
              </span>

              {service.description && (
                <span className="mt-0.5 block text-sm leading-snug text-ink/55">
                  {service.description}
                </span>
              )}

              <span className="mt-2 flex flex-wrap items-center gap-2">
                <span className="tnum rounded-full bg-ink/5 px-2.5 py-1 text-xs font-semibold text-ink/70">
                  {service.duration_minutes} menit
                </span>
                <span className="tnum font-bold text-ink">
                  {formatCurrency(service.price)}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}