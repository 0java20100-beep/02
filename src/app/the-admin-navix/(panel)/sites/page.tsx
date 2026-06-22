"use client";

import { useEffect, useState } from "react";
import {
  UploadCloud,
  Loader2,
  Trash2,
  ExternalLink,
  FileArchive,
} from "lucide-react";
import { apiGet, apiSend, apiUpload } from "@/lib/admin-client";
import {
  PageHeader,
  Button,
  Modal,
  Field,
  inputCls,
} from "@/components/admin/ui";
import { MediaInput, MediaListInput } from "@/components/admin/MediaInput";
import { CATEGORY_LABELS, formatDate } from "@/lib/utils";

interface Site {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  coverImage: string | null;
  views: number;
  publishedAt: string;
  demoUrl: string | null;
  uploadedSite: { type: string; sizeBytes: number; entryFile: string } | null;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS);
const TYPES = ["STATIC", "REACT", "NEXTJS", "ZIP"];

export default function SitesAdminPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("LANDING_PAGE");
  const [type, setType] = useState("STATIC");
  const [technologies, setTechnologies] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    const res = await apiGet<Site[]>("/api/sites?all=true");
    if (res.success && res.data) setSites(res.data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("LANDING_PAGE");
    setType("STATIC");
    setTechnologies("");
    setCoverImage(null);
    setScreenshots([]);
    setFile(null);
    setError("");
  }

  async function submit() {
    if (!file) {
      setError("Выберите ZIP-архив");
      return;
    }
    if (!title) {
      setError("Укажите название");
      return;
    }
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    fd.append("description", description);
    fd.append("category", category);
    fd.append("type", type);
    fd.append("technologies", technologies);
    if (coverImage) fd.append("coverImage", coverImage);
    if (screenshots.length) fd.append("screenshots", screenshots.join(","));
    const res = await apiUpload("/api/sites", fd);
    setUploading(false);
    if (!res.success) {
      setError(res.error || "Ошибка загрузки");
      return;
    }
    setOpen(false);
    resetForm();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Удалить сайт и его файлы?")) return;
    const res = await apiSend(`/api/projects/${id}`, "DELETE");
    if (res.success) load();
  }

  return (
    <div>
      <PageHeader
        title="Готовые сайты"
        description="Загружайте ZIP-архивы готовых сайтов — они публикуются автоматически."
        action={
          <Button
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
          >
            <UploadCloud className="h-4 w-4" /> Загрузить сайт
          </Button>
        }
      />

      {loading ? (
        <div className="grid place-items-center py-24">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : sites.length === 0 ? (
        <div className="glass rounded-2xl py-16 text-center text-muted">
          <FileArchive className="mx-auto h-10 w-10 mb-3 text-primary/60" />
          Готовых сайтов пока нет.
        </div>
      ) : (
        <div className="grid gap-3">
          {sites.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-4 flex items-center gap-4">
              <div className="grid place-items-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary shrink-0">
                <FileArchive className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{s.title}</div>
                <div className="text-xs text-muted mt-0.5 flex flex-wrap items-center gap-3">
                  <span>{CATEGORY_LABELS[s.category]}</span>
                  <span>{s.uploadedSite?.type}</span>
                  <span>
                    {((s.uploadedSite?.sizeBytes || 0) / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <span>{formatDate(s.publishedAt)}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {s.demoUrl && (
                  <a
                    href={s.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid place-items-center h-9 w-9 rounded-lg glass card-hover"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  onClick={() => remove(s.id)}
                  className="grid place-items-center h-9 w-9 rounded-lg bg-red-500/10 text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Загрузить готовый сайт" wide>
        <div className="space-y-4">
          <Field label="ZIP-архив *" hint="HTML/CSS/JS, React или Next.js билд (до 100MB)">
            <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-dashed border-white/15 px-4 py-6 hover:border-primary/50 transition">
              <UploadCloud className="h-6 w-6 text-primary" />
              <span className="text-sm">
                {file ? file.name : "Выберите ZIP-файл"}
              </span>
              <input
                type="file"
                accept=".zip,application/zip"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Название *">
              <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Тип проекта">
              <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
                {TYPES.map((t) => (
                  <option key={t} value={t} className="bg-background">{t}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Описание">
            <textarea rows={2} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Категория">
              <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-background">{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </Field>
            <Field label="Технологии" hint="Через запятую">
              <input className={inputCls} value={technologies} onChange={(e) => setTechnologies(e.target.value)} />
            </Field>
          </div>

          <Field label="Обложка">
            <MediaInput value={coverImage} onChange={setCoverImage} />
          </Field>
          <Field label="Скриншоты">
            <MediaListInput values={screenshots} onChange={setScreenshots} />
          </Field>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={submit} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Опубликовать"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
