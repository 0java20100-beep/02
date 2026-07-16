"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Ornament-only mark (transparent gold). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt="Sharqona"
      width={438}
      height={545}
      priority
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}

/** Full stacked logo — ornament + SHARQONA RESTAURANT (transparent gold). */
export function LogoFull({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-full.png"
      alt="Sharqona Restaurant"
      width={1006}
      height={928}
      priority
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
