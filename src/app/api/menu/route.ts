import { NextResponse } from "next/server";
import { getMenuData, saveMenuData } from "@/lib/store";
import { defaultMenuData } from "@/data/menu";
import type { MenuData } from "@/lib/types";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export async function GET() {
  try {
    const stored = await getMenuData();
    return NextResponse.json({ menu: stored ?? defaultMenuData() });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<MenuData>;
    if (
      !Array.isArray(body.dishes) ||
      !Array.isArray(body.categories) ||
      !Array.isArray(body.promos) ||
      !body.settings
    ) {
      return NextResponse.json({ error: "Invalid menu data" }, { status: 400 });
    }
    const data: MenuData = {
      dishes: body.dishes,
      categories: body.categories,
      promos: body.promos,
      settings: body.settings,
      updatedAt: Date.now(),
    };
    await saveMenuData(data);
    return NextResponse.json({ menu: data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
