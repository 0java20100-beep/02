import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { reviewSchema } from "@/lib/validation";
import { ok, created, fail, handleError } from "@/lib/api";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    let isAdmin = false;
    if (all) {
      const auth = await requireAuth(req);
      isAdmin = !!auth.user;
    }
    const reviews = await prisma.review.findMany({
      where: isAdmin ? undefined : { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return ok(reviews);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return fail("Unauthorized", 401);
    const data = reviewSchema.parse(await req.json());
    const review = await prisma.review.create({ data });
    await logAudit({
      userId: auth.user.id,
      action: "create_review",
      entity: "review",
      entityId: review.id,
      ipAddress: getClientIp(req),
    });
    return created(review);
  } catch (err) {
    return handleError(err);
  }
}
