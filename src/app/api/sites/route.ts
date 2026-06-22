import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ok, created, fail, handleError } from "@/lib/api";
import { extractZipSite } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";
import { ProjectCategory, SiteType } from "@prisma/client";

export const runtime = "nodejs";
export const maxDuration = 120;

// GET — list published uploaded sites (public) or all (admin).
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    let isAdmin = false;
    if (all) {
      const auth = await requireAuth(req);
      isAdmin = !!auth.user;
    }
    const sites = await prisma.project.findMany({
      where: {
        uploadedSite: { isNot: null },
        ...(isAdmin ? {} : { status: "PUBLISHED" }),
      },
      include: { uploadedSite: true },
      orderBy: { publishedAt: "desc" },
    });
    return ok(sites);
  } catch (err) {
    return handleError(err);
  }
}

// POST — admin upload a ZIP site. Multipart: file (zip) + metadata fields.
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return fail("Unauthorized", 401);

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return fail("ZIP-файл не найден", 400);
    if (!/\.zip$/i.test(file.name) && file.type !== "application/zip") {
      return fail("Допускается только ZIP-архив", 415);
    }
    if (file.size > 100 * 1024 * 1024) {
      return fail("Архив превышает 100MB", 413);
    }

    const title = String(form.get("title") || "").trim();
    if (!title) return fail("Укажите название", 400);
    const description = String(form.get("description") || "").trim();
    const categoryRaw = String(form.get("category") || "LANDING_PAGE");
    const category = (Object.values(ProjectCategory) as string[]).includes(
      categoryRaw
    )
      ? (categoryRaw as ProjectCategory)
      : ProjectCategory.LANDING_PAGE;
    const typeRaw = String(form.get("type") || "STATIC");
    const type = (Object.values(SiteType) as string[]).includes(typeRaw)
      ? (typeRaw as SiteType)
      : SiteType.STATIC;
    const technologies = String(form.get("technologies") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const coverImage = String(form.get("coverImage") || "") || null;
    const screenshots = String(form.get("screenshots") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let slug = slugify(title);
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const extracted = await extractZipSite(buffer, slug);

    const project = await prisma.project.create({
      data: {
        slug,
        title,
        description: description || title,
        category,
        status: "PUBLISHED",
        technologies,
        coverImage,
        screenshots,
        demoUrl: `${extracted.storagePath}/${extracted.entryFile}`,
        publishedAt: new Date(),
        uploadedSite: {
          create: {
            type,
            storagePath: extracted.storagePath,
            entryFile: extracted.entryFile,
            sizeBytes: extracted.sizeBytes,
          },
        },
      },
      include: { uploadedSite: true },
    });

    await logAudit({
      userId: auth.user.id,
      action: "upload_site",
      entity: "project",
      entityId: project.id,
      meta: { slug, sizeBytes: extracted.sizeBytes },
      ipAddress: getClientIp(req),
    });

    return created(project);
  } catch (err) {
    return handleError(err);
  }
}
