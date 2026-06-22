import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-4 text-center">
      <div>
        <div className="text-7xl md:text-9xl font-bold gradient-text neon-text">
          404
        </div>
        <p className="mt-4 text-muted">Страница не найдена.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl px-6 py-3 font-medium text-white bg-gradient-to-r from-primary to-secondary btn-glow"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
