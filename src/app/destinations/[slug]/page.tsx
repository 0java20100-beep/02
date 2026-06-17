import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { destinations, getDestination, unsplash } from "@/data/destinations";
import DestinationDetail from "@/components/destinations/DestinationDetail";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const destination = getDestination(params.slug);
  if (!destination) return { title: "Destination not found" };
  return {
    title: `${destination.city}, ${destination.country}`,
    description: destination.tagline,
    openGraph: {
      title: `${destination.city}, ${destination.country} · Watermelon Travel`,
      description: destination.tagline,
      images: [{ url: unsplash(destination.image, 1200, 75) }],
    },
  };
}

export default function DestinationPage({ params }: { params: { slug: string } }) {
  const destination = getDestination(params.slug);
  if (!destination) notFound();
  return <DestinationDetail id={params.slug} />;
}
