"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { apiSend } from "@/lib/admin-client";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    if (newPassword.length < 8) {
      setError("Минимум 8 символов");
      return;
    }
    setLoading(true);
    const res = await apiSend("/api/auth/change-password", "POST", {
      currentPassword,
      newPassword,
    });
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Ошибка");
      return;
    }
    router.replace("/the-admin-navix/dashboard");
  }

  const cls =
    "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-primary/60";

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md glass-strong rounded-2xl p-8 space-y-4">
        <div className="flex justify-center mb-2">
          <div className="grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>
        </div>
        <h1 className="text-xl font-semibold text-center">Смена пароля</h1>
        <p className="text-center text-xs text-muted">
          В целях безопасности задайте новый пароль при первом входе.
        </p>

        <div>
          <label className="text-xs text-muted">Текущий пароль</label>
          <input type="password" className={cls} value={currentPassword} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted">Новый пароль</label>
          <input type="password" className={cls} value={newPassword} onChange={(e) => setNew(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted">Повторите новый пароль</label>
          <input type="password" className={cls} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium text-white bg-gradient-to-r from-primary to-secondary btn-glow disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Сохранить пароль"}
        </button>
      </form>
    </div>
  );
}
