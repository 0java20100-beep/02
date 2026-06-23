"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import { ProjectCard, ProjectCardData } from "./ProjectCard";
import { FILTERS } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ProjectsExplorer({
  projects,
  limit,
}: {
  projects: ProjectCardData[];
  limit?: number;
}) {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    const f = FILTERS.find((x) => x.id === active);
    let list = projects;
    if (f && f.categories.length > 0) {
      list = projects.filter((p) => f.categories.includes(p.category));
    } else if (active === "design") {
      list = [];
    }
    return limit ? list.slice(0, limit) : list;
  }, [active, projects, limit]);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm transition-all",
              active === f.id
                ? "bg-gradient-to-r from-primary to-secondary text-white btn-glow"
                : "glass text-muted hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl py-16 text-center text-muted">
          <FolderOpen className="mx-auto h-10 w-10 mb-3 text-primary/60" />
          В этой категории пока нет проектов.
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
