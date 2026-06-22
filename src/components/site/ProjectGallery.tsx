"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

export function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(src)}
            className="relative aspect-video overflow-hidden rounded-2xl glass card-hover group"
          >
            <Image
              src={src}
              alt={`${title} — скриншот ${i + 1}`}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute top-5 right-5 grid place-items-center h-11 w-11 rounded-full glass-strong"
            onClick={() => setActive(null)}
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative w-full max-w-5xl aspect-video">
            <Image
              src={active}
              alt={title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
