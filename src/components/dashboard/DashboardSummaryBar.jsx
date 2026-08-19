import { Card } from '@/components/ui';
import { formatDateLong } from '@/utils/formatTime';

/**
 * Di HP tampil sebagai angka polos agar tidak memakan layar
 * sebelum sesi pertama terlihat. Di layar lebar jadi kartu berbingkai.
 */
export function DashboardSummaryBar({ date, summary }) {
  const items = [
    { label: 'Sesi',     value: summary?.total ?? 0 },
    { label: 'Berjalan', value: summary?.ongoing ?? 0 },
    { label: 'Selesai',  value: summary?.completed ?? 0 },
  ];

  const conflicts = summary?.conflicts ?? 0;

  return (
    <section>
      <h1 className="text-heading font-extrabold leading-tight text-ink lg:text-3xl">
        Hari ini
      </h1>
      <p className="mt-0.5 text-label text-ink/50">{formatDateLong(date)}</p>

      <div className="mt-4 grid grid-cols-4 gap-2 md:gap-4">
        {items.map((item) => (
          <Card
            key={item.label}
            className="border-transparent  bg-transparent p-0 lg:border-line lg:bg-white lg:p-3"
          >
            <p className="tnum my-2 mx-2 text-heading leading-none text-ink lg:text-3xl">
              {item.value}
            </p>
            <p className="my-2 mx-2 text-label uppercase text-ink/55 lg:mt-2 lg:text-xs">
              {item.label}
            </p>
          </Card>
        ))}

        <Card
          className={`border-transparent bg-transparent p-0 lg:p-4 ${
            conflicts > 0 ? 'lg:border-amber lg:bg-amber/8' : 'lg:border-line lg:bg-white'
          }`}
        >
          <p
            className={`tnum my-2 mx-2 text-heading leading-none lg:text-3xl ${
              conflicts > 0 ? 'text-amber' : 'text-ink/30'
            }`}
          >
            {conflicts}
          </p>
          <p
            className={`my-2 mx-2 text-label uppercase lg:mt-2 lg:text-xs ${
              conflicts > 0 ? 'text-amber' : 'text-ink/35'
            }`}
          >
            Bentrok
          </p>
        </Card>
      </div>
    </section>
  );
}