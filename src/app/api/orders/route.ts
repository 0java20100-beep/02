import { NextResponse } from "next/server";
import { getOrders, saveOrder, clearOrders } from "@/lib/store";
import type { StoredOrder } from "@/lib/store";
import type { CartItem } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      tableNumber: number;
      items: CartItem[];
      total: number;
    };
    if (!body.items?.length) {
      return NextResponse.json({ error: "Empty order" }, { status: 400 });
    }
    const order: StoredOrder = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 5)
        .toUpperCase()}`,
      tableNumber: Number(body.tableNumber) || 0,
      items: body.items,
      total: Number(body.total) || 0,
      status: "pending",
      createdAt: Date.now(),
      paid: false,
    };
    await saveOrder(order);
    return NextResponse.json({ order }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    await clearOrders();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 },
    );
  }
}
