import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing } from "@/lib/listings";

const FORMAT_PRICE = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});
const FORMAT_KM = new Intl.NumberFormat("en-ZA");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return { title: "Listing not found — Car Torque SA" };
  return {
    title: `${listing.title} — Car Torque SA`,
    description: listing.description.slice(0, 160),
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const specs: Array<[string, string]> = [
    ["Year", String(listing.year)],
    ["Mileage", `${FORMAT_KM.format(listing.mileageKm)} km`],
    ["Transmission", listing.transmission],
    ["Fuel", listing.fuelType],
    ...(listing.bodyType ? [["Body", listing.bodyType] as [string, string]] : []),
    ...(listing.color ? [["Colour", listing.color] as [string, string]] : []),
    ["Location", `${listing.location}, ${listing.province}`],
  ];

  const verifiedLabel =
    listing.verified === "fully_verified"
      ? "Reviewed by Car Torque"
      : listing.verified === "vin_checked"
        ? "VIN verified"
        : null;

  return (
    <article className="max-w-5xl mx-auto px-5 py-10">
      <Link
        href="/marketplace"
        className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)] font-semibold"
      >
        ← Back to marketplace
      </Link>

      <header className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="eyebrow">Listing</span>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            {listing.title}
          </h1>
          <div className="mt-3 text-sm text-[color:var(--muted)] font-medium flex flex-wrap gap-x-3 gap-y-1">
            <span>{listing.year}</span>
            <span>•</span>
            <span>{FORMAT_KM.format(listing.mileageKm)} km</span>
            <span>•</span>
            <span className="capitalize">{listing.transmission}</span>
            <span>•</span>
            <span>{listing.location}</span>
            {verifiedLabel && (
              <>
                <span>•</span>
                <span className="chip">✓ {verifiedLabel}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right md:text-left">
          <div className="text-4xl font-black tracking-tight">
            {FORMAT_PRICE.format(listing.priceZar)}
          </div>
          <div className="text-xs text-[color:var(--muted)] mt-1">
            {listing.negotiable ? "Negotiable" : "Firm"}
          </div>
        </div>
      </header>

      <section className="mt-8 grid md:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-3">
          {listing.photos[0] ? (
            <div className="card rounded-2xl overflow-hidden">
              <div className="aspect-[16/10] relative bg-black">
                <Image
                  src={listing.photos[0]}
                  alt={listing.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          ) : (
            <div className="card rounded-2xl aspect-[16/10] grid place-items-center text-[color:var(--muted)]">
              No photo available
            </div>
          )}
          {listing.photos.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {listing.photos.slice(1, 5).map((src, i) => (
                <div key={i} className="card rounded-lg overflow-hidden aspect-[4/3] relative">
                  <Image
                    src={src}
                    alt={`${listing.title} photo ${i + 2}`}
                    fill
                    sizes="(max-width: 768px) 25vw, 16vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {listing.videoReviewUrl && (
            <div className="card rounded-2xl overflow-hidden">
              <div className="bg-[color:var(--ink)] px-4 py-2 text-[color:var(--accent)] text-xs uppercase font-bold tracking-wider">
                Car Torque video review
              </div>
              <div className="aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${listing.videoReviewUrl}`}
                  title={`Car Torque review of ${listing.title}`}
                  className="w-full h-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-[color:var(--muted)] font-bold mb-3">
              Seller
            </div>
            <div className="font-semibold text-lg">{listing.ownerName}</div>
            <div className="text-sm text-[color:var(--muted)] mt-1">
              {listing.location}, {listing.province}
            </div>
            <div className="mt-4 space-y-2">
              {listing.ownerWhatsapp && (
                <a
                  href={`https://wa.me/${listing.ownerWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hi, I saw your ${listing.title} on Car Torque SA — is it still available?`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full justify-center"
                >
                  Message on WhatsApp
                </a>
              )}
              {listing.ownerPhone && (
                <a href={`tel:${listing.ownerPhone}`} className="btn-outline w-full justify-center">
                  Call seller
                </a>
              )}
              {!listing.ownerWhatsapp && !listing.ownerPhone && listing.ownerEmail && (
                <a href={`mailto:${listing.ownerEmail}`} className="btn-outline w-full justify-center">
                  Email seller
                </a>
              )}
            </div>
            <p className="text-xs text-[color:var(--muted)] mt-4">
              Always meet in a safe public place. Never pay before seeing the car and original
              NaTIS papers. Car Torque SA does not hold buyer funds — see safety tips below.
            </p>
          </div>

          <div className="card rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-[color:var(--muted)] font-bold mb-3">
              Specs
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {specs.map(([label, value]) => (
                <div key={label} className="flex flex-col">
                  <dt className="text-[color:var(--muted)] text-xs uppercase tracking-wide">{label}</dt>
                  <dd className="capitalize">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>

      <section className="mt-10 card rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold">About this car</h2>
        <p className="mt-3 text-[color:var(--fg)]/85 leading-relaxed whitespace-pre-line">
          {listing.description}
        </p>
      </section>

      <section className="mt-8 card rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold">Safety tips before you buy</h2>
        <ul className="mt-3 text-[color:var(--muted)] text-sm space-y-2 list-disc pl-5">
          <li>Always inspect the car in person before paying anything.</li>
          <li>
            Verify the VIN against the original NaTIS / registration papers — they should match
            exactly.
          </li>
          <li>Use a bank transfer, not cash. Never use a payment app the seller suggests.</li>
          <li>
            Be wary of any &quot;escrow&quot; service that isn&apos;t Car Torque SA — fake escrow
            sites are the #1 scam in SA private car sales.
          </li>
          <li>
            For peace of mind, request a paid Car Torque verification — VIN + NaTIS + on-the-ground
            inspection. <Link href="/contact" className="link-cta">Get in touch</Link>.
          </li>
        </ul>
      </section>
    </article>
  );
}
