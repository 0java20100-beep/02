import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ok, fail, handleError } from "@/lib/api";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const updateSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "CONTACTED", "DONE", "REJECTED"]),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return fail("Unauthorized", 401);
    const body = await req.json();
    const { status } = updateSchema.parse(body);
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });
    await logAudit({
      userId: auth.user.id,
      action: "update_order",
      entity: "order",
      entityId: order.id,
      ipAddress: getClientIp(req),
    });
    return ok(order);
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
    await prisma.order.delete({ where: { id: params.id } });
    await logAudit({
      userId: auth.user.id,
      action: "delete_order",
      entity: "order",
      entityId: params.id,
      ipAddress: getClientIp(req),
    });
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
