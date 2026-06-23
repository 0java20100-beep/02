"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { apiGet, apiSend } from "@/lib/admin-client";
import {
  PageHeader,
  Button,
  Modal,
  Field,
  inputCls,
} from "@/components/admin/ui";
import { MediaInput } from "@/components/admin/MediaInput";

interface Review {
  id: string;
  name: string;
  company: string | null;
  avatar: string | null;
  rating: number;
  text: string;
  published: boolean;
  order: number;
}

const empty = {
  name: "",
  company: "",
  avatar: null as string | null,
  rating: 5,
  text: "",
  published: true,
  order: 0,
};

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await apiGet<Review[]>("/api/reviews?all=true");
    if (res.success && res.data) setReviews(res.data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(empty);
    setError("");
    setOpen(true);
  }
  function openEdit(r: Review) {
    setEditingId(r.id);
    setForm({
      name: r.name,
      company: r.company || "",
      avatar: r.avatar,
      rating: r.rating,
      text: r.text,
      published: r.published,
      order: r.order,
    });
    setError("");
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setError("");
    const payload = { ...form, order: Number(form.order) || 0 };
    const res = editingId
      ? await apiSend(`/api/reviews/${editingId}`, "PUT", payload)
      : await apiSend("/api/reviews", "POST", payload);
    setSaving(false);
    if (!res.success) {
      setError(res.error || "Ошибка");
      return;
    }
    setOpen(false);
    load();
  }
  async function remove(id: string) {
    if (!confirm("Удалить отзыв?")) return;
    const res = await apiSend(`/api/reviews/${id}`, "DELETE");
    if (res.success) load();
  }

  return (
    <div>
      <PageHeader
        title="Отзывы"
        description="Управление отзывами клиентов."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Добавить отзыв
          </Button>
        }
      />

      {loading ? (
        <div className="grid place-items-center py-24">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass rounded-2xl py-16 text-center text-muted">
          Отзывов пока нет.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {reviews.map((r) => (
            <div key={r.id} className="glass rounded-2xl p-5">
              <div className="flex items-start gap-3">
                {r.avatar ? (
                  <Image src={r.avatar} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold">
                    {r.name.slice(0, 1)}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{r.name}</div>
                  {r.company && <div className="text-xs text-muted">{r.company}</div>}
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={i < r.rating ? "h-3.5 w-3.5 fill-primary text-primary" : "h-3.5 w-3.5 text-white/15"} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(r)} className="grid place-items-center h-8 w-8 rounded-lg glass">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(r.id)} className="grid place-items-center h-8 w-8 rounded-lg bg-red-500/10 text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted line-clamp-3">{r.text}</p>
              {!r.published && (
                <span className="mt-2 inline-block text-[0.7rem] text-amber-400">Скрыт</span>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editingId ? "Редактировать отзыв" : "Новый отзыв"}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Имя *">
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Компания">
              <input className={inputCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </Field>
          </div>
          <Field label="Аватар">
            <MediaInput value={form.avatar} onChange={(url) => setForm({ ...form, avatar: url })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Рейтинг">
              <select className={inputCls} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n} className="bg-background">{n} ★</option>
                ))}
              </select>
            </Field>
            <Field label="Порядок">
              <input type="number" className={inputCls} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Текст отзыва *">
            <textarea rows={4} className={inputCls} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
          </Field>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Опубликован
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Сохранить"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
