import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { reviewSchema } from "@/lib/validation";
import { ok, fail, handleError } from "@/lib/api";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return fail("Unauthorized", 401);
    const data = reviewSchema.partial().parse(await req.json());
    const review = await prisma.review.update({
      where: { id: params.id },
      data,
    });
    await logAudit({
      userId: auth.user.id,
      action: "update_review",
      entity: "review",
      entityId: review.id,
      ipAddress: getClientIp(req),
    });
    return ok(review);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return fail("Unauthorized", 401);
    await prisma.review.delete({ where: { id: params.id } });
    await logAudit({
      userId: auth.user.id,
      action: "delete_review",
      entity: "review",
      entityId: params.id,
      ipAddress: getClientIp(req),
    });
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
