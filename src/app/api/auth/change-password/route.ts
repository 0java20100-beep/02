import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCurrentUser,
  comparePassword,
  hashPassword,
} from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validation";
import { ok, fail, handleError } from "@/lib/api";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return fail("Unauthorized", 401);

    const body = await req.json();
    const { currentPassword, newPassword } = changePasswordSchema.parse(body);

    if (!(await comparePassword(currentPassword, user.passwordHash))) {
      return fail("Текущий пароль неверный", 400);
    }
    if (currentPassword === newPassword) {
      return fail("Новый пароль должен отличаться от текущего", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(newPassword),
        mustChangePassword: false,
      },
    });

    await logAudit({
      userId: user.id,
      action: "change_password",
      ipAddress: getClientIp(req),
    });

    return ok({ changed: true });
  } catch (err) {
    return handleError(err);
  }
}
