"use client";

import Link from "next/link";
import {
  UtensilsCrossed,
  Tags,
  Ticket,
  Star,
  ClipboardList,
  QrCode,
  BarChart3,
  TrendingUp,
  Settings as SettingsIcon,
} from "lucide-react";
import { useMenu } from "@/context/menu-provider";
import { useOrder } from "@/context/order-provider";
import { PageHeader, Card } from "@/components/admin/ui";
import { formatSom } from "@/lib/utils";

export default function AdminDashboard() {
  const { dishes, promos, popularDishes, settings } = useMenu();
  const { orders } = useOrder();

  const avgPrice = dishes.length
    ? Math.round(dishes.reduce((s, d) => s + d.price, 0) / dishes.length)
    : 0;

  const activeOrders = orders.filter((o) => o.status !== "delivered").length;
  const income = orders
    .filter((o) => o.paid)
    .reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Faol zakazlar", value: activeOrders, icon: ClipboardList },
    { label: "Kirim (to'langan)", value: formatSom(income), icon: TrendingUp },
    { label: "Taomlar", value: dishes.length, icon: UtensilsCrossed },
    { label: "Promo kodlar", value: promos.length, icon: Ticket },
    { label: "Mashhur", value: popularDishes.length, icon: Star },
  ];

  const links = [
    {
      href: "/admin/orders",
      label: "Zakazlar",
      desc: "Kelgan buyurtmalar va holati",
      icon: ClipboardList,
    },
    {
      href: "/admin/hisobot",
      label: "Hisobot",
      desc: "Kirim / chiqim, savdo va foyda",
      icon: BarChart3,
    },
    {
      href: "/admin/menu",
      label: "Menu / Taomlar",
      desc: "Taom qo'shish, tahrirlash, o'chirish",
      icon: UtensilsCrossed,
    },
    {
      href: "/admin/categories",
      label: "Kategoriyalar",
      desc: "Menu bo'limlarini boshqarish",
      icon: Tags,
    },
    {
      href: "/admin/promos",
      label: "Promo kodlar",
      desc: "Chegirma kodlarini boshqarish",
      icon: Ticket,
    },
    {
      href: "/admin/tables",
      label: "Stollar / QR",
      desc: "Stollar uchun QR kod yaratish",
      icon: QrCode,
    },
    {
      href: "/admin/settings",
      label: "Sozlamalar",
      desc: "Restoran ma'lumotlari",
      icon: SettingsIcon,
    },
  ];

  return (
    <div>
      <PageHeader
        title={`${settings.name} boshqaruvi`}
        subtitle="Restoran ma'lumotlarini shu yerdan boshqaring"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <Icon className="h-6 w-6 text-gold-400" />
              <p className="mt-3 font-display text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4">
        <p className="text-sm text-muted">O&apos;rtacha taom narxi</p>
        <p className="mt-1 font-display text-2xl font-bold text-gold-400">
          {formatSom(avgPrice)}
        </p>
      </Card>

      <h2 className="mb-4 mt-10 font-display text-xl font-bold">
        Tez havolalar
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link key={l.href} href={l.href}>
              <Card className="group h-full transition-all hover:border-gold hover:shadow-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold-400 transition-colors group-hover:bg-gold group-hover:text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-display text-lg font-semibold">
                  {l.label}
                </p>
                <p className="mt-1 text-sm text-muted">{l.desc}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-gold/30 bg-gold/5 p-5 text-sm text-muted">
        <p>
          <strong className="text-foreground">Eslatma:</strong>{" "}
          <strong className="text-foreground">Zakazlar</strong> va{" "}
          <strong className="text-foreground">Hisobot</strong> umumiy bazada
          saqlanadi — istalgan telefondan berilgan buyurtma barcha
          qurilmalarda ko&apos;rinadi. Menu va sozlamalar o&apos;zgarishlari
          esa hozircha shu brauzerda (localStorage) saqlanadi.
        </p>
      </div>
    </div>
  );
}
