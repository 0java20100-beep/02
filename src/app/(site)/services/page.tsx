import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServicesSection } from "@/components/site/ServicesSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Услуги NAVIX: разработка сайтов и приложений, дизайн UI/UX, брендинг, SEO и продвижение.",
};

const STACK = {
  Frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  Backend: ["Node.js", "Express", "Prisma ORM"],
  Database: ["PostgreSQL", "Redis"],
  DevOps: ["Docker", "Docker Compose", "Nginx", "SSL"],
};

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <ServicesSection />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="ТЕХНОЛОГИИ"
            title="Современный стек"
            subtitle="Мы используем передовые технологии для скорости, надёжности и масштабируемости."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(STACK).map(([group, items], i) => (
              <Reveal key={group} delay={i * 0.08}>
                <div className="glass rounded-2xl p-6 h-full">
                  <h3 className="font-semibold mb-3 gradient-text">{group}</h3>
                  <ul className="space-y-2 text-sm text-muted">
                    {items.map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-secondary" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/#order"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white bg-gradient-to-r from-primary to-secondary btn-glow"
            >
              Обсудить проект <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
