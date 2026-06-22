"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { apiGet, apiSend } from "@/lib/admin-client";
import {
  PageHeader,
  Button,
  Modal,
  Field,
  inputCls,
} from "@/components/admin/ui";
import { ContactIcon } from "@/components/ui/ContactIcon";

interface Contact {
  id: string;
  type: string;
  label: string;
  value: string;
  icon: string | null;
  order: number;
  visible: boolean;
}

const TYPES = [
  "telegram",
  "telegram_bot",
  "instagram",
  "email",
  "phone",
  "card",
  "address",
  "custom",
];

const empty = {
  type: "telegram",
  label: "",
  value: "",
  icon: "",
  order: 0,
  visible: true,
};

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await apiGet<Contact[]>("/api/contacts?all=true");
    if (res.success && res.data) setContacts(res.data);
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
  function openEdit(c: Contact) {
    setEditingId(c.id);
    setForm({
      type: c.type,
      label: c.label,
      value: c.value,
      icon: c.icon || "",
      order: c.order,
      visible: c.visible,
    });
    setError("");
    setOpen(true);
  }
  async function save() {
    setSaving(true);
    setError("");
    const payload = { ...form, order: Number(form.order) || 0, icon: form.icon || null };
    const res = editingId
      ? await apiSend(`/api/contacts/${editingId}`, "PUT", payload)
      : await apiSend("/api/contacts", "POST", payload);
    setSaving(false);
    if (!res.success) {
      setError(res.error || "Ошибка");
      return;
    }
    setOpen(false);
    load();
  }
  async function remove(id: string) {
    if (!confirm("Удалить контакт?")) return;
    const res = await apiSend(`/api/contacts/${id}`, "DELETE");
    if (res.success) load();
  }

  return (
    <div>
      <PageHeader
        title="Контакты"
        description="Управление контактами: Telegram, Instagram, телефон, карта и др."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Добавить контакт
          </Button>
        }
      />

      {loading ? (
        <div className="grid place-items-center py-24">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {contacts.map((c) => (
            <div key={c.id} className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="grid place-items-center h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary shrink-0">
                <ContactIcon type={c.type} icon={c.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{c.label}</div>
                <div className="text-xs text-muted truncate">{c.value}</div>
              </div>
              {!c.visible && <span className="text-[0.65rem] text-amber-400">скрыт</span>}
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(c)} className="grid place-items-center h-8 w-8 rounded-lg glass">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => remove(c.id)} className="grid place-items-center h-8 w-8 rounded-lg bg-red-500/10 text-red-400">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editingId ? "Редактировать контакт" : "Новый контакт"}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Тип">
              <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPES.map((t) => (
                  <option key={t} value={t} className="bg-background">{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Иконка" hint="напр. send, mail, phone, card">
              <input className={inputCls} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </Field>
          </div>
          <Field label="Название *">
            <input className={inputCls} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          </Field>
          <Field label="Значение *" hint="@username, номер, ссылка, номер карты и т.д.">
            <input className={inputCls} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </Field>
          <div className="flex items-center gap-6">
            <Field label="Порядок">
              <input type="number" className={inputCls} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </Field>
            <label className="inline-flex items-center gap-2 text-sm mt-5">
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />
              Показывать на сайте
            </label>
          </div>

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
