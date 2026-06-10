"use client";

import { useMemo, useState } from "react";
import type { ListingFacets, ListingFilters } from "@/lib/mock-listings";

const KM_BRACKETS = [10000, 25000, 50000, 75000, 100000, 150000, 200000];
const FORMAT_KM = new Intl.NumberFormat("en-ZA");

export default function FilterBar({
  facets,
  initial,
}: {
  facets: ListingFacets;
  initial: ListingFilters;
}) {
  const [make, setMake] = useState(initial.make ?? "");

  // Models cascade from the selected make; with no make chosen, show every
  // model in inventory (prefixed by make for clarity).
  const modelOptions = useMemo(() => {
    if (make && facets.modelsByMake[make]) {
      return facets.modelsByMake[make].map((m) => ({ value: m, label: m }));
    }
    return Object.entries(facets.modelsByMake).flatMap(([mk, models]) =>
      models.map((m) => ({ value: m, label: `${mk} ${m}` })),
    );
  }, [make, facets.modelsByMake]);

  // Only offer km brackets that exist in inventory (always at least one).
  const kmOptions = KM_BRACKETS.filter(
    (b, i) => b <= facets.maxMileage || (i > 0 && KM_BRACKETS[i - 1] < facets.maxMileage),
  );

  return (
    <form method="get" className="card rounded-2xl p-4 sm:p-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <Labelled label="Make">
          <select
            name="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className={selectCls}
          >
            <option value="">Any make</option>
            {facets.makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Labelled>

        <Labelled label="Model">
          <select name="model" defaultValue={initial.model ?? ""} className={selectCls}>
            <option value="">Any model</option>
            {modelOptions.map((m) => (
              <option key={m.label} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </Labelled>

        <Labelled label="Year from">
          <select name="minYear" defaultValue={initial.minYear ?? ""} className={selectCls}>
            <option value="">Any year</option>
            {facets.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Labelled>

        <Labelled label="Max mileage">
          <select name="maxMileage" defaultValue={initial.maxMileage ?? ""} className={selectCls}>
            <option value="">Any km</option>
            {kmOptions.map((b) => (
              <option key={b} value={b}>
                Under {FORMAT_KM.format(b)} km
              </option>
            ))}
          </select>
        </Labelled>

        <Labelled label="Min price (R)">
          <input
            type="number"
            inputMode="numeric"
            name="minPrice"
            placeholder="Any"
            defaultValue={initial.minPrice ?? ""}
            className={inputCls}
          />
        </Labelled>

        <Labelled label="Max price (R)">
          <input
            type="number"
            inputMode="numeric"
            name="maxPrice"
            placeholder="Any"
            defaultValue={initial.maxPrice ?? ""}
            className={inputCls}
          />
        </Labelled>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <Labelled label="Province" inline>
            <select name="province" defaultValue={initial.province ?? ""} className={selectCls}>
              <option value="">All provinces</option>
              {facets.provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Labelled>
          <label className="flex items-center gap-2 text-sm text-[color:var(--muted)] whitespace-nowrap pt-4">
            <input
              type="checkbox"
              name="verified"
              value="1"
              defaultChecked={initial.verifiedOnly}
              className="accent-[color:var(--ink)] w-4 h-4"
            />
            Verified only
          </label>
        </div>
        <div className="flex items-center gap-3 pt-4">
          <a href="/marketplace" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)] whitespace-nowrap">
            Clear
          </a>
          <button type="submit" className="btn-primary whitespace-nowrap">
            Apply filters
          </button>
        </div>
      </div>
    </form>
  );
}

const selectCls =
  "w-full rounded-md border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--ink)]";
const inputCls = selectCls;

function Labelled({
  label,
  inline,
  children,
}: {
  label: string;
  inline?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={inline ? "block min-w-44" : "block min-w-0"}>
      <span className="text-[10px] uppercase tracking-wider text-[color:var(--muted)] font-bold">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
