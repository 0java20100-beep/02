"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, X, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLogin({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { dict } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (username === "admin" && password === "watermelon") {
      onSuccess();
    } else {
      setError(true);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-card"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-800 hover:bg-ink-100"
          aria-label={dict.common.close}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-gradient-to-br from-ink-900 to-ink-950 px-8 pb-10 pt-9 text-center text-white">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-watermelon-gradient shadow-glow">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold">{dict.admin.login}</h2>
          <p className="mt-1 text-sm text-white/60">Watermelon Travel · Control Center</p>
        </div>

        <form onSubmit={submit} className="px-8 py-7">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-800">
              {dict.admin.username}
            </span>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40" />
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }}
                className="wm-input pl-10"
                placeholder="admin"
                autoFocus
              />
            </div>
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium text-ink-800">
              {dict.admin.password}
            </span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40" />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="wm-input px-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-800/40 hover:text-ink-800"
                aria-label={showPw ? "Hide" : "Show"}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && (
            <p className="mt-3 rounded-lg bg-watermelon-50 px-3 py-2 text-sm text-watermelon-600">
              {dict.admin.wrongCredentials}
            </p>
          )}

          <button type="submit" className="btn btn-primary mt-6 w-full justify-center">
            {dict.admin.signIn}
          </button>

          <p className="mt-4 text-center text-xs text-ink-800/50">{dict.admin.hint}</p>
        </form>
      </motion.div>
    </motion.div>
  );
}
