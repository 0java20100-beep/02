import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye, ExternalLink, Send } from "lucide-react";
import { getProjectBySlug } from "@/lib/data";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { ViewTracker } from "@/components/site/ViewTracker";
import { CATEGORY_LABELS, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Проект не найден" };
  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.description,
    keywords: project.seoKeywords || undefined,
    openGraph: {
      title: project.seoTitle || project.title,
      description: project.seoDescription || project.description,
      images: project.ogImage
        ? [project.ogImage]
        : project.coverImage
        ? [project.coverImage]
        : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <article className="pt-28 pb-12">
      <ViewTracker projectId={project.id} />
      <div className="mx-auto max-w-5xl px-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Все проекты
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="rounded-full glass px-3 py-1 text-xs text-primary">
            {CATEGORY_LABELS[project.category] ?? project.category}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Calendar className="h-3.5 w-3.5" /> {formatDate(project.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Eye className="h-3.5 w-3.5" /> {project.views} просмотров
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold gradient-text">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl">{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary btn-glow"
            >
              Открыть демо <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <Link
            href={`/#order`}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium glass card-hover"
          >
            <Send className="h-4 w-4 text-primary" /> Заказать похожий проект
          </Link>
        </div>

        {project.coverImage && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl glass">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        {project.technologies.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">
              Технологии
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-lg glass px-3 py-1.5 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.content && (
          <div className="mt-10 prose-invert max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {project.content}
          </div>
        )}

        {project.screenshots.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm uppercase tracking-widest text-muted mb-4">
              Скриншоты
            </h2>
            <ProjectGallery images={project.screenshots} title={project.title} />
          </div>
        )}
      </div>
    </article>
  );
}
