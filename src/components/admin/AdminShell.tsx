"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Globe,
  Inbox,
  Star,
  Phone,
  Settings,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { apiSend } from "@/lib/admin-client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/the-admin-navix/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/the-admin-navix/projects", label: "Проекты", icon: FolderKanban },
  { href: "/the-admin-navix/sites", label: "Готовые сайты", icon: Globe },
  { href: "/the-admin-navix/orders", label: "Заявки", icon: Inbox },
  { href: "/the-admin-navix/reviews", label: "Отзывы", icon: Star },
  { href: "/the-admin-navix/contacts", label: "Контакты", icon: Phone },
  { href: "/the-admin-navix/media", label: "Медиа", icon: ImageIcon },
  { href: "/the-admin-navix/settings", label: "Настройки", icon: Settings },
];

export function AdminShell({
  children,
  username,
  role,
}: {
  children: React.ReactNode;
  username: string;
  role: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await apiSend("/api/auth/logout", "POST");
    router.replace("/the-admin-navix");
  }

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Logo size="sm" />
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border border-primary/30"
                  : "text-muted hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:text-foreground hover:bg-white/5"
        >
          <ExternalLink className="h-4 w-4" /> Открыть сайт
        </a>
        <div className="px-3 py-2 text-xs text-muted">
          <div className="font-medium text-foreground">{username}</div>
          <div>{role}</div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" /> Выйти
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 glass-strong border-r border-white/10 z-40">
        {Sidebar}
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden sticky top-0 z-40 glass-strong flex items-center justify-between px-4 py-3">
        <Logo size="sm" />
        <button onClick={() => setOpen(true)} aria-label="Меню">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 glass-strong border-r border-white/10">
            <div className="flex justify-end p-3">
              <button onClick={() => setOpen(false)} aria-label="Закрыть">
                <X className="h-6 w-6" />
              </button>
            </div>
            {Sidebar}
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setOpen(false)} />
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
