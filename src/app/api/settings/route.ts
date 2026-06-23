import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { settingSchema } from "@/lib/validation";
import { ok, fail, handleError } from "@/lib/api";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

// GET — all settings (public; powers the content builder + site rendering).
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (key) {
      const row = await prisma.setting.findUnique({ where: { key } });
      return ok(row?.value ?? null);
    }
    const rows = await prisma.setting.findMany();
    const map: Record<string, unknown> = {};
    for (const r of rows) map[r.key] = r.value;
    return ok(map);
  } catch (err) {
    return handleError(err);
  }
}

// PUT — admin upsert a setting key.
export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return fail("Unauthorized", 401);
    const { key, value } = settingSchema.parse(await req.json());
    const row = await prisma.setting.upsert({
      where: { key },
      update: { value: value as object },
      create: { key, value: value as object },
    });
    await logAudit({
      userId: auth.user.id,
      action: "update_setting",
      entity: "setting",
      entityId: key,
      ipAddress: getClientIp(req),
    });
    return ok(row);
  } catch (err) {
    return handleError(err);
  }
}
