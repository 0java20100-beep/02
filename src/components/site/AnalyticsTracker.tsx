"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  try {
    let id = localStorage.getItem("navix_sid");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("navix_sid", id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/the-admin-navix")) return;
    const sessionId = getSessionId();
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        event: "pageview",
        referrer: document.referrer || undefined,
        sessionId,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);
  return null;
}
