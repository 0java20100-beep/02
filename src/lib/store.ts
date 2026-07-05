import { list, put, del } from "@vercel/blob";
import type { Order, Expense } from "@/lib/types";

/**
 * Blob-backed persistence. Each record is stored as its own JSON blob under a
 * prefix (e.g. `orders/ORD-123.json`), so concurrent creates never race.
 * All access happens server-side via API routes using BLOB_READ_WRITE_TOKEN.
 */

const token = process.env.BLOB_READ_WRITE_TOKEN;

export type StoredOrder = Order;
export type StoredExpense = Expense;

async function readAll<T>(prefix: string): Promise<T[]> {
  const { blobs } = await list({ prefix, token, limit: 1000 });
  const items = await Promise.all(
    blobs.map(async (b) => {
      try {
        const res = await fetch(b.url, { cache: "no-store" });
        if (!res.ok) return null;
        return (await res.json()) as T;
      } catch {
        return null;
      }
    }),
  );
  return items.filter((x) => x !== null) as T[];
}

async function writeItem(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  });
}

async function removeByPrefix(prefix: string): Promise<void> {
  const { blobs } = await list({ prefix, token, limit: 1000 });
  if (blobs.length) await del(blobs.map((b) => b.url), { token });
}

async function removeOne(prefix: string, id: string): Promise<void> {
  const { blobs } = await list({ prefix, token, limit: 1000 });
  const target = blobs.find((b) => b.pathname === `${prefix}${id}.json`);
  if (target) await del(target.url, { token });
}

// ---- Orders ----
const ORDERS_PREFIX = "orders/";

export async function getOrders(): Promise<StoredOrder[]> {
  const orders = await readAll<StoredOrder>(ORDERS_PREFIX);
  return orders.sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveOrder(order: StoredOrder): Promise<void> {
  await writeItem(`${ORDERS_PREFIX}${order.id}.json`, order);
}

export async function updateOrder(
  id: string,
  patch: Partial<StoredOrder>,
): Promise<StoredOrder | null> {
  const orders = await readAll<StoredOrder>(ORDERS_PREFIX);
  const existing = orders.find((o) => o.id === id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, id: existing.id };
  await writeItem(`${ORDERS_PREFIX}${id}.json`, updated);
  return updated;
}

export async function deleteOrder(id: string): Promise<void> {
  await removeOne(ORDERS_PREFIX, id);
}

export async function clearOrders(): Promise<void> {
  await removeByPrefix(ORDERS_PREFIX);
}

// ---- Expenses (chiqim) ----
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
