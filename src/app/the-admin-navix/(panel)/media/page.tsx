"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, Trash2, Copy, Check } from "lucide-react";
import { apiGet, apiSend, apiUpload } from "@/lib/admin-client";
import { PageHeader } from "@/components/admin/ui";

interface Media {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

export default function MediaAdminPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function load() {
    const res = await apiGet<Media[]>("/api/uploads");
    if (res.success && res.data) setMedia(res.data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("file", f));
    await apiUpload("/api/uploads", fd);
    setUploading(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Удалить файл?")) return;
    const res = await apiSend(`/api/uploads/${id}`, "DELETE");
    if (res.success) load();
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div>
      <PageHeader
        title="Медиа"
        description="Библиотека изображений. Загрузка с авто-оптимизацией в WebP."
        action={
          <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary btn-glow">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            Загрузить
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </label>
        }
      />

      {loading ? (
        <div className="grid place-items-center py-24">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : media.length === 0 ? (
        <div className="glass rounded-2xl py-16 text-center text-muted">
          Файлов пока нет.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((m) => (
            <div key={m.id} className="glass rounded-2xl overflow-hidden group">
              <div className="relative aspect-square bg-white/5">
                <Image src={m.url} alt={m.filename} fill className="object-cover" sizes="200px" />
              </div>
              <div className="p-2">
                <div className="text-[0.7rem] truncate text-muted">{m.filename}</div>
                <div className="text-[0.65rem] text-muted">{(m.sizeBytes / 1024).toFixed(0)} KB</div>
                <div className="flex gap-1.5 mt-2">
                  <button onClick={() => copy(m.url)} className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg glass py-1.5 text-[0.7rem]">
                    {copied === m.url ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    URL
                  </button>
                  <button onClick={() => remove(m.id)} className="grid place-items-center h-7 w-7 rounded-lg bg-red-500/10 text-red-400">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
