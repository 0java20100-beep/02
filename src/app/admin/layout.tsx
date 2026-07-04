"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  Ticket,
  Settings as SettingsIcon,
  QrCode,
  ClipboardList,
  LogOut,
  Lock,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_PASSWORD = "Sharqona-2025";
const AUTH_KEY = "sharqona-admin-auth";

const nav = [
  { href: "/admin", label: "Boshqaruv", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Zakazlar", icon: ClipboardList },
  { href: "/admin/menu", label: "Menu / Taomlar", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Kategoriyalar", icon: Tags },
  { href: "/admin/promos", label: "Promo kodlar", icon: Ticket },
  { href: "/admin/tables", label: "Stollar / QR", icon: QrCode },
  { href: "/admin/settings", label: "Sozlamalar", icon: SettingsIcon },
];

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(AUTH_KEY, "1");
      onSuccess();
    } else {
      setError("Parol noto'g'ri");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-700 px-4">
      <div className="absolute inset-0 bg-ornament [background-size:24px_24px] opacity-30" />
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-3xl glass-strong p-8 text-emerald-50 shadow-card"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full btn-gold">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="text-center font-display text-2xl font-bold">
          Sharqona Admin
        </h1>
        <p className="mt-2 text-center text-sm text-emerald-100/70">
          Davom etish uchun parolni kiriting
        </p>
        <input
          type="password"
          value={password}
          autoFocus
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          placeholder="Parol"
          className="mt-6 w-full rounded-full border border-gold/30 bg-emerald-600/40 px-5 py-3 text-sm text-white placeholder:text-emerald-100/50 focus:border-gold focus:outline-none"
        />
        {error && (
          <p className="mt-2 text-center text-sm text-red-300">{error}</p>
        )}
        <button
          type="submit"
          className="mt-5 w-full rounded-full btn-gold py-3 font-semibold"
        >
          Kirish
        </button>
      </motion.form>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setAuthed(window.sessionStorage.getItem(AUTH_KEY) === "1");
    setReady(true);
  }, []);

  const logout = () => {
    window.sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    router.push("/admin");
  };

  if (!ready) return null;
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      <aside className="sticky top-0 z-30 flex items-center gap-2 overflow-x-auto border-b border-border bg-emerald-700 px-3 py-3 text-emerald-50 no-scrollbar md:h-screen md:w-64 md:flex-col md:items-stretch md:gap-1 md:overflow-y-auto md:border-b-0 md:border-r md:px-4 md:py-6">
        <Link
          href="/admin"
          className="mb-0 flex shrink-0 items-center gap-2 px-2 md:mb-6"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full btn-gold font-display font-bold">
            S
          </span>
          <span className="hidden font-display text-lg font-bold md:block">
            Sharqona
          </span>
        </Link>

        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors md:rounded-xl",
                active
                  ? "btn-gold"
                  : "text-emerald-100/80 hover:bg-emerald-600/50",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}

        <div className="hidden md:mt-auto md:block md:space-y-1 md:pt-6">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-emerald-100/80 transition-colors hover:bg-emerald-600/50"
          >
            <ExternalLink className="h-4 w-4" /> Saytni ko&apos;rish
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" /> Chiqish
          </button>
        </div>

        <button
          onClick={logout}
          aria-label="Chiqish"
          className="ml-auto flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-500/20 md:hidden"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </aside>

      <main className="flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
