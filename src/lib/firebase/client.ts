// Browser-side Firebase client. Lazy-initialised so that pages which don't need
// Firebase (or run with env vars missing) still render.
import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { type Firestore, getFirestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function firebaseConfigured(): boolean {
  return Boolean(config.apiKey && config.projectId);
}

export function getClientApp(): FirebaseApp | null {
  if (!firebaseConfigured()) return null;
  return getApps().length ? getApp() : initializeApp(config);
}

export function getClientDb(): Firestore | null {
  const app = getClientApp();
  return app ? getFirestore(app) : null;
}
