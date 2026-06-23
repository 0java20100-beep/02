"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2, X, Plus } from "lucide-react";
import { apiUpload } from "@/lib/admin-client";
import { inputCls } from "./ui";

async function upload(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await apiUpload<{ url: string }[]>("/api/uploads", fd);
  if (res.success && res.data && res.data[0]) return res.data[0].url;
  return null;
}

export function MediaInput({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleFile(file?: File) {
    if (!file) return;
    setLoading(true);
    const url = await upload(file);
    setLoading(false);
    if (url) onChange(url);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0">
        {value ? (
          <Image src={value} alt="" fill className="object-cover" sizes="96px" />
        ) : (
          <div className="grid h-full place-items-center text-muted text-xs">нет</div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <input
          className={inputCls}
          placeholder="URL изображения или загрузите"
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
        />
        <div className="flex gap-2">
          <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg glass px-3 py-1.5 text-xs card-hover">
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            Загрузить
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1 rounded-lg bg-red-500/10 text-red-400 px-3 py-1.5 text-xs"
            >
              <X className="h-3.5 w-3.5" /> Убрать
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MediaListInput({
  values,
  onChange,
}: {
  values: string[];
  onChange: (urls: string[]) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setLoading(true);
    const uploaded: string[] = [];
    for (const f of Array.from(files)) {
      const url = await upload(f);
      if (url) uploaded.push(url);
    }
    setLoading(false);
    onChange([...values, ...uploaded]);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((url, i) => (
          <div key={i} className="relative h-16 w-24 rounded-lg overflow-hidden border border-white/10">
            <Image src={url} alt="" fill className="object-cover" sizes="96px" />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="absolute top-0.5 right-0.5 grid place-items-center h-5 w-5 rounded-full bg-black/70 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <label className="grid place-items-center h-16 w-24 rounded-lg glass cursor-pointer card-hover text-muted">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-5 w-5" />}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
    </div>
  );
}
