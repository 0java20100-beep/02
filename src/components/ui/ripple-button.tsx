"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "gold" | "outline" | "ghost";
}

export function RippleButton({
  children,
  variant = "gold",
  className,
  onClick,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)),
      600,
    );
    onClick?.(e);
  };

  const variants = {
    gold: "btn-gold shadow-glow-sm hover:shadow-glow font-semibold",
    outline:
      "border border-gold/50 text-gold-400 hover:bg-gold/10 hover:border-gold",
    ghost: "text-foreground hover:bg-foreground/5",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden rounded-full px-6 py-3 transition-all duration-300 active:scale-[0.97]",
        variants[variant],
        className,
      )}
      {...props}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-white/40"
          style={{ left: r.x, top: r.y }}
        />
      ))}
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
