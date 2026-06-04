import Link from "next/link";
import { redirect } from "next/navigation";
import { adminLoginAction } from "../actions";
import { adminPasswordRequired, isAdminAuthorised } from "@/lib/admin-auth";

export const metadata = { title: "Admin login — Car Torque SA" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthorised()) redirect("/admin/listings");
  const passwordSet = await adminPasswordRequired();
  const { error } = await searchParams;

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <span className="eyebrow">Staff only</span>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Admin login</h1>

      {!passwordSet ? (
        <div className="mt-6 card rounded-xl p-5 border-2 border-[color:var(--accent)]">
          <div className="font-semibold">No ADMIN_PASSWORD set.</div>
          <p className="text-sm text-[color:var(--muted)] mt-2">
            For local dev, the admin pages are open. Set <code className="font-mono text-xs">ADMIN_PASSWORD</code>{" "}
            in <code className="font-mono text-xs">.env.local</code> to require a password.
          </p>
          <Link href="/admin/listings" className="btn-primary mt-4">
            Continue to admin
          </Link>
        </div>
      ) : (
        <form action={adminLoginAction} className="mt-6 card rounded-xl p-5 space-y-4">
          {error && (
            <div className="text-sm text-[color:var(--accent-2)] font-semibold">
              Incorrect password.
            </div>
          )}
          <label className="block">
            <span className="text-xs uppercase tracking-wider font-bold text-[color:var(--muted)]">
              Password
            </span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="mt-1.5 w-full rounded-md border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--ink)]"
            />
          </label>
          <button type="submit" className="btn-primary w-full justify-center">
            Sign in
          </button>
        </form>
      )}
    </div>
  );
}
