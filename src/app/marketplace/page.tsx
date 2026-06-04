import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import {
  listLiveListings,
  type ListingFilters,
  MAKES,
  PROVINCES,
} from "@/lib/listings";

export const metadata = {
  title: "Marketplace — Car Torque SA",
  description:
    "Honest South African car listings. Browse private cars for sale — every listing reviewed by Car Torque SA.",
};

function parseNumber(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v.replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const filters: ListingFilters = {
    make: sp.make,
    minPrice: parseNumber(sp.minPrice),
    maxPrice: parseNumber(sp.maxPrice),
    minYear: parseNumber(sp.minYear),
    maxYear: parseNumber(sp.maxYear),
    maxMileage: parseNumber(sp.maxMileage),
    province: sp.province,
    verifiedOnly: sp.verified === "1",
  };

  const listings = await listLiveListings(filters);
  const activeFilters = Object.entries(filters).filter(([, v]) => v !== undefined && v !== false);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">Marketplace</span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Cars for sale</h1>
          <Link href="/sell" className="btn-primary self-start md:self-auto">
            + Sell my car
          </Link>
        </div>
        <p className="text-[color:var(--muted)] max-w-2xl">
          Honest private car listings from across South Africa. Every listing is screened by the
          Car Torque team — and selected ones get a full video review on the channel.
        </p>
      </div>

      <form
        method="get"
        className="mt-10 grid gap-3 md:grid-cols-[180px_1fr_1fr_1fr_1fr_1fr_auto] card rounded-2xl p-4"
      >
        <Select name="make" defaultValue={filters.make ?? ""} placeholder="Any make">
          {MAKES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
        <NumberInput name="minPrice" defaultValue={filters.minPrice} placeholder="Min price (R)" />
        <NumberInput name="maxPrice" defaultValue={filters.maxPrice} placeholder="Max price (R)" />
        <NumberInput name="minYear" defaultValue={filters.minYear} placeholder="Year from" />
        <NumberInput name="maxMileage" defaultValue={filters.maxMileage} placeholder="Max km" />
        <Select name="province" defaultValue={filters.province ?? ""} placeholder="Any province">
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
        <button type="submit" className="btn-primary justify-center">Apply</button>
        <label className="md:col-span-7 flex items-center gap-2 text-sm text-[color:var(--muted)]">
          <input
            type="checkbox"
            name="verified"
            value="1"
            defaultChecked={filters.verifiedOnly}
            className="accent-[color:var(--ink)]"
          />
          Verified listings only
        </label>
      </form>

      <div className="mt-6 flex items-center justify-between gap-3 text-sm text-[color:var(--muted)]">
        <div>
          {listings.length} {listings.length === 1 ? "listing" : "listings"}
          {activeFilters.length > 0 && (
            <>
              {" — "}
              <Link href="/marketplace" className="underline">
                Clear filters
              </Link>
            </>
          )}
        </div>
      </div>

      {listings.length > 0 ? (
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      ) : (
        <div className="mt-10 card rounded-xl p-10 text-center">
          <div className="text-lg font-semibold">No cars match those filters.</div>
          <p className="text-[color:var(--muted)] mt-2">Try widening the criteria or clearing filters.</p>
        </div>
      )}
    </div>
  );
}

function NumberInput({
  name,
  placeholder,
  defaultValue,
}: {
  name: string;
  placeholder: string;
  defaultValue?: number;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue ?? ""}
      className="rounded-md border border-[color:var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--ink)]"
    />
  );
}

function Select({
  name,
  placeholder,
  defaultValue,
  children,
}: {
  name: string;
  placeholder: string;
  defaultValue: string;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="rounded-md border border-[color:var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--ink)]"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  );
}
