"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

export const inputCls =
  "w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold gradient-text">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-[0.7rem] text-muted">{hint}</span>}
    </label>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-start sm:place-items-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`w-full ${wide ? "max-w-3xl" : "max-w-xl"} glass-strong rounded-2xl my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Закрыть">
            <X className="h-5 w-5 text-muted hover:text-foreground" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-60";
  const variants = {
    primary:
      "text-white bg-gradient-to-r from-primary to-secondary btn-glow",
    ghost: "glass card-hover",
    danger: "text-red-400 bg-red-500/10 hover:bg-red-500/20",
  };
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PUBLISHED: "text-emerald-400 bg-emerald-500/10",
    DRAFT: "text-amber-400 bg-amber-500/10",
    HIDDEN: "text-zinc-400 bg-zinc-500/10",
    NEW: "text-cyan-400 bg-cyan-500/10",
    IN_PROGRESS: "text-blue-400 bg-blue-500/10",
    CONTACTED: "text-violet-400 bg-violet-500/10",
    DONE: "text-emerald-400 bg-emerald-500/10",
    REJECTED: "text-red-400 bg-red-500/10",
  };
  const labels: Record<string, string> = {
    PUBLISHED: "Опубликован",
    DRAFT: "Черновик",
    HIDDEN: "Скрыт",
    NEW: "Новая",
    IN_PROGRESS: "В работе",
    CONTACTED: "Связались",
    DONE: "Готово",
    REJECTED: "Отклонено",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-[0.7rem] ${map[status] || "bg-white/5 text-muted"}`}>
      {labels[status] || status}
    </span>
  );
}
