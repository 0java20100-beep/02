import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { ProjectsExplorer } from "@/components/site/ProjectsExplorer";
import { ServicesSection } from "@/components/site/ServicesSection";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { OrderForm } from "@/components/site/OrderForm";
import { ContactsSection } from "@/components/site/ContactsSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getPublishedProjects,
  getPublishedReviews,
  getVisibleContacts,
} from "@/lib/data";
import { getAllSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, reviews, contacts, { site, hero }] = await Promise.all([
    getPublishedProjects(),
    getPublishedReviews(),
    getVisibleContacts(),
    getAllSettings(),
  ]);

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
    <>
      <Hero hero={hero} site={site} />

      <section id="projects" className="relative py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="ПРОЕКТЫ"
            title="Наши проекты"
            subtitle="Каталог проектов, созданных студией NAVIX. Фильтруйте по категориям и открывайте демо."
          />
          {cards.length === 0 ? (
            <div className="glass rounded-2xl py-16 text-center text-muted">
              Проекты скоро появятся. Загляните позже.
            </div>
          ) : (
            <>
              <ProjectsExplorer projects={cards} limit={6} />
              <div className="mt-10 text-center">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3 card-hover"
                >
                  Все проекты <ArrowRight className="h-4 w-4 text-primary" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <ServicesSection />

      <ReviewsSection
        reviews={reviews.map((r) => ({
          id: r.id,
          name: r.name,
          company: r.company,
          avatar: r.avatar,
          rating: r.rating,
          text: r.text,
        }))}
      />

      <OrderForm />

      <ContactsSection contacts={contacts} />
    </>
  );
}
