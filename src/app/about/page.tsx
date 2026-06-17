import type { Metadata } from "next";
import LocalizedPageHeader from "@/components/layout/LocalizedPageHeader";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Watermelon Travel crafts extraordinary, tailor-made journeys to the world's most beautiful places.",
};

export default function AboutPage() {
  return (
    <>
      <LocalizedPageHeader page="about" />
      <About />
      <Stats />
      <Testimonials />
    </>
  );
}
