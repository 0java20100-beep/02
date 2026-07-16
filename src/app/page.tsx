import { Hero } from "@/components/home/hero";
import { FeaturedSlider } from "@/components/home/featured-slider";
import { About } from "@/components/home/about";
import { PopularDishes } from "@/components/home/popular-dishes";
import { ChefPick } from "@/components/home/chef-pick";
import { Testimonials } from "@/components/home/testimonials";
import { CTA } from "@/components/home/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedSlider />
      <About />
      <PopularDishes />
      <ChefPick />
      <Testimonials />
      <CTA />
    </>
  );
}
