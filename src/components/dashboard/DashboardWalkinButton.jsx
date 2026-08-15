import { Button } from '@/components/ui';
import { UserPlus } from 'lucide-react';

/**
 * Di HP: tombol bundar melayang di atas tab bawah, tetap satu ketukan
 * tanpa menutupi navigasi.
 * Di desktop: tombol lebar di kolom kanan.
 */
export function DashboardWalkinButton({ onClick }) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label="Mulai walk-in"
        className="fixed bottom-20 right-4 z-20 flex h-14 w-14 items-center justify-center
          rounded-full bg-pine/80 text-white backdrop-blur-xs shadow-lg shadow-ink/20
          transition-colors hover:bg-ink lg:hidden"
      >
        <UserPlus size={24} strokeWidth={1.75} />
      </button>

      <div className="hidden rounded-xl border border-line bg-pine/5 p-5 text-center lg:block">
        <p className="font-semibold text-ink">Ada tamu datang langsung?</p>
        <p className="mt-1 text-sm text-ink/55">
          Catat sesinya tanpa perlu booking dulu.
        </p>
        <Button size="lg" className="mt-4 w-full" onClick={onClick}>
          Mulai walk-in
        </Button>
      </div>
    </>
  );
}