import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ok, fail, handleError } from "@/lib/api";

export const runtime = "nodejs";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return fail("Unauthorized", 401);
    const media = await prisma.media.findUnique({ where: { id: params.id } });
    if (!media) return fail("Файл не найден", 404);
    await prisma.media.delete({ where: { id: params.id } });

    // If URL is a blob URL, delete from Vercel Blob; otherwise delete local file.
    if (media.url.startsWith("http")) {
      await del(media.url).catch(() => {});
    } else {
      const filePath = path.join(process.cwd(), "public", media.url.replace(/^\//, ""));
      await fs.rm(filePath, { force: true }).catch(() => {});
    }
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
