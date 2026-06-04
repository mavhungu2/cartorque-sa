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

export function getAdminApp(): App | null {
  if (getApps().length) return getApp();
  const credential = loadCredentials();
  if (!credential) return null;
  return initializeApp({ credential });
}

export function getAdminDb(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}
