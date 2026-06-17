import type { MetadataRoute } from "next";
import { destinations } from "@/data/destinations";

const base = "https://watermelon.travel";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/destinations", "/tours", "/offers", "/gallery", "/about", "/contact", "/booking"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const destinationRoutes = destinations.map((d) => ({
    url: `${base}/destinations/${d.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...destinationRoutes];
}
