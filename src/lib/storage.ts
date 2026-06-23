import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import AdmZip from "adm-zip";
import { put, del, list } from "@vercel/blob";

// When BLOB_READ_WRITE_TOKEN is set (Vercel production) we use Vercel Blob.
// Otherwise fall back to local filesystem (Docker / self-host).
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

const PUBLIC_DIR = path.join(process.cwd(), "public");
export const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");
export const SITES_DIR = path.join(PUBLIC_DIR, "sites");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ALLOWED_MEDIA = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
}

export interface SavedMedia {
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}

export async function saveMediaFile(file: File): Promise<SavedMedia> {
  if (!ALLOWED_MEDIA.has(file.type)) {
    throw new Error(`Недопустимый тип файла: ${file.type}`);
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const base = safeName(file.name.replace(/\.[^.]+$/, "")) || "file";
  const stamp = Date.now();

  if (file.type === "image/svg+xml") {
    const filename = `${base}-${stamp}.svg`;
    if (USE_BLOB) {
      const blob = await put(`uploads/${filename}`, buffer, {
        access: "public",
        contentType: "image/svg+xml",
      });
      return {
        url: blob.url,
        filename,
        mimeType: "image/svg+xml",
        sizeBytes: buffer.length,
      };
    }
    await ensureDir(UPLOADS_DIR);
    await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);
    return {
      url: `/uploads/${filename}`,
      filename,
      mimeType: "image/svg+xml",
      sizeBytes: buffer.length,
    };
  }

  // Raster images: optimize to webp
  const filename = `${base}-${stamp}.webp`;
  const image = sharp(buffer).rotate();
  const meta = await image.metadata();
  const out = await image
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  if (USE_BLOB) {
    const blob = await put(`uploads/${filename}`, out, {
      access: "public",
      contentType: "image/webp",
    });
    return {
      url: blob.url,
      filename,
      mimeType: "image/webp",
      sizeBytes: out.length,
      width: meta.width,
      height: meta.height,
    };
  }

  await ensureDir(UPLOADS_DIR);
  await fs.writeFile(path.join(UPLOADS_DIR, filename), out);
  return {
    url: `/uploads/${filename}`,
    filename,
    mimeType: "image/webp",
    sizeBytes: out.length,
    width: meta.width,
    height: meta.height,
  };
}

export interface ExtractedSite {
  storagePath: string; // relative path or blob URL prefix
  entryFile: string;
  sizeBytes: number;
  demoUrl: string; // full demo URL (blob URL or relative path)
}

// Extracts a ZIP archive of a static/built site.
// On Vercel: uploads each file to Blob storage.
// On Docker/self-host: writes to /public/sites/<slug>.
export async function extractZipSite(
  buffer: Buffer,
  slug: string
): Promise<ExtractedSite> {
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();

  // Detect a common top-level folder (e.g. dist/ or build/) to flatten.
  const topDirs = new Set<string>();
  let hasRootIndex = false;
  for (const e of entries) {
    if (e.entryName.startsWith("__MACOSX")) continue;
    const parts = e.entryName.split("/").filter(Boolean);
    if (parts.length === 1 && !e.isDirectory) {
      if (parts[0].toLowerCase() === "index.html") hasRootIndex = true;
    }
    if (parts.length > 1) topDirs.add(parts[0]);
  }
  const singleTop =
    !hasRootIndex && topDirs.size === 1 ? [...topDirs][0] : null;

  let total = 0;
  let entryFileUrl = "";

  if (USE_BLOB) {
    // Upload each file to Vercel Blob under sites/<slug>/
    for (const e of entries) {
      if (e.isDirectory) continue;
      if (e.entryName.startsWith("__MACOSX")) continue;
      if (e.entryName.includes("..")) continue;
      let rel = e.entryName;
      if (singleTop && rel.startsWith(singleTop + "/")) {
        rel = rel.slice(singleTop.length + 1);
      }
      if (!rel) continue;
      const data = e.getData();
      total += data.length;

      const blobPath = `sites/${slug}/${rel}`;
      const contentType = getContentType(rel);
      const blob = await put(blobPath, data, {
        access: "public",
        contentType,
      });

      // Track the entry file URL
      const lower = rel.toLowerCase();
      if (
        !entryFileUrl &&
        (lower === "index.html" || lower === "index.htm" || lower === "200.html")
      ) {
        entryFileUrl = blob.url;
      }
    }

    // If no entry file found, use the first HTML file or just the prefix
    if (!entryFileUrl) {
      // List blobs under the prefix to find any html file
      const listResult = await list({ prefix: `sites/${slug}/` });
      for (const b of listResult.blobs) {
        if (b.pathname.endsWith(".html")) {
          entryFileUrl = b.url;
          break;
        }
      }
    }

    const entryFile = "index.html";
    return {
      storagePath: `sites/${slug}`,
      entryFile,
      sizeBytes: total,
      demoUrl: entryFileUrl || `sites/${slug}/index.html`,
    };
  }

  // Local filesystem fallback
  const targetDir = path.join(SITES_DIR, slug);
  await fs.rm(targetDir, { recursive: true, force: true });
  await ensureDir(targetDir);

  for (const e of entries) {
    if (e.isDirectory) continue;
    if (e.entryName.startsWith("__MACOSX")) continue;
    if (e.entryName.includes("..")) continue;
    let rel = e.entryName;
    if (singleTop && rel.startsWith(singleTop + "/")) {
      rel = rel.slice(singleTop.length + 1);
    }
    if (!rel) continue;
    const dest = path.join(targetDir, rel);
    if (!dest.startsWith(targetDir)) continue;
    await ensureDir(path.dirname(dest));
    const data = e.getData();
    await fs.writeFile(dest, data);
    total += data.length;
  }

  // Find an entry file.
  const candidates = ["index.html", "index.htm", "200.html"];
  let entryFile = "index.html";
  for (const c of candidates) {
    try {
      await fs.access(path.join(targetDir, c));
      entryFile = c;
      break;
    } catch {
      /* keep searching */
    }
  }

  return {
    storagePath: `/sites/${slug}`,
    entryFile,
    sizeBytes: total,
    demoUrl: `/sites/${slug}/${entryFile}`,
  };
}

export async function deleteSite(slug: string) {
  if (USE_BLOB) {
    // Delete all blobs under the site prefix
    const listResult = await list({ prefix: `sites/${slug}/` });
    if (listResult.blobs.length > 0) {
      await del(listResult.blobs.map((b) => b.url));
    }
    return;
  }
  const targetDir = path.join(SITES_DIR, slug);
  await fs.rm(targetDir, { recursive: true, force: true });
}

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".html": "text/html",
    ".htm": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".xml": "application/xml",
    ".txt": "text/plain",
    ".pdf": "application/pdf",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
  };
  return map[ext] || "application/octet-stream";
}

export { IMAGE_EXT };
