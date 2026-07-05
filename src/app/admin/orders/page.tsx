"use client";

import { useMemo, useState } from "react";
import {
  Clock,
  ChefHat,
  Package,
  Truck,
  Trash2,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { useOrder } from "@/context/order-provider";
import type { OrderStatus } from "@/lib/types";
import { PageHeader, Card, Button } from "@/components/admin/ui";
import { formatSom, cn } from "@/lib/utils";

const STATUS: {
  key: OrderStatus;
  label: string;
  icon: typeof Clock;
  badge: string;
}[] = [
  {
    key: "pending",
    label: "Qabul qilindi",
    icon: Clock,
    badge: "bg-amber-500/15 text-amber-500",
  },
  {
    key: "cooking",
    label: "Tayyorlanmoqda",
    icon: ChefHat,
    badge: "bg-orange-500/15 text-orange-500",
  },
  {
    key: "ready",
    label: "Tayyor",
    icon: Package,
    badge: "bg-emerald-500/15 text-emerald-500",
  },
  {
    key: "delivered",
    label: "Yetkazildi",
    icon: Truck,
    badge: "bg-foreground/10 text-muted",
  },
];

const labelFor = (s: OrderStatus) =>
  STATUS.find((x) => x.key === s) ?? STATUS[0];

const timeFmt = (ts: number) =>
  new Date(ts).toLocaleString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

type Filter = "all" | "active" | OrderStatus;

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, setPaid, clearOrders, refresh, loading } =
    useOrder();
  const [filter, setFilter] = useState<Filter>("all");

  const activeCount = orders.filter((o) => o.status !== "delivered").length;

  const filtered = useMemo(() => {
    const list = [...orders].sort((a, b) => b.createdAt - a.createdAt);
    if (filter === "all") return list;
    if (filter === "active")
      return list.filter((o) => o.status !== "delivered");
    return list.filter((o) => o.status === filter);
  }, [orders, filter]);

  const filterTabs: { key: Filter; label: string }[] = [
    { key: "all", label: `Barchasi (${orders.length})` },
    { key: "active", label: `Faol (${activeCount})` },
    { key: "pending", label: "Qabul qilindi" },
    { key: "cooking", label: "Tayyorlanmoqda" },
    { key: "ready", label: "Tayyor" },
    { key: "delivered", label: "Yetkazildi" },
  ];

  return (
    <div>
      <PageHeader
        title="Zakazlar"
        subtitle="Kelgan buyurtmalar — stol, holati va summasi"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refresh()}>
              <RefreshCw
                className={cn("h-4 w-4", loading && "animate-spin")}
              />{" "}
              Yangilash
            </Button>
            {orders.length > 0 && (
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm("Barcha buyurtmalar tarixi o'chirilsinmi?"))
                    clearOrders();
                }}
              >
                <Trash2 className="h-4 w-4" /> Tarixni tozalash
              </Button>
            )}
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {filterTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === t.key
                ? "btn-gold border-transparent"
                : "border-border text-muted hover:border-gold hover:text-gold-400",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="text-muted">
            {orders.length === 0
              ? "Hozircha buyurtmalar yo'q. Mijoz QR orqali buyurtma berganda shu yerda ko'rinadi."
              : "Bu holatda buyurtmalar yo'q."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const meta = labelFor(order.status);
            const StatusIcon = meta.icon;
            const count = order.items.reduce((s, i) => s + i.quantity, 0);
            return (
              <Card key={order.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-lg font-bold">
                        Stol #{order.tableNumber}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                          meta.badge,
                        )}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {meta.label}
                      </span>
                      {order.paid && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-500">
                          <Wallet className="h-3.5 w-3.5" />
                          To&apos;langan
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {order.id} · {timeFmt(order.createdAt)} · {count} ta taom
                    </p>
                  </div>
                  <p className="font-display text-xl font-bold text-gold-400">
                    {formatSom(order.total)}
                  </p>
                </div>

                <ul className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
                  {order.items.map((item) => (
                    <li
                      key={item.dish.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <span>
                        <span className="text-gold-400">
                          {item.quantity}×
                        </span>{" "}
                        {item.dish.name}
                      </span>
                      <span className="text-muted">
                        {formatSom(item.dish.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <span className="mr-1 text-xs text-muted">Holatni o&apos;zgartirish:</span>
                  {STATUS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => updateOrderStatus(order.id, s.key)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                        order.status === s.key
                          ? "btn-gold"
                          : "border border-border text-muted hover:border-gold hover:text-gold-400",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setPaid(order.id, !order.paid)}
                    className={cn(
                      "ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      order.paid
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "border border-border text-muted hover:border-gold hover:text-gold-400",
                    )}
                  >
                    <Wallet className="h-3.5 w-3.5" />
                    {order.paid ? "To'langan ✓" : "To'landi deb belgilash"}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-gold/30 bg-gold/5 p-5 text-sm text-muted">
        <p className="flex items-start gap-2">
          <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
          <span>
            <strong className="text-foreground">Real vaqtda:</strong>{" "}
            buyurtmalar umumiy bazada saqlanadi — istalgan telefondan QR orqali
            berilgan zakaz shu yerda avtomatik ko&apos;rinadi (har 7 soniyada
            yangilanadi).
          </span>
        </p>
      </div>
    </div>
  );
}
