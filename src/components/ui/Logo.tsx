import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  brand?: string;
  tagline?: string;
  logoUrl?: string;
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { mark: 28, text: "text-xl" },
  md: { mark: 36, text: "text-2xl" },
  lg: { mark: 64, text: "text-5xl md:text-7xl" },
};

export function Logo({
  brand = "NAVIX",
  tagline = "WE BUILD THE FUTURE",
  logoUrl,
  className,
  showTagline = false,
  size = "md",
}: LogoProps) {
  const s = SIZES[size];
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={brand}
        width={size === "lg" ? 240 : 140}
        height={size === "lg" ? 80 : 48}
        className={cn("object-contain", className)}
        priority
      />
    );
  }
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center gap-2">
        <LogoMark size={s.mark} />
        <span
          className={cn(
            "font-bold tracking-[0.18em] gradient-text neon-text",
            s.text
          )}
        >
          {brand}
        </span>
      </div>
      {showTagline && (
        <span className="mt-2 text-[0.6rem] md:text-xs tracking-[0.5em] text-muted">
          {tagline}
        </span>
      )}
    </div>
  );
}

function LogoMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="navix-grad" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path
        d="M10 54 V10 L40 44 V10 M40 10 L54 10 M10 54 L40 54"
        stroke="url(#navix-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M54 10 V54"
        stroke="url(#navix-grad)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
