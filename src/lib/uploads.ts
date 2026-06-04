// Photo upload helper. Writes to Firebase Storage when configured;
// otherwise stores under /public/uploads/ for local dev. Returns public URLs.
import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { adminConfigured, getAdminApp } from "./firebase/admin";
import { getStorage } from "firebase-admin/storage";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per photo
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export type UploadedPhoto = { url: string; key: string };

export async function uploadListingPhotos(files: File[]): Promise<UploadedPhoto[]> {
  const valid = files.filter((f) => f && f.size > 0 && f.size <= MAX_BYTES && ALLOWED.has(f.type));
  if (valid.length === 0) return [];

  if (adminConfigured()) {
    return uploadToFirebaseStorage(valid);
  }
  return uploadToPublicDir(valid);
}

async function uploadToFirebaseStorage(files: File[]): Promise<UploadedPhoto[]> {
  const app = getAdminApp();
  if (!app) return [];
  const bucket = getStorage(app).bucket();
  const out: UploadedPhoto[] = [];
  for (const file of files) {
    const ext = file.type.split("/")[1] ?? "jpg";
    const key = `listings/${randomUUID()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const obj = bucket.file(key);
    await obj.save(buf, { contentType: file.type, public: true });
    out.push({ key, url: `https://storage.googleapis.com/${bucket.name}/${key}` });
  }
  return out;
}

async function uploadToPublicDir(files: File[]): Promise<UploadedPhoto[]> {
  // Local-dev fallback. Production hosts (Vercel, Firebase App Hosting / Cloud Run)
  // mount a read-only filesystem, so writeFile will throw — in that case we
  // silently skip uploads. The listing still saves; the seller just has no photos
  // until Firebase Storage is wired up.
  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const out: UploadedPhoto[] = [];
    for (const file of files) {
      const ext = file.type.split("/")[1] ?? "jpg";
      const filename = `${randomUUID()}.${ext}`;
      const buf = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(dir, filename), buf);
      out.push({ key: filename, url: `/uploads/${filename}` });
    }
    return out;
  } catch (err) {
    console.warn(
      "[uploads] Local filesystem upload failed (read-only fs?). Skipping photos. " +
        "Configure Firebase Storage to enable uploads in production.",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}
