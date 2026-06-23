"use client";

import { useEffect, useRef } from "react";

export function ViewTracker({ projectId }: { projectId: string }) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    fetch(`/api/projects/${projectId}/view`, { method: "POST" }).catch(() => {});
  }, [projectId]);
  return null;
}
