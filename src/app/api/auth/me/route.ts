import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return fail("Unauthorized", 401);
  return ok({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
    lastLoginAt: user.lastLoginAt,
  });
}
