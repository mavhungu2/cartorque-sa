// Server-only Firebase Admin SDK. Used in server actions and route handlers
// for privileged writes (e.g. inserting a listing from /sell).
import "server-only";
import { type App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { type Firestore, getFirestore } from "firebase-admin/firestore";

function loadCredentials() {
  // Allow either a full service-account JSON in FIREBASE_SERVICE_ACCOUNT,
  // or three discrete vars (easier to paste into Vercel / .env.local).
  const json = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (json) {
    try {
      const parsed = JSON.parse(json);
      return cert({
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key,
      });
    } catch {
      return null;
    }
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) return null;
  return cert({ projectId, clientEmail, privateKey });
}

export function adminConfigured(): boolean {
  return loadCredentials() !== null;
}

/**
 * Demo/mock data may only ever appear in local development. In production a
 * missing/broken Firebase config must surface as empty results (and errors on
 * writes), never as demo content silently rendered to real users — this bit us
 * when the build-time prerender ran without build-stage secrets.
 */
export function useMockData(): boolean {
  return !adminConfigured() && process.env.NODE_ENV !== "production";
}

export function getAdminApp(): App | null {
  if (getApps().length) return getApp();
  const credential = loadCredentials();
  if (!credential) return null;
  const storageBucket =
    process.env.FIREBASE_STORAGE_BUCKET ??
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  return initializeApp({ credential, storageBucket });
}

export function getAdminDb(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

/**
 * Firestore rejects `undefined` values outright. Optional form fields arrive
 * as undefined, so strip them before any write. (We avoid the
 * `ignoreUndefinedProperties` setting because settings() may only be called
 * once per instance — fragile with Next.js dev hot-reload.)
 */
export function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as T;
}
