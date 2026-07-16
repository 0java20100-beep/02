"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DishImageProps {
  src: string;
  alt: string;
  emoji?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export function DishImage({
  src,
  alt,
  emoji = "🍽️",
  fill = true,
  width,
  height,
  sizes,
  className,
  priority,
}: DishImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 text-5xl",
          fill ? "absolute inset-0" : "h-full w-full",
          className,
        )}
        aria-label={alt}
        role="img"
      >
        <span className="drop-shadow-lg">{emoji}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
      className={cn("object-cover", className)}
    />
  );
}
