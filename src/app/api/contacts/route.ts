import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { contactSchema } from "@/lib/validation";
import { ok, created, fail, handleError } from "@/lib/api";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    let isAdmin = false;
    if (all) {
      const auth = await requireAuth(req);
      isAdmin = !!auth.user;
    }
    const contacts = await prisma.contact.findMany({
      where: isAdmin ? undefined : { visible: true },
      orderBy: { order: "asc" },
    });
    return ok(contacts);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return fail("Unauthorized", 401);
    const data = contactSchema.parse(await req.json());
    const contact = await prisma.contact.create({ data });
    await logAudit({
      userId: auth.user.id,
      action: "create_contact",
      entity: "contact",
      entityId: contact.id,
      ipAddress: getClientIp(req),
    });
    return created(contact);
  } catch (err) {
    return handleError(err);
  }
}
