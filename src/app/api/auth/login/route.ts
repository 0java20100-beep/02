import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, AUTH_COOKIE } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { ok, fail, handleError } from "@/lib/api";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(req, { key: "login", limit: 10, windowMs: 60_000 });
    if (!limit.ok) return fail("Слишком много попыток. Попробуйте позже.", 429);

    const body = await req.json();
    const { username, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      await logAudit({
        action: "login_failed",
        meta: { username },
        ipAddress: getClientIp(req),
      });
      return fail("Неверный логин или пароль", 401);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = signToken({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    await logAudit({
      userId: user.id,
      action: "login",
      ipAddress: getClientIp(req),
    });

    const res = ok({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
      mustChangePassword: user.mustChangePassword,
    });
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    return handleError(err);
  }
}
