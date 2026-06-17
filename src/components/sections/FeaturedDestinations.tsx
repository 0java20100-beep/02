"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { destinations } from "@/data/destinations";
import SectionHeading from "@/components/ui/SectionHeading";
import DestinationCard from "@/components/ui/DestinationCard";
import Reveal from "@/components/ui/Reveal";

export default function FeaturedDestinations() {
  const { dict } = useLanguage();
  const featured = destinations.filter((d) => d.featured || d.popular).slice(0, 8);

  return (
    <section id="destinations" className="section bg-background">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow={dict.nav.destinations}
            title={dict.sections.destinationsTitle}
            subtitle={dict.sections.destinationsSubtitle}
          />
          <Reveal direction="left">
            <Link
              href="/destinations"
              className="btn btn-outline shrink-0"
            >
              {dict.common.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((d, i) => (
            <Reveal key={d.id} delay={(i % 4) * 0.08}>
              <DestinationCard destination={d} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
