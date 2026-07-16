"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Trash2,
  Plus,
  ShoppingBag,
  CalendarDays,
} from "lucide-react";
import { useOrder } from "@/context/order-provider";
import type { Expense } from "@/lib/types";
import {
  PageHeader,
  Card,
  Button,
  Field,
  TextInput,
  Select,
} from "@/components/admin/ui";
import { formatSom, cn } from "@/lib/utils";

const EXPENSE_CATEGORIES = [
  "Mahsulot",
  "Ish haqi",
  "Ijara",
  "Kommunal",
  "Marketing",
  "Boshqa",
];

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const dayLabel = (ts: number) =>
  new Date(ts).toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
  });

export default function AccountingPage() {
  const { orders } = useOrder();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [saving, setSaving] = useState(false);

  const loadExpenses = async () => {
    try {
      const res = await fetch("/api/expenses", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { expenses: Expense[] };
        setExpenses(data.expenses ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const addExpense = async () => {
    const amt = Number(amount);
    if (!title.trim() || !amt || saving) return;
    setSaving(true);
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), amount: amt, category }),
    });
    setSaving(false);
    if (res.ok) {
      const data = (await res.json()) as { expense: Expense };
      setExpenses((prev) => [data.expense, ...prev]);
      setTitle("");
      setAmount("");
    }
  };

  const removeExpense = async (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
  };

  const stats = useMemo(() => {
    const paidOrders = orders.filter((o) => o.paid);
    const income = paidOrders.reduce((s, o) => s + o.total, 0);
    const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);
    const pending = orders
      .filter((o) => !o.paid)
      .reduce((s, o) => s + o.total, 0);

    const today = startOfToday();
    const todayIncome = paidOrders
      .filter((o) => o.createdAt >= today)
      .reduce((s, o) => s + o.total, 0);
    const todayExpense = expenses
      .filter((e) => e.createdAt >= today)
      .reduce((s, e) => s + e.amount, 0);
    const todayOrders = orders.filter((o) => o.createdAt >= today).length;

    // Last 7 days income (paid)
    const days: { label: string; income: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - i);
      const s = start.getTime();
      const e = s + 86400000;
      const income = paidOrders
        .filter((o) => o.createdAt >= s && o.createdAt < e)
        .reduce((sum, o) => sum + o.total, 0);
      days.push({ label: dayLabel(s), income });
    }
    const maxDay = Math.max(1, ...days.map((d) => d.income));

    // Top dishes by revenue (from paid orders)
    const dishMap = new Map<string, { name: string; qty: number; revenue: number }>();
    paidOrders.forEach((o) =>
      o.items.forEach((it) => {
        const cur = dishMap.get(it.dish.id) ?? {
          name: it.dish.name,
          qty: 0,
          revenue: 0,
        };
        cur.qty += it.quantity;
        cur.revenue += it.dish.price * it.quantity;
        dishMap.set(it.dish.id, cur);
      }),
    );
    const topDishes = Array.from(dishMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      income,
      expenseTotal,
      profit: income - expenseTotal,
      pending,
      todayIncome,
      todayExpense,
      todayOrders,
      paidCount: paidOrders.length,
      days,
      maxDay,
      topDishes,
    };
  }, [orders, expenses]);

  const cards = [
    {
      label: "Umumiy kirim (to'langan)",
      value: formatSom(stats.income),
      icon: TrendingUp,
      tone: "text-emerald-500",
    },
    {
      label: "Umumiy chiqim",
      value: formatSom(stats.expenseTotal),
      icon: TrendingDown,
      tone: "text-red-500",
    },
    {
      label: "Sof foyda",
      value: formatSom(stats.profit),
      icon: Wallet,
      tone: stats.profit >= 0 ? "text-gold-400" : "text-red-500",
    },
    {
      label: "Kutilayotgan (to'lanmagan)",
      value: formatSom(stats.pending),
      icon: ShoppingBag,
      tone: "text-amber-500",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Hisobot — Kirim / Chiqim"
        subtitle="Savdo, xarajatlar va sof foyda"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label}>
              <Icon className={cn("h-6 w-6", c.tone)} />
              <p className={cn("mt-3 font-display text-2xl font-bold", c.tone)}>
                {c.value}
              </p>
              <p className="text-sm text-muted">{c.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Today */}
      <Card className="mt-4">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-gold-400" />
          <h2 className="font-display text-lg font-bold">Bugun</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted">Bugungi kirim</p>
            <p className="mt-1 font-display text-xl font-bold text-emerald-500">
              {formatSom(stats.todayIncome)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted">Bugungi chiqim</p>
            <p className="mt-1 font-display text-xl font-bold text-red-500">
              {formatSom(stats.todayExpense)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted">Bugungi zakazlar</p>
            <p className="mt-1 font-display text-xl font-bold">
              {stats.todayOrders}
            </p>
          </div>
        </div>
      </Card>

      {/* 7-day chart */}
      <Card className="mt-4">
        <h2 className="mb-5 font-display text-lg font-bold">
          So&apos;nggi 7 kunlik savdo
        </h2>
        <div className="flex items-end justify-between gap-2 sm:gap-4">
          {stats.days.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-40 w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-gold/40 to-gold transition-all"
                  style={{
                    height: `${(d.income / stats.maxDay) * 100}%`,
                    minHeight: d.income > 0 ? "4px" : "0px",
                  }}
                  title={formatSom(d.income)}
                />
              </div>
              <span className="text-[10px] text-muted sm:text-xs">
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Top dishes */}
      {stats.topDishes.length > 0 && (
        <Card className="mt-4">
          <h2 className="mb-4 font-display text-lg font-bold">
            Eng ko&apos;p daromad keltirgan taomlar
          </h2>
          <div className="space-y-2">
            {stats.topDishes.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5 text-sm"
              >
                <span>
                  <span className="mr-2 text-gold-400">{i + 1}.</span>
                  {d.name}
                  <span className="ml-2 text-xs text-muted">
                    ({d.qty} dona)
                  </span>
                </span>
                <span className="font-semibold text-gold-400">
                  {formatSom(d.revenue)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Expenses management */}
      <h2 className="mb-4 mt-10 font-display text-xl font-bold">
        Xarajatlar (chiqim)
      </h2>
      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_160px_180px_auto] sm:items-end">
          <Field label="Nomi">
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Go'sht xaridi"
            />
          </Field>
          <Field label="Summa (so'm)">
            <TextInput
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </Field>
          <Field label="Turkum">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Button onClick={addExpense} disabled={saving}>
            <Plus className="h-4 w-4" /> Qo&apos;shish
          </Button>
        </div>
      </Card>

      <div className="mt-4 space-y-2">
        {loading ? (
          <p className="text-sm text-muted">Yuklanmoqda…</p>
        ) : expenses.length === 0 ? (
          <Card className="py-10 text-center">
            <p className="text-muted">
              Hozircha xarajatlar yo&apos;q. Yuqoridan qo&apos;shing.
            </p>
          </Card>
        ) : (
          expenses.map((e) => (
            <Card key={e.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold">{e.title}</p>
                <p className="text-xs text-muted">
                  {e.category} ·{" "}
                  {new Date(e.createdAt).toLocaleDateString("uz-UZ", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-bold text-red-500">
                  −{formatSom(e.amount)}
                </span>
                <button
                  onClick={() => removeExpense(e.id)}
                  aria-label="O'chirish"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
