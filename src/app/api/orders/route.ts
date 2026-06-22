import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { orderSchema } from "@/lib/validation";
import { ok, created, fail, handleError } from "@/lib/api";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  sendTelegramMessage,
  formatOrderForTelegram,
} from "@/lib/telegram";
import { sendOrderEmail, formatOrderEmail } from "@/lib/email";

export const runtime = "nodejs";

// GET — admin list of orders.
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth.user) return fail("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const orders = await prisma.order.findMany({
      where: status ? { status: status as never } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return ok(orders);
  } catch (err) {
    return handleError(err);
  }
}

// POST — public order submission.
export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(req, { key: "order", limit: 5, windowMs: 60_000 });
    if (!limit.ok) return fail("Слишком много заявок. Попробуйте позже.", 429);

    const body = await req.json();
    const data = orderSchema.parse(body);

    const order = await prisma.order.create({
      data: {
        name: data.name,
        phone: data.phone,
        telegram: data.telegram || null,
        email: data.email || null,
        projectType: data.projectType,
        description: data.description,
        budget: data.budget || null,
        deadline: data.deadline || null,
        files: data.files ?? [],
        ipAddress: getClientIp(req),
        userAgent: req.headers.get("user-agent") || undefined,
      },
    });

    await prisma.analytics.create({
      data: { path: "/order", event: "order" },
    });

    // Fire notifications (non-blocking failures are logged, not fatal).
    const [tg, mail] = await Promise.all([
      sendTelegramMessage(formatOrderForTelegram(order)),
      sendOrderEmail(
        formatOrderEmail(order),
        `Новая заявка NAVIX — ${order.name}`
      ),
    ]);

    return created({ id: order.id, notified: { telegram: tg, email: mail } });
  } catch (err) {
    return handleError(err);
  }
}
