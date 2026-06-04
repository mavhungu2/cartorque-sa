import Link from "next/link";

export const metadata = {
  title: "Listing submitted — Car Torque SA",
};

export default async function SellSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return (
    <div className="max-w-2xl mx-auto px-5 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[color:var(--accent)] text-[color:var(--ink)] text-3xl font-black mb-6">
        ✓
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Listing submitted</h1>
      <p className="mt-4 text-[color:var(--muted)]">
        Thanks — we&apos;ve received your listing. The Car Torque team will review it (usually within
        24 hours) and email you when it goes live. We may ask for photos or proof of ownership before
        approval.
      </p>
      {id && (
        <p className="mt-4 text-xs text-[color:var(--muted)]">
          Reference: <code className="font-mono">{id}</code>
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link href="/marketplace" className="btn-primary">Browse marketplace</Link>
        <Link href="/" className="btn-outline">Back to home</Link>
      </div>
    </div>
  );
}
