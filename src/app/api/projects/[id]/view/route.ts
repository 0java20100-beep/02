import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, handleError } from "@/lib/api";

export const runtime = "nodejs";

// POST — increment project view counter (public).
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
      select: { id: true, views: true },
    });
    await prisma.analytics.create({
      data: { path: `/projects/${project.id}`, event: "project_view" },
    });
    return ok(project);
  } catch (err) {
    return handleError(err);
  }
}
