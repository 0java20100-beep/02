"use client";

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

async function parse<T>(res: Response): Promise<ApiResult<T>> {
  try {
    return (await res.json()) as ApiResult<T>;
  } catch {
    return { success: false, error: `HTTP ${res.status}` };
  }
}

export async function apiGet<T>(url: string): Promise<ApiResult<T>> {
  const res = await fetch(url, { credentials: "include", cache: "no-store" });
  return parse<T>(res);
}

export async function apiSend<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown
): Promise<ApiResult<T>> {
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return parse<T>(res);
}

export async function apiUpload<T>(
  url: string,
  formData: FormData
): Promise<ApiResult<T>> {
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return parse<T>(res);
}
