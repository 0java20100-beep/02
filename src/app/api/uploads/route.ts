import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ok, fail, handleError } from "@/lib/api";
import { saveMediaFile } from "@/lib/storage";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

// GET — admin media library list.
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.user) return fail("Unauthorized", 401);
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return ok(media);
}

// POST — admin media upload (multipart). Field name: "file" (one or many).
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return fail("Unauthorized", 401);

    const form = await req.formData();
    const files = form.getAll("file").filter((f): f is File => f instanceof File);
    if (files.length === 0) return fail("Файл не найден", 400);

    const saved = [];
    for (const file of files) {
      if (file.size > 15 * 1024 * 1024) {
        return fail(`Файл ${file.name} превышает 15MB`, 413);
      }
      const result = await saveMediaFile(file);
      const media = await prisma.media.create({
        data: {
          filename: result.filename,
          url: result.url,
          mimeType: result.mimeType,
          sizeBytes: result.sizeBytes,
          width: result.width,
          height: result.height,
        },
      });
      saved.push(media);
    }

    await logAudit({
      userId: auth.user.id,
      action: "upload_media",
      entity: "media",
      meta: { count: saved.length },
      ipAddress: getClientIp(req),
    });

    return ok(saved);
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Недопустимый")) {
      return fail(err.message, 415);
    }
    return handleError(err);
  }
}
