"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Eye } from "lucide-react";
import { apiGet, apiSend } from "@/lib/admin-client";
import {
  PageHeader,
  Button,
  Modal,
  Field,
  inputCls,
  StatusBadge,
} from "@/components/admin/ui";
import { MediaInput, MediaListInput } from "@/components/admin/MediaInput";
import { CATEGORY_LABELS } from "@/lib/utils";

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string | null;
  category: string;
  status: string;
  technologies: string[];
  coverImage: string | null;
  screenshots: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  order: number;
  views: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogImage: string | null;
  uploadedSite: unknown;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS);
const STATUSES = ["PUBLISHED", "DRAFT", "HIDDEN"];

type FormState = Omit<Project, "id" | "views" | "uploadedSite" | "technologies"> & {
  technologies: string;
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  description: "",
  content: "",
  category: "LANDING_PAGE",
  status: "PUBLISHED",
  technologies: "",
  coverImage: null,
  screenshots: [],
  demoUrl: "",
  repoUrl: "",
  featured: false,
  order: 0,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  ogImage: null,
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await apiGet<Project[]>("/api/projects?all=true");
    if (res.success && res.data) setProjects(res.data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(p: Project) {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      title: p.title,
      description: p.description,
      content: p.content || "",
      category: p.category,
      status: p.status,
      technologies: p.technologies.join(", "),
      coverImage: p.coverImage,
      screenshots: p.screenshots,
      demoUrl: p.demoUrl || "",
      repoUrl: p.repoUrl || "",
      featured: p.featured,
      order: p.order,
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
      seoKeywords: p.seoKeywords || "",
      ogImage: p.ogImage,
    });
    setError("");
    setModalOpen(true);
  }

  async function save() {
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      technologies: form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      order: Number(form.order) || 0,
      slug: form.slug || undefined,
    };
    const res = editingId
      ? await apiSend(`/api/projects/${editingId}`, "PUT", payload)
      : await apiSend("/api/projects", "POST", payload);
    setSaving(false);
    if (!res.success) {
      setError(res.error || "Ошибка сохранения");
      return;
    }
    setModalOpen(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Удалить проект?")) return;
    const res = await apiSend(`/api/projects/${id}`, "DELETE");
    if (res.success) load();
  }

  return (
    <div>
      <PageHeader
        title="Проекты"
        description="Добавляйте, редактируйте и удаляйте проекты каталога."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Добавить проект
          </Button>
        }
      />

      {loading ? (
        <div className="grid place-items-center py-24">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="glass rounded-2xl py-16 text-center text-muted">
          Проектов пока нет. Нажмите «Добавить проект».
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="glass rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="relative h-14 w-20 rounded-lg overflow-hidden bg-white/5 shrink-0">
                {p.coverImage ? (
                  <Image src={p.coverImage} alt="" fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-muted">—</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium truncate">{p.title}</span>
                  <StatusBadge status={p.status} />
                  {p.featured && (
                    <span className="text-[0.65rem] text-primary">★ топ</span>
                  )}
                </div>
                <div className="text-xs text-muted mt-0.5 flex items-center gap-3">
                  <span>{CATEGORY_LABELS[p.category]}</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {p.views}
                  </span>
                  <span className="truncate">/{p.slug}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(p)}
                  className="grid place-items-center h-9 w-9 rounded-lg glass card-hover"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="grid place-items-center h-9 w-9 rounded-lg bg-red-500/10 text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Редактировать проект" : "Новый проект"}
        wide
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Название *">
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>
            <Field label="Slug (URL)" hint="Оставьте пустым для авто-генерации">
              <input
                className={inputCls}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Краткое описание *">
            <textarea
              rows={2}
              className={inputCls}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          <Field label="Полное описание">
            <textarea
              rows={4}
              className={inputCls}
              value={form.content || ""}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Категория">
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-background">
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Статус">
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-background">
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Порядок">
              <input
                type="number"
                className={inputCls}
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </Field>
          </div>

          <Field label="Технологии" hint="Через запятую: Next.js, React, ...">
            <input
              className={inputCls}
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Демо-ссылка">
              <input
                className={inputCls}
                value={form.demoUrl || ""}
                onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
              />
            </Field>
            <Field label="Репозиторий">
              <input
                className={inputCls}
                value={form.repoUrl || ""}
                onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Обложка">
            <MediaInput
              value={form.coverImage}
              onChange={(url) => setForm({ ...form, coverImage: url })}
            />
          </Field>

          <Field label="Скриншоты">
            <MediaListInput
              values={form.screenshots}
              onChange={(urls) => setForm({ ...form, screenshots: urls })}
            />
          </Field>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Рекомендуемый (★ топ)
          </label>

          <details className="rounded-xl border border-white/10 p-4">
            <summary className="cursor-pointer text-sm text-muted">SEO настройки</summary>
            <div className="mt-3 space-y-3">
              <Field label="SEO Title">
                <input className={inputCls} value={form.seoTitle || ""} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
              </Field>
              <Field label="SEO Description">
                <textarea rows={2} className={inputCls} value={form.seoDescription || ""} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
              </Field>
              <Field label="SEO Keywords">
                <input className={inputCls} value={form.seoKeywords || ""} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} />
              </Field>
              <Field label="OG Image">
                <MediaInput value={form.ogImage} onChange={(url) => setForm({ ...form, ogImage: url })} />
              </Field>
            </div>
          </details>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Сохранить"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
