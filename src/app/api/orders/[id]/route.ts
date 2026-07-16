import { NextResponse } from "next/server";
import { updateOrder, deleteOrder } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

const VALID: OrderStatus[] = ["pending", "cooking", "ready", "delivered"];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = (await req.json()) as {
      status?: OrderStatus;
      paid?: boolean;
    };
    const patch: { status?: OrderStatus; paid?: boolean } = {};
    if (body.status && VALID.includes(body.status)) patch.status = body.status;
    if (typeof body.paid === "boolean") patch.paid = body.paid;
    const updated = await updateOrder(params.id, patch);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ order: updated });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await deleteOrder(params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
