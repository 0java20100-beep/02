import type { Metadata } from "next";
import { MenuView } from "@/components/menu/menu-view";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Sharqona menyusi — palov, shashlik, manti, lag'mon va boshqa milliy taomlar. Har bir taom rasmi, tarkibi va narxi bilan.",
};

export default function MenuPage() {
  return (
    <div className="pb-16 pt-28">
      <div className="mx-auto mb-10 max-w-7xl px-4 text-center">
        <div className="mb-3 flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">
          <span className="h-px w-8 bg-gold/60" /> Bizning menyu
          <span className="h-px w-8 bg-gold/60" />
        </div>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          Taomlar <span className="text-gradient-gold">to&apos;plami</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          An&apos;anaviy o&apos;zbek taomlari eng nafis ko&apos;rinishda —
          tanlang va buyurtma bering.
        </p>
      </div>
      <MenuView />
    </div>
  );
}
