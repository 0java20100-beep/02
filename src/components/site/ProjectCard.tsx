"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, ExternalLink } from "lucide-react";
import { CATEGORY_LABELS, normalizeUrl } from "@/lib/utils";

export interface ProjectCardData {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  coverImage: string | null;
  demoUrl: string | null;
  views: number;
  featured: boolean;
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative glass rounded-2xl overflow-hidden card-hover"
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-background-soft">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <span className="text-3xl font-bold gradient-text">
                {project.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="absolute top-3 left-3 rounded-full glass-strong px-3 py-1 text-[0.65rem] tracking-wide text-primary">
            {CATEGORY_LABELS[project.category] ?? project.category}
          </span>
          {project.featured && (
            <span className="absolute top-3 right-3 rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1 text-[0.65rem] font-medium text-white">
              ★ Топ
            </span>
          )}
          <span className="absolute bottom-3 right-3 grid place-items-center h-9 w-9 rounded-full bg-gradient-to-r from-primary to-secondary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </span>
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/projects/${project.slug}`}>
          <h3 className="font-semibold text-lg group-hover:gradient-text transition-all">
            {project.title}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-muted line-clamp-2">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md bg-white/5 px-2 py-0.5 text-[0.65rem] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {project.views}
          </span>
          {project.demoUrl && (
            <a
              href={normalizeUrl(project.demoUrl) || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Демо <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
