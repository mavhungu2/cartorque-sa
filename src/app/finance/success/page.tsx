import Link from "next/link";

export const metadata = { title: "Application received — Car Torque SA" };

export default async function FinanceSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return (
    <div className="max-w-2xl mx-auto px-5 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[color:var(--accent)] text-[color:var(--ink)] text-3xl font-black mb-6">
        ✓
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Application received</h1>
      <p className="mt-4 text-[color:var(--muted)]">
        Thanks — your pre-approval application is in. The Car Torque team will submit it to our
        finance partners and contact you with your options, usually within 24–48 hours. Keep your
        ID, payslips and proof of residence handy.
      </p>
      {ref && (
        <p className="mt-4 text-xs text-[color:var(--muted)]">
          Reference: <code className="font-mono">{ref}</code>
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link href="/marketplace" className="btn-primary">Keep browsing cars</Link>
        <Link href="/" className="btn-outline">Back to home</Link>
      </div>
    </div>
  );
}
