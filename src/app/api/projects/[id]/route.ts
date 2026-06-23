import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { projectSchema } from "@/lib/validation";
import { ok, fail, handleError } from "@/lib/api";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";
import { deleteSite } from "@/lib/storage";

export const runtime = "nodejs";

// GET by id or slug.
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
      include: { uploadedSite: true },
    });
    if (!project) return fail("Проект не найден", 404);
    return ok(project);
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return fail("Unauthorized", 401);

    const body = await req.json();
    const data = projectSchema.partial().parse(body);

    const project = await prisma.project.update({
      where: { id: params.id },
      data,
    });

    await logAudit({
      userId: auth.user.id,
      action: "update_project",
      entity: "project",
      entityId: project.id,
      ipAddress: getClientIp(req),
    });

    return ok(project);
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

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });
    if (!project) return fail("Проект не найден", 404);

    await prisma.project.delete({ where: { id: params.id } });
    await deleteSite(project.slug).catch(() => {});

    await logAudit({
      userId: auth.user.id,
      action: "delete_project",
      entity: "project",
      entityId: params.id,
      ipAddress: getClientIp(req),
    });

    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
