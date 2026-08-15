import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-lg items-center px-5">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-moss">
            Refleksi
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 py-6">
        <Outlet />
      </main>
    </div>
  );
}