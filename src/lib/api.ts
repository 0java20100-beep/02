import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function fail(message: string, status = 400, extra?: unknown) {
  return NextResponse.json(
    { success: false, error: message, details: extra },
    { status }
  );
}

export function handleError(err: unknown) {
  if (err instanceof ZodError) {
    return fail("Ошибка валидации", 422, err.flatten().fieldErrors);
  }
  console.error("[api] error", err);
  return fail("Внутренняя ошибка сервера", 500);
}
