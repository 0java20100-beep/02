"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { destinations, regions, type Region } from "@/data/destinations";
import DestinationCard from "@/components/ui/DestinationCard";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export default function DestinationsExplorer() {
  const { dict } = useLanguage();
  const [region, setRegion] = useState<Region | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      const matchesRegion = region === "all" || d.region === region;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        d.city.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q);
      return matchesRegion && matchesQuery;
    });
  }, [region, query]);

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.hero.searchPlaceholder}
            className="w-full rounded-full border border-ink-900/10 bg-white py-3 pl-11 pr-4 text-sm shadow-soft focus:border-watermelon-400 focus:outline-none focus:ring-2 focus:ring-watermelon-100"
          />
        </div>

        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {(["all", ...regions] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                region === r
                  ? "border-transparent bg-watermelon-gradient text-white shadow-glow"
                  : "border-ink-900/10 bg-white text-ink-800 hover:border-watermelon-300",
              )}
            >
              {r === "all" ? dict.common.all : r}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-ink-800/60">{dict.search.noResults}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((d, i) => (
            <Reveal key={d.id} delay={(i % 4) * 0.06}>
              <DestinationCard destination={d} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
