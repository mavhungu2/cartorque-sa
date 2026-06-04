import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/lib/listings";

const FORMAT_PRICE = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});
const FORMAT_KM = new Intl.NumberFormat("en-ZA");

export default function ListingCard({ listing }: { listing: Listing }) {
  const photo = listing.photos[0];
  return (
    <Link href={`/marketplace/${listing.id}`} className="card rounded-xl overflow-hidden block group">
      <div className="aspect-[4/3] relative bg-[color:var(--bg-elev)] overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-[color:var(--muted)] text-sm">
            No photo
          </div>
        )}
        {listing.verified === "fully_verified" && (
          <span className="absolute top-3 left-3 chip" style={{ background: "#ffd400" }}>
            ✓ Reviewed
          </span>
        )}
        {listing.verified === "vin_checked" && (
          <span className="absolute top-3 left-3 chip">VIN verified</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="font-semibold leading-snug">{listing.title}</div>
          <div className="text-[color:var(--ink)] font-black whitespace-nowrap">
            {FORMAT_PRICE.format(listing.priceZar)}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[color:var(--muted)] font-medium">
          <span>{listing.year}</span>
          <span>•</span>
          <span>{FORMAT_KM.format(listing.mileageKm)} km</span>
          <span>•</span>
          <span className="capitalize">{listing.transmission}</span>
          <span>•</span>
          <span>{listing.location}</span>
        </div>
      </div>
    </Link>
  );
}
