import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Eye, Calendar, Globe } from "lucide-react";
import { getUploadedSites } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CATEGORY_LABELS, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Готовые сайты",
  description:
    "Готовые сайты и проекты, созданные студией NAVIX. Откройте живое демо каждого проекта.",
};

export default async function SitesPage() {
  const sites = await getUploadedSites();

  return (
    <div className="pt-32 pb-12">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="ГОТОВЫЕ САЙТЫ"
          title="Готовые сайты NAVIX"
          subtitle="Полностью готовые сайты и проекты, созданные нашей студией. Откройте живое демо."
        />

        {sites.length === 0 ? (
          <div className="glass rounded-2xl py-20 text-center text-muted">
            <Globe className="mx-auto h-10 w-10 mb-3 text-primary/60" />
            Готовые сайты скоро появятся.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((s, i) => {
              const demo = s.demoUrl || `${s.uploadedSite?.storagePath}/${s.uploadedSite?.entryFile}`;
              return (
                <Reveal key={s.id} delay={i * 0.06}>
                  <div className="group glass rounded-2xl overflow-hidden card-hover h-full flex flex-col">
                    <div className="relative aspect-[16/10] bg-background-soft">
                      {s.coverImage ? (
                        <Image
                          src={s.coverImage}
                          alt={s.title}
                          fill
                          sizes="(max-width:768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/10 to-secondary/10">
                          <Globe className="h-10 w-10 text-primary/60" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 rounded-full glass-strong px-3 py-1 text-[0.65rem] text-primary">
                        {CATEGORY_LABELS[s.category] ?? s.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg">{s.title}</h3>
                      <p className="mt-1.5 text-sm text-muted line-clamp-2 flex-1">
                        {s.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {s.technologies.slice(0, 4).map((t) => (
                          <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[0.65rem] text-muted">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted">
                        <span className="inline-flex items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" /> {s.views}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> {formatDate(s.publishedAt)}
                          </span>
                        </span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/projects/${s.slug}`}
                          className="flex-1 text-center rounded-lg glass px-3 py-2 text-sm card-hover"
                        >
                          Подробнее
                        </Link>
                        <a
                          href={demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary"
                        >
                          Демо <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
