import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { projectSchema } from "@/lib/validation";
import { ok, created, fail, handleError } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

// GET /api/projects — public list (published only) unless admin requests all.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const includeAll = searchParams.get("all") === "true";

    let isAdmin = false;
    if (includeAll) {
      const auth = await requireAuth(req);
      isAdmin = !!auth.user;
    }

    const where: Prisma.ProjectWhereInput = {};
    if (!isAdmin) where.status = "PUBLISHED";
    if (category && category !== "all") {
      where.category = category as Prisma.ProjectWhereInput["category"];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ featured: "desc" }, { order: "asc" }, { publishedAt: "desc" }],
      include: { uploadedSite: true },
    });
    return ok(projects);
  } catch (err) {
    return handleError(err);
  }
}

// POST /api/projects — admin create.
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return fail("Unauthorized", 401);

    const body = await req.json();
    const data = projectSchema.parse(body);

    let slug = data.slug?.trim() || slugify(data.title);
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const project = await prisma.project.create({
      data: {
        ...data,
        slug,
        publishedAt: data.status === "PUBLISHED" ? new Date() : new Date(),
      },
    });

    await logAudit({
      userId: auth.user.id,
      action: "create_project",
      entity: "project",
      entityId: project.id,
      ipAddress: getClientIp(req),
    });

    return created(project);
  } catch (err) {
    return handleError(err);
  }
}
