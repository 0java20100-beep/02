"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, User } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { apiGet, apiSend } from "@/lib/admin-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/api/auth/me").then((r) => {
      if (r.success) router.replace("/the-admin-navix/dashboard");
    });
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await apiSend<{ mustChangePassword: boolean }>(
      "/api/auth/login",
      "POST",
      { username, password }
    );
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Ошибка входа");
      return;
    }
    if (res.data?.mustChangePassword) {
      router.replace("/the-admin-navix/change-password");
    } else {
      router.replace("/the-admin-navix/dashboard");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" showTagline />
        </div>
        <form
          onSubmit={onSubmit}
          className="glass-strong rounded-2xl p-8 space-y-4"
        >
          <h1 className="text-xl font-semibold text-center mb-2">
            Панель управления
          </h1>
          <p className="text-center text-xs text-muted mb-4">the-admin-navix</p>

          <div>
            <label className="text-xs text-muted">Логин</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm outline-none focus:border-primary/60"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="password"
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm outline-none focus:border-primary/60"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium text-white bg-gradient-to-r from-primary to-secondary btn-glow disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
