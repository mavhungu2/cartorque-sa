import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthorised } from "@/lib/admin-auth";
import { affordabilitySnapshot, listFinanceApplications } from "@/lib/finance";
import { setFinanceStatusAction } from "./actions";

export const metadata = { title: "Finance applications — Car Torque SA" };
export const dynamic = "force-dynamic";

const FORMAT_PRICE = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  submitted_to_bank: "At bank",
  approved: "Approved",
  declined: "Declined",
  closed: "Closed",
};

export default async function AdminFinancePage() {
  if (!(await isAdminAuthorised())) redirect("/admin/login");
  const apps = await listFinanceApplications();
  const open = apps.filter((a) => !["approved", "declined", "closed"].includes(a.status));

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Finance applications
          </h1>
          <p className="mt-2 text-[color:var(--muted)]">
            {open.length === 0
              ? "No open applications."
              : `${open.length} open application${open.length === 1 ? "" : "s"} of ${apps.length} total.`}
          </p>
        </div>
        <Link href="/admin/listings" className="btn-outline text-sm whitespace-nowrap">
          Listings queue
        </Link>
      </div>

      <ul className="mt-8 space-y-5">
        {apps.map((a) => {
          const snap = affordabilitySnapshot(a);
          return (
            <li key={a.id} className="card rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-lg">{a.fullName}</h2>
                    <span className="chip">{STATUS_LABEL[a.status] ?? a.status}</span>
                    {!snap.meetsMinIncome && (
                      <span className="chip" style={{ background: "#e10600", color: "#fff" }}>
                        Below min income
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-[color:var(--muted)] flex flex-wrap gap-x-4 gap-y-1">
                    <span>ID {a.idNumber}</span>
                    <span><a className="underline" href={`tel:${a.phone}`}>{a.phone}</a></span>
                    <span><a className="underline" href={`mailto:${a.email}`}>{a.email}</a></span>
                    <span>{new Date(a.createdAt).toLocaleString("en-ZA")}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {a.status === "new" && (
                    <StatusButton id={a.id} status="contacted" label="Mark contacted" primary />
                  )}
                  {a.status === "contacted" && (
                    <StatusButton id={a.id} status="submitted_to_bank" label="Sent to bank" primary />
                  )}
                  {a.status === "submitted_to_bank" && (
                    <>
                      <StatusButton id={a.id} status="approved" label="Approved" primary />
                      <StatusButton id={a.id} status="declined" label="Declined" />
                    </>
                  )}
                  {!["closed", "approved", "declined"].includes(a.status) && (
                    <StatusButton id={a.id} status="closed" label="Close" />
                  )}
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <Cell label="Vehicle" value={a.vehicleDescription ?? (a.listingId ? `Listing ${a.listingId}` : "—")} />
                <Cell
                  label="Price / deposit"
                  value={
                    a.purchasePriceZar
                      ? `${FORMAT_PRICE.format(a.purchasePriceZar)} / ${FORMAT_PRICE.format(a.depositZar)}`
                      : "—"
                  }
                />
                <Cell label="Term" value={`${a.preferredTermMonths} months`} />
                <Cell
                  label="Est. instalment"
                  value={snap.estInstalment ? `±${FORMAT_PRICE.format(snap.estInstalment)}/pm` : "—"}
                />
                <Cell label="Employment" value={`${a.employmentStatus}${a.employer ? ` — ${a.employer}` : ""}`} />
                <Cell label="Net income" value={FORMAT_PRICE.format(a.netMonthlyIncome)} />
                <Cell label="Expenses + credit" value={FORMAT_PRICE.format(a.monthlyExpenses + a.existingCreditCommitments)} />
                <Cell
                  label="Disposable"
                  value={`${FORMAT_PRICE.format(snap.disposable)}${snap.instalmentFits ? "" : " ⚠ tight"}`}
                />
              </div>

              {a.listingId && (
                <div className="mt-3">
                  <Link href={`/marketplace/${a.listingId}`} className="link-cta text-xs">
                    View listing →
                  </Link>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StatusButton({
  id,
  status,
  label,
  primary,
}: {
  id: string;
  status: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <form action={setFinanceStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={`${primary ? "btn-primary" : "btn-outline"} text-xs`}>
        {label}
      </button>
    </form>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[color:var(--muted)] font-bold">{label}</div>
      <div className="mt-0.5 capitalize">{value}</div>
    </div>
  );
}
