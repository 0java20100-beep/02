import type { Metadata } from "next";
import { ProjectsExplorer } from "@/components/site/ProjectsExplorer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Проекты",
  description:
    "Каталог проектов NAVIX: лендинги, корпоративные сайты, интернет-магазины, веб-приложения и дашборды.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  const cards = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    technologies: p.technologies,
    coverImage: p.coverImage,
    demoUrl: p.demoUrl,
    views: p.views,
    featured: p.featured,
  }));

  return (
    <div className="pt-32 pb-12">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="ПОРТФОЛИО"
          title="Наши проекты"
          subtitle="Реальные проекты, созданные студией NAVIX. Используйте фильтры, смотрите технологии и открывайте демо."
        />
        {cards.length === 0 ? (
          <div className="glass rounded-2xl py-20 text-center text-muted">
            Проекты скоро появятся.
          </div>
        ) : (
          <ProjectsExplorer projects={cards} />
        )}
      </div>
    </div>
  );
}
