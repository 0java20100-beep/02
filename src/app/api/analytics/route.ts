import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ok, handleError } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// POST — track a pageview/visitor event (public).
export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(req, { key: "track", limit: 120, windowMs: 60_000 });
    if (!limit.ok) return ok({ tracked: false });
    const body = await req.json().catch(() => ({}));
    await prisma.analytics.create({
      data: {
        path: String(body.path || "/"),
        event: String(body.event || "pageview"),
        referrer: body.referrer ? String(body.referrer) : undefined,
        sessionId: body.sessionId ? String(body.sessionId) : undefined,
      },
    });
    return ok({ tracked: true });
  } catch (err) {
    return handleError(err);
  }
}

// GET — admin dashboard statistics.
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return ok(null, { status: 401 });

    const now = new Date();
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      views,
      visitors,
      orders,
      newOrders,
      projects,
      publishedProjects,
      reviews,
      sites,
      ordersByDay,
      viewsByDay,
      recentOrders,
      topProjects,
    ] = await Promise.all([
      prisma.analytics.count({ where: { event: "pageview" } }),
      prisma.analytics
        .findMany({
          where: { event: "pageview", sessionId: { not: null } },
          distinct: ["sessionId"],
          select: { sessionId: true },
        })
        .then((r) => r.length),
      prisma.order.count(),
      prisma.order.count({ where: { status: "NEW" } }),
      prisma.project.count(),
      prisma.project.count({ where: { status: "PUBLISHED" } }),
      prisma.review.count(),
      prisma.uploadedSite.count(),
      prisma.analytics.findMany({
        where: { event: "order", createdAt: { gte: last30 } },
        select: { createdAt: true },
      }),
      prisma.analytics.findMany({
        where: { event: "pageview", createdAt: { gte: last30 } },
        select: { createdAt: true },
      }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.project.findMany({
        orderBy: { views: "desc" },
        take: 5,
        select: { id: true, title: true, views: true, slug: true },
      }),
    ]);

    const conversion = views > 0 ? +((orders / views) * 100).toFixed(2) : 0;

    const groupByDay = (rows: { createdAt: Date }[]) => {
      const map: Record<string, number> = {};
      for (const r of rows) {
        const key = r.createdAt.toISOString().slice(0, 10);
        map[key] = (map[key] || 0) + 1;
      }
      return Object.entries(map)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }));
    };

    return ok({
      totals: {
        views,
        visitors,
        orders,
        newOrders,
        projects,
        publishedProjects,
        reviews,
        sites,
        conversion,
      },
      ordersByDay: groupByDay(ordersByDay),
      viewsByDay: groupByDay(viewsByDay),
      recentOrders,
      topProjects,
    });
  } catch (err) {
    return handleError(err);
  }
}
