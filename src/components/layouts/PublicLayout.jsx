import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-lg items-center px-5">
          <span className="text-title text-ink">
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