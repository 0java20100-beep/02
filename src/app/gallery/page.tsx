import type { Metadata } from "next";
import LocalizedPageHeader from "@/components/layout/LocalizedPageHeader";
import Gallery from "@/components/sections/Gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A gallery of breathtaking moments from journeys around the world.",
};

export default function GalleryPage() {
  return (
    <>
      <LocalizedPageHeader page="gallery" />
      <Gallery full />
    </>
  );
}
