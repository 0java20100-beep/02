import Hero from "@/components/sections/Hero";
import FeaturedDestinations from "@/components/sections/FeaturedDestinations";
import Tours from "@/components/sections/Tours";
import SpecialOffers from "@/components/sections/SpecialOffers";
import Stats from "@/components/sections/Stats";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import About from "@/components/sections/About";
import Payment from "@/components/sections/Payment";
import Contact from "@/components/sections/Contact";
import CTA from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <SpecialOffers />
      <Tours />
      <Stats />
      <Gallery />
      <Testimonials />
      <About />
      <Payment />
      <Contact />
      <CTA />
    </>
  );
}
