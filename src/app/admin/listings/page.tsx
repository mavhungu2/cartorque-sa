import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdminAuthorised, adminPasswordRequired } from "@/lib/admin-auth";
import { listPendingListings } from "@/lib/listings";
import { approveListingAction, rejectListingAction, adminLogoutAction } from "../actions";

export const metadata = { title: "Moderation queue — Car Torque SA" };

const FORMAT_PRICE = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});
const FORMAT_KM = new Intl.NumberFormat("en-ZA");

export default async function AdminListingsPage() {
  if (!(await isAdminAuthorised())) redirect("/admin/login");
  const passwordSet = await adminPasswordRequired();
  const pending = await listPendingListings();

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Moderation queue</h1>
          <p className="mt-2 text-[color:var(--muted)]">
            {pending.length === 0
              ? "All caught up. No listings awaiting review."
              : `${pending.length} listing${pending.length === 1 ? "" : "s"} awaiting review.`}
          </p>
        </div>
        {passwordSet ? (
          <form action={adminLogoutAction}>
            <button type="submit" className="btn-outline text-sm">
              Sign out
            </button>
          </form>
        ) : (
          <span className="chip">Open access</span>
        )}
      </div>

      {!passwordSet && (
        <div className="mt-6 card rounded-xl p-4 border-2 border-[color:var(--accent)]">
          <span className="chip">Heads up</span>
          <span className="ml-2 text-sm">
            Admin pages are unprotected because <code className="font-mono text-xs">ADMIN_PASSWORD</code> isn&apos;t
            set. Set it in <code className="font-mono text-xs">.env.local</code> before deploying.
          </span>
        </div>
      )}

      {pending.length > 0 && (
        <ul className="mt-8 space-y-6">
          {pending.map((l) => (
            <li key={l.id} className="card rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-[200px_1fr_auto] gap-4 p-5 items-start">
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-[color:var(--bg-elev)]">
                  {l.photos[0] ? (
                    <Image
                      src={l.photos[0]}
                      alt={l.title}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-[color:var(--muted)] text-xs">
                      No photo
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h2 className="font-bold text-lg leading-snug">{l.title}</h2>
                    <span className="font-black whitespace-nowrap">{FORMAT_PRICE.format(l.priceZar)}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[color:var(--muted)] font-medium">
                    <span>{l.year}</span>
                    <span>•</span>
                    <span>{FORMAT_KM.format(l.mileageKm)} km</span>
                    <span>•</span>
                    <span className="capitalize">{l.transmission}</span>
                    <span>•</span>
                    <span>{l.location}, {l.province}</span>
                  </div>
                  <p className="mt-3 text-sm text-[color:var(--fg)]/85 line-clamp-3">
                    {l.description}
                  </p>
                  <div className="mt-3 text-xs text-[color:var(--muted)] flex flex-wrap gap-x-4 gap-y-1">
                    <span>Seller: <span className="text-[color:var(--fg)] font-medium">{l.ownerName}</span></span>
                    {l.ownerEmail && (
                      <span>Email: <a href={`mailto:${l.ownerEmail}`} className="underline">{l.ownerEmail}</a></span>
                    )}
                    {l.ownerWhatsapp && <span>WhatsApp: {l.ownerWhatsapp}</span>}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 md:w-32">
                  <form action={approveListingAction} className="contents">
                    <input type="hidden" name="id" value={l.id} />
                    <button type="submit" className="btn-primary text-sm justify-center w-full">
                      Approve
                    </button>
                  </form>
                  <form action={rejectListingAction} className="contents">
                    <input type="hidden" name="id" value={l.id} />
                    <button type="submit" className="btn-outline text-sm justify-center w-full">
                      Reject
                    </button>
                  </form>
                  <Link
                    href={`/marketplace/${l.id}`}
                    className="text-xs text-[color:var(--muted)] hover:text-[color:var(--fg)] text-center"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
