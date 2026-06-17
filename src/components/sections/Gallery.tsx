"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { galleryItems } from "@/data/gallery";
import { unsplash } from "@/data/destinations";
import SectionHeading from "@/components/ui/SectionHeading";
import Lightbox from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";

export default function Gallery({ full = false }: { full?: boolean }) {
  const { dict } = useLanguage();
  const [active, setActive] = useState<number | null>(null);
  const items = full ? galleryItems : galleryItems.slice(0, 10);

  return (
    <section id="gallery" className="section bg-background">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={dict.nav.gallery}
          title={dict.sections.galleryTitle}
          subtitle={dict.sections.gallerySubtitle}
        />

        <div className="mt-12 [column-fill:_balance] gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
              className={cn(
                "group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl",
                item.tall ? "aspect-[3/4]" : "aspect-[4/3]",
              )}
            >
              <Image
                src={unsplash(item.photo, 700, 70)}
                alt={item.caption}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur">
                  <Maximize2 className="h-5 w-5" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 text-left text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="font-display text-base font-semibold">{item.caption}</p>
                <p className="text-xs text-white/70">{item.location}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Lightbox
        images={items}
        index={active}
        onClose={() => setActive(null)}
        onIndexChange={setActive}
      />
    </section>
  );
}
