// Minimal cookie-based gate for /admin pages.
// MVP-grade: a single ADMIN_PASSWORD env var. Replace with Firebase Auth + role
// claims in Phase 2.
import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "ct_admin";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function expectedToken(): string | null {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) return null;
  // We don't store the password directly — just a deterministic token derived from it.
  // Good enough for an MVP gate; in production we'd use Firebase Auth.
  return Buffer.from(pwd).toString("base64");
}

export async function isAdminAuthorised(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) {
    // No password configured → allow in dev (the page renders a banner).
    return true;
  }
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === expected;
}

export async function adminPasswordRequired(): Promise<boolean> {
  return expectedToken() !== null;
}

export async function loginAdmin(password: string): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return true;
  const provided = Buffer.from(password).toString("base64");
  if (provided !== expected) return false;
  const store = await cookies();
  store.set(COOKIE_NAME, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return true;
}

export async function logoutAdmin(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
