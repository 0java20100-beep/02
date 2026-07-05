import { NextResponse } from "next/server";
import { getExpenses, saveExpense } from "@/lib/store";
import type { StoredExpense } from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const expenses = await getExpenses();
    return NextResponse.json({ expenses });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      title: string;
      amount: number;
      category?: string;
    };
    if (!body.title || !body.amount) {
      return NextResponse.json(
        { error: "Title and amount required" },
        { status: 400 },
      );
    }
    const expense: StoredExpense = {
      id: `EXP-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 5)
        .toUpperCase()}`,
      title: String(body.title),
      amount: Number(body.amount) || 0,
      category: body.category || "Boshqa",
      createdAt: Date.now(),
    };
    await saveExpense(expense);
    return NextResponse.json({ expense }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
