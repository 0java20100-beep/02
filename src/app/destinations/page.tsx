import type { Metadata } from "next";
import LocalizedPageHeader from "@/components/layout/LocalizedPageHeader";
import DestinationsExplorer from "@/components/sections/DestinationsExplorer";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore 24+ premium travel destinations across the Middle East, Europe, Asia, Africa and the Caucasus with Watermelon Travel.",
};

export default function DestinationsPage() {
  return (
    <>
      <LocalizedPageHeader page="destinations" />
      <section className="section bg-background">
        <div className="container-px mx-auto max-w-7xl">
          <DestinationsExplorer />
        </div>
      </section>
    </>
  );
}
