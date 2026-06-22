import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import AdmZip from "adm-zip";

// Storage lives under /public so files are served statically.
// NOTE: on serverless platforms (Vercel) the filesystem is ephemeral —
// for production uploads use an object store (S3 / Vercel Blob) and point
// UPLOAD_BASE at a mounted volume. For Docker/self-host this works as-is.
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
  await ensureDir(UPLOADS_DIR);
  const buffer = Buffer.from(await file.arrayBuffer());
  const base = safeName(file.name.replace(/\.[^.]+$/, "")) || "file";
  const stamp = Date.now();

  // SVG: store as-is (sanitized name). Raster: optimize to webp.
  if (file.type === "image/svg+xml") {
    const filename = `${base}-${stamp}.svg`;
    await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);
    return {
      url: `/uploads/${filename}`,
      filename,
      mimeType: "image/svg+xml",
      sizeBytes: buffer.length,
    };
  }

  const filename = `${base}-${stamp}.webp`;
  const image = sharp(buffer).rotate();
  const meta = await image.metadata();
  const out = await image
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
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
  storagePath: string; // relative public path, e.g. /sites/<slug>
  entryFile: string;
  sizeBytes: number;
}

// Extracts a ZIP archive of a static/built site into /public/sites/<slug>.
export async function extractZipSite(
  buffer: Buffer,
  slug: string
): Promise<ExtractedSite> {
  const targetDir = path.join(SITES_DIR, slug);
  await fs.rm(targetDir, { recursive: true, force: true });
  await ensureDir(targetDir);

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
  for (const e of entries) {
    if (e.isDirectory) continue;
    if (e.entryName.startsWith("__MACOSX")) continue;
    if (e.entryName.includes("..")) continue; // zip-slip guard
    let rel = e.entryName;
    if (singleTop && rel.startsWith(singleTop + "/")) {
      rel = rel.slice(singleTop.length + 1);
    }
    if (!rel) continue;
    const dest = path.join(targetDir, rel);
    if (!dest.startsWith(targetDir)) continue; // zip-slip guard
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
  };
}

export async function deleteSite(slug: string) {
  const targetDir = path.join(SITES_DIR, slug);
  await fs.rm(targetDir, { recursive: true, force: true });
}

export { IMAGE_EXT };
