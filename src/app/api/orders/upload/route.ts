import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ok, fail, handleError } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { ensureDir, UPLOADS_DIR } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 60;

// Public order-brief attachments. Strictly limited & validated — this is NOT a
// publishing endpoint; visitors cannot publish sites, only attach brief files.
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
]);
const MAX_SIZE = 20 * 1024 * 1024;
const MAX_FILES = 5;

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(req, {
      key: "order-upload",
      limit: 10,
      windowMs: 60_000,
    });
    if (!limit.ok) return fail("Слишком много загрузок. Попробуйте позже.", 429);

    const form = await req.formData();
    const files = form
      .getAll("file")
      .filter((f): f is File => f instanceof File)
      .slice(0, MAX_FILES);
    if (files.length === 0) return fail("Файл не найден", 400);

    const dir = path.join(UPLOADS_DIR, "orders");
    await ensureDir(dir);

    const urls: string[] = [];
    for (const file of files) {
      if (!ALLOWED.has(file.type)) {
        return fail(`Недопустимый тип файла: ${file.type}`, 415);
      }
      if (file.size > MAX_SIZE) {
        return fail(`Файл ${file.name} превышает 20MB`, 413);
      }
      const ext = (file.name.split(".").pop() || "bin")
        .replace(/[^a-z0-9]/gi, "")
        .slice(0, 8);
      const filename = `order-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(dir, filename), buffer);
      urls.push(`/uploads/orders/${filename}`);
    }

    return ok({ urls });
  } catch (err) {
    return handleError(err);
  }
}
