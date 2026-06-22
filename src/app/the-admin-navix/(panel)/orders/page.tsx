"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Phone, Mail, Send, Paperclip } from "lucide-react";
import { apiGet, apiSend } from "@/lib/admin-client";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

interface Order {
  id: string;
  name: string;
  phone: string;
  telegram: string | null;
  email: string | null;
  projectType: string;
  description: string;
  budget: string | null;
  deadline: string | null;
  files: string[];
  status: string;
  createdAt: string;
}

const STATUSES = ["NEW", "IN_PROGRESS", "CONTACTED", "DONE", "REJECTED"];

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  async function load() {
    const res = await apiGet<Order[]>(
      `/api/orders${filter ? `?status=${filter}` : ""}`
    );
    if (res.success && res.data) setOrders(res.data);
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function setStatus(id: string, status: string) {
    const res = await apiSend(`/api/orders/${id}`, "PUT", { status });
    if (res.success) load();
  }
  async function remove(id: string) {
    if (!confirm("Удалить заявку?")) return;
    const res = await apiSend(`/api/orders/${id}`, "DELETE");
    if (res.success) load();
  }

  return (
    <div>
      <PageHeader title="Заявки" description="Заявки клиентов с формы заказа." />

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("")}
          className={`rounded-full px-4 py-1.5 text-sm ${filter === "" ? "bg-gradient-to-r from-primary to-secondary text-white" : "glass text-muted"}`}
        >
          Все
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm ${filter === s ? "bg-gradient-to-r from-primary to-secondary text-white" : "glass text-muted"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid place-items-center py-24">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="glass rounded-2xl py-16 text-center text-muted">
          Заявок нет.
        </div>
      ) : (
        <div className="grid gap-3">
          {orders.map((o) => (
            <div key={o.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{o.name}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {o.projectType} · {formatDate(o.createdAt)}
                  </div>
                </div>
                <button
                  onClick={() => remove(o.id)}
                  className="grid place-items-center h-8 w-8 rounded-lg bg-red-500/10 text-red-400 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-3 text-sm text-foreground/90 whitespace-pre-wrap">
                {o.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <a href={`tel:${o.phone}`} className="inline-flex items-center gap-1 text-primary">
                  <Phone className="h-3.5 w-3.5" /> {o.phone}
                </a>
                {o.telegram && (
                  <a href={`https://t.me/${o.telegram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary">
                    <Send className="h-3.5 w-3.5" /> {o.telegram}
                  </a>
                )}
                {o.email && (
                  <a href={`mailto:${o.email}`} className="inline-flex items-center gap-1 text-primary">
                    <Mail className="h-3.5 w-3.5" /> {o.email}
                  </a>
                )}
                {o.budget && <span className="text-muted">💰 {o.budget}</span>}
                {o.deadline && <span className="text-muted">⏱ {o.deadline}</span>}
              </div>

              {o.files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {o.files.map((f, i) => (
                    <a
                      key={i}
                      href={f}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs"
                    >
                      <Paperclip className="h-3.5 w-3.5" /> Файл {i + 1}
                    </a>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(o.id, s)}
                    className={`rounded-lg px-3 py-1.5 text-xs transition ${o.status === s ? "bg-gradient-to-r from-primary to-secondary text-white" : "glass text-muted hover:text-foreground"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
