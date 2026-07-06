import { list, put, del } from "@vercel/blob";
import { unstable_noStore as noStore } from "next/cache";
import type { Order, Expense } from "@/lib/types";

/**
 * Blob-backed persistence. Each record is stored as its own JSON blob.
 * All access happens server-side via API routes using BLOB_READ_WRITE_TOKEN.
 *
 * Mutable records (orders) are stored with a VERSIONED pathname
 * (`orders/<id>__<timestamp>.json`) instead of a fixed one. Vercel Blob's CDN
 * caches content by path and does not reliably serve fresh bytes right after an
 * overwrite, so instead of overwriting we always write a brand-new file (a URL
 * that was never cached) and delete the older versions. Reads pick the newest
 * version per id, guaranteeing correct read-after-write for status/paid changes.
 */

const token = process.env.BLOB_READ_WRITE_TOKEN;
const SEP = "__";

async function writeItem(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    token,
  });
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const bust = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
    const res = await fetch(bust, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Read one blob per record id, always choosing the newest version. */
async function readVersioned<T>(prefix: string): Promise<T[]> {
  noStore();
  const { blobs } = await list({ prefix, token, limit: 1000 });
  const latest = new Map<string, { ts: number; url: string }>();
  for (const b of blobs) {
    const name = b.pathname.slice(prefix.length).replace(/\.json$/, "");
    const sep = name.lastIndexOf(SEP);
    const id = sep === -1 ? name : name.slice(0, sep);
    const ts = sep === -1 ? 0 : Number(name.slice(sep + SEP.length)) || 0;
    const cur = latest.get(id);
    if (!cur || ts >= cur.ts) latest.set(id, { ts, url: b.url });
  }
  const items = await Promise.all(
    Array.from(latest.values()).map((v) => fetchJson<T>(v.url)),
  );
  return items.filter((x) => x !== null) as T[];
}

/** Write a new version for `id` and delete every older version of that id. */
async function writeVersioned(
  prefix: string,
  id: string,
  data: unknown,
): Promise<void> {
  const ts = Date.now();
  const pathname = `${prefix}${id}${SEP}${ts}.json`;
  await writeItem(pathname, data);
  noStore();
  const { blobs } = await list({ prefix: `${prefix}${id}${SEP}`, token, limit: 1000 });
  const stale = blobs.filter((b) => b.pathname !== pathname);
  if (stale.length) await del(stale.map((b) => b.url), { token });
}

async function removeVersioned(prefix: string, id: string): Promise<void> {
  noStore();
  const { blobs } = await list({ prefix: `${prefix}${id}${SEP}`, token, limit: 1000 });
  if (blobs.length) await del(blobs.map((b) => b.url), { token });
}

async function readAll<T>(prefix: string): Promise<T[]> {
  noStore();
  const { blobs } = await list({ prefix, token, limit: 1000 });
  const items = await Promise.all(blobs.map((b) => fetchJson<T>(b.url)));
  return items.filter((x) => x !== null) as T[];
}

async function removeByPrefix(prefix: string): Promise<void> {
  noStore();
  const { blobs } = await list({ prefix, token, limit: 1000 });
  if (blobs.length) await del(blobs.map((b) => b.url), { token });
}

async function removeOne(prefix: string, id: string): Promise<void> {
  noStore();
  const { blobs } = await list({ prefix, token, limit: 1000 });
  const target = blobs.find((b) => b.pathname === `${prefix}${id}.json`);
  if (target) await del(target.url, { token });
}

export type StoredOrder = Order;
export type StoredExpense = Expense;

// ---- Orders (mutable → versioned) ----
const ORDERS_PREFIX = "orders/";

export async function getOrders(): Promise<StoredOrder[]> {
  const orders = await readVersioned<StoredOrder>(ORDERS_PREFIX);
  return orders.sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveOrder(order: StoredOrder): Promise<void> {
  await writeVersioned(ORDERS_PREFIX, order.id, order);
}

export async function updateOrder(
  id: string,
  patch: Partial<StoredOrder>,
): Promise<StoredOrder | null> {
  const orders = await readVersioned<StoredOrder>(ORDERS_PREFIX);
  const existing = orders.find((o) => o.id === id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, id: existing.id };
  await writeVersioned(ORDERS_PREFIX, id, updated);
  return updated;
}

export async function deleteOrder(id: string): Promise<void> {
  await removeVersioned(ORDERS_PREFIX, id);
}

export async function clearOrders(): Promise<void> {
  await removeByPrefix(ORDERS_PREFIX);
}

// ---- Expenses (chiqim — create/delete only) ----
const EXPENSES_PREFIX = "expenses/";

export async function getExpenses(): Promise<StoredExpense[]> {
  const items = await readAll<StoredExpense>(EXPENSES_PREFIX);
  return items.sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveExpense(expense: StoredExpense): Promise<void> {
  await writeItem(`${EXPENSES_PREFIX}${expense.id}.json`, expense);
}

export async function deleteExpense(id: string): Promise<void> {
  await removeOne(EXPENSES_PREFIX, id);
}

export async function clearExpenses(): Promise<void> {
  await removeByPrefix(EXPENSES_PREFIX);
}
