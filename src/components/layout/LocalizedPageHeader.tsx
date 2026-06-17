"use client";

import { useLanguage } from "@/context/LanguageContext";
import PageHeader from "./PageHeader";

type PageKey = "destinations" | "tours" | "offers" | "gallery" | "about" | "contact" | "booking";

const images: Record<PageKey, string> = {
  destinations: "photo-1552832230-c0197dd311b5",
  tours: "photo-1530122037265-a5f1f91d3b99",
  offers: "photo-1514282401047-d79a71a590e8",
  gallery: "photo-1493976040374-85c8e12f0c0e",
  about: "photo-1502602898657-3e91760cbb34",
  contact: "photo-1543783207-ec64e4d95325",
  booking: "photo-1537996194471-e657df975ab4",
};

export default function LocalizedPageHeader({ page }: { page: PageKey }) {
  const { dict } = useLanguage();

  const map: Record<PageKey, { title: string; subtitle?: string }> = {
    destinations: {
      title: dict.nav.destinations,
      subtitle: dict.sections.destinationsSubtitle,
    },
    tours: { title: dict.sections.toursTitle, subtitle: dict.sections.toursSubtitle },
    offers: { title: dict.sections.offersTitle, subtitle: dict.sections.offersSubtitle },
    gallery: { title: dict.sections.galleryTitle, subtitle: dict.sections.gallerySubtitle },
    about: { title: dict.sections.aboutTitle, subtitle: dict.sections.aboutSubtitle },
    contact: { title: dict.sections.contactTitle, subtitle: dict.sections.contactSubtitle },
    booking: { title: dict.booking.title, subtitle: dict.sections.contactSubtitle },
  };

  return (
    <PageHeader
      title={map[page].title}
      subtitle={map[page].subtitle}
      image={images[page]}
      crumbs={[{ label: map[page].title }]}
    />
  );
}
