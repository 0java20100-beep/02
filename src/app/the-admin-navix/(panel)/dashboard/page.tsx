"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Users,
  Inbox,
  FolderKanban,
  Globe,
  Star,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { apiGet } from "@/lib/admin-client";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

interface Dashboard {
  totals: {
    views: number;
    visitors: number;
    orders: number;
    newOrders: number;
    projects: number;
    publishedProjects: number;
    reviews: number;
    sites: number;
    conversion: number;
  };
  viewsByDay: { date: string; count: number }[];
  recentOrders: {
    id: string;
    name: string;
    projectType: string;
    status: string;
    createdAt: string;
  }[];
  topProjects: { id: string; title: string; views: number; slug: string }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Dashboard>("/api/analytics").then((r) => {
      if (r.success && r.data) setData(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid place-items-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!data) return <p className="text-muted">Нет данных.</p>;

  const t = data.totals;
  const stats = [
    { label: "Просмотры", value: t.views, icon: Eye },
    { label: "Посетители", value: t.visitors, icon: Users },
    { label: "Заявки", value: t.orders, icon: Inbox, sub: `${t.newOrders} новых` },
    { label: "Конверсия", value: `${t.conversion}%`, icon: TrendingUp },
    { label: "Проекты", value: t.projects, icon: FolderKanban, sub: `${t.publishedProjects} опубл.` },
    { label: "Готовые сайты", value: t.sites, icon: Globe },
    { label: "Отзывы", value: t.reviews, icon: Star },
  ];

  const maxViews = Math.max(1, ...data.viewsByDay.map((d) => d.count));

  return (
    <div>
      <PageHeader title="Dashboard" description="Обзор активности и статистика NAVIX." />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
            {s.sub && <div className="text-[0.7rem] text-muted mt-1">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Просмотры за 30 дней</h3>
          {data.viewsByDay.length === 0 ? (
            <p className="text-sm text-muted">Пока нет данных.</p>
          ) : (
            <div className="flex items-end gap-1 h-40">
              {data.viewsByDay.map((d) => (
                <div key={d.date} className="flex-1 group relative">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-primary to-secondary"
                    style={{ height: `${(d.count / maxViews) * 100}%` }}
                  />
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[0.65rem] opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    {d.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Топ проектов</h3>
          {data.topProjects.length === 0 ? (
            <p className="text-sm text-muted">Нет проектов.</p>
          ) : (
            <ul className="space-y-3">
              {data.topProjects.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{p.title}</span>
                  <span className="inline-flex items-center gap-1 text-muted">
                    <Eye className="h-3.5 w-3.5" /> {p.views}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Последние заявки</h3>
        {data.recentOrders.length === 0 ? (
          <p className="text-sm text-muted">Заявок пока нет.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted text-xs">
                <tr className="text-left">
                  <th className="py-2 pr-4">Имя</th>
                  <th className="py-2 pr-4">Тип</th>
                  <th className="py-2 pr-4">Статус</th>
                  <th className="py-2">Дата</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-white/5">
                    <td className="py-2.5 pr-4">{o.name}</td>
                    <td className="py-2.5 pr-4 text-muted">{o.projectType}</td>
                    <td className="py-2.5 pr-4"><StatusBadge status={o.status} /></td>
                    <td className="py-2.5 text-muted">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
