import Link from "next/link";
import VideoCard from "@/components/VideoCard";
import ListingCard from "@/components/ListingCard";
import { CHANNEL, FEATURED_VIDEOS, POSTS } from "@/lib/data";
import { listLiveListings } from "@/lib/listings";
import { buildListingFacets } from "@/lib/mock-listings";

// Refresh the featured listings every 60s so newly-approved cars show up.
export const revalidate = 60;

export default async function Home() {
  const allListings = await listLiveListings();
  const facets = buildListingFacets(allListings);
  const featuredListings = allListings.slice(0, 6);
  const verifiedCount = allListings.filter((l) => l.verified !== "unverified").length;
  const provinceCount = facets.provinces.length;
  const latestPosts = POSTS.slice(0, 2);

  return (
    <div className="flex flex-col">
      {/* HERO — marketplace-first */}
      <section className="hero-grad border-b border-[color:var(--border)]">
        <div className="max-w-6xl mx-auto px-5 pt-16 pb-12 md:pt-24 md:pb-16">
          <span className="eyebrow">Honest motoring marketplace</span>
          <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight leading-[1.02] max-w-4xl">
            Find your next car.{" "}
            <span className="relative inline-block">
              <span
                className="absolute inset-x-[-4px] bottom-[6px] h-[14px] bg-[color:var(--accent)] -z-0"
                aria-hidden
              />
              <span className="relative z-10">Or sell yours.</span>
            </span>
          </h1>
          <p className="mt-5 text-lg text-[color:var(--muted)] max-w-2xl">
            Private South African car listings, screened by the Car Torque team. Selected cars get a
            full video review on our channel — the only place editorial honesty meets the classifieds.
          </p>

          {/* Inline search */}
          <form
            method="get"
            action="/marketplace"
            className="mt-8 card rounded-2xl p-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] max-w-4xl"
          >
            <select
              name="make"
              defaultValue=""
              className="rounded-md border border-[color:var(--border)] bg-white px-3 py-3 text-sm focus:outline-none focus:border-[color:var(--ink)]"
            >
              <option value="">Any make</option>
              {facets.makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              name="province"
              defaultValue=""
              className="rounded-md border border-[color:var(--border)] bg-white px-3 py-3 text-sm focus:outline-none focus:border-[color:var(--ink)]"
            >
              <option value="">Any province</option>
              {facets.provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              type="number"
              inputMode="numeric"
              name="maxPrice"
              placeholder="Max price (R)"
              className="rounded-md border border-[color:var(--border)] bg-white px-3 py-3 text-sm focus:outline-none focus:border-[color:var(--ink)]"
            />
            <button type="submit" className="btn-primary justify-center">
              Search cars
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href="/sell" className="btn-outline">
              + Sell my car
            </Link>
            <span className="text-sm text-[color:var(--muted)]">
              Free to list — every listing screened.
            </span>
          </div>

          {/* Stats */}
          <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
            <Stat label="Cars live" value={allListings.length > 0 ? String(allListings.length) : "0"} />
            <Stat label="Verified" value={verifiedCount > 0 ? String(verifiedCount) : "0"} />
            <Stat label="Provinces" value={String(provinceCount || 9)} />
            <Stat label="Video reviews" value="On the channel" />
          </dl>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      {featuredListings.length > 0 && (
        <section className="max-w-6xl mx-auto w-full px-5 py-16">
          <SectionHeader
            eyebrow="Latest on the marketplace"
            title="Cars you can buy right now"
            href="/marketplace"
            hrefLabel="See all cars"
          />
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {/* WHY CAR TORQUE — trust signals */}
      <section className="bg-[color:var(--ink)] text-white">
        <div className="stripe-divider" aria-hidden />
        <div className="max-w-6xl mx-auto w-full px-5 py-16">
          <div className="max-w-3xl">
            <span className="eyebrow" style={{ color: "#ffffff" }}>
              Why Car Torque
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              Honest listings. Honest reviews. Same brand.
            </h2>
            <p className="mt-3 text-white/70">
              We&apos;ve been making honest South African car reviews on YouTube for years. The marketplace
              is the same energy — no spammy dealer ads, no scammers, no inflated prices. Just real cars
              from real people.
            </p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            <ValueCard
              title="Screened"
              body="Every listing is reviewed by our team before going live. No scams, no stolen photos, no fake escrow."
            />
            <ValueCard
              title="Verified"
              body="VIN + NaTIS checked listings get a verified badge. Pay-to-upgrade for an in-person inspection report."
            />
            <ValueCard
              title="On video"
              body="Selected cars get a full walk-around review on the Car Torque SA YouTube channel. The wedge no classifieds site has."
            />
          </div>
        </div>
        <div className="stripe-divider" aria-hidden />
      </section>

      {/* SECONDARY — channel content */}
      <section className="max-w-6xl mx-auto w-full px-5 py-16">
        <SectionHeader
          eyebrow="The channel"
          title="Reviewed by Car Torque SA"
          href="/videos"
          hrefLabel="All videos"
        />
        <p className="mt-3 text-[color:var(--muted)] max-w-2xl">
          Years of honest reviews on the cars South Africans actually buy. Every marketplace listing
          stands on this back catalogue.
        </p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {FEATURED_VIDEOS.map((v, i) => (
            <VideoCard key={`${v.id}-${i}`} video={v} />
          ))}
        </div>
      </section>

      {/* BLOG — even more secondary, two-card layout */}
      {latestPosts.length > 0 && (
        <section className="max-w-6xl mx-auto w-full px-5 pb-16">
          <SectionHeader
            eyebrow="Reading"
            title="From the blog"
            href="/blog"
            hrefLabel="All posts"
          />
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {latestPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card rounded-xl p-6 block">
                <div className="text-xs text-[color:var(--muted)] font-medium">
                  {new Date(p.date).toLocaleDateString("en-ZA", { dateStyle: "medium" })}
                </div>
                <div className="mt-2 font-semibold text-lg leading-snug">{p.title}</div>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{p.excerpt}</p>
                <div className="mt-5 link-cta text-sm">Read article →</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FINAL CTA — two equal CTAs: sell + subscribe */}
      <section className="max-w-6xl mx-auto w-full px-5 pb-20">
        <div className="card rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-8 relative overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-80 h-80 bg-[color:var(--accent)] rounded-full blur-3xl opacity-25"
            aria-hidden
          />
          <div className="relative">
            <span className="eyebrow">Selling soon?</span>
            <h3 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
              List your car in 5 minutes.
            </h3>
            <p className="mt-2 text-[color:var(--muted)]">
              Free to list. Reach buyers who know honest cars when they see them.
            </p>
            <div className="mt-5">
              <Link href="/sell" className="btn-primary">
                Sell my car
              </Link>
            </div>
          </div>
          <div className="relative md:border-l md:border-[color:var(--border)] md:pl-8">
            <span className="eyebrow">Watch first</span>
            <h3 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
              Honest reviews, every week.
            </h3>
            <p className="mt-2 text-[color:var(--muted)]">
              Hundreds of hours of SA-driven reviews. Subscribe and don&apos;t miss the next one.
            </p>
            <div className="mt-5">
              <a
                href={`${CHANNEL.url}?sub_confirmation=1`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                <YouTubeIcon /> Subscribe on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  href,
  hrefLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
      </div>
      {href && hrefLabel && (
        <Link href={href} className="text-sm font-semibold whitespace-nowrap link-cta">
          {hrefLabel} →
        </Link>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-[color:var(--muted)] font-semibold">{label}</dt>
      <dd className="text-2xl font-black mt-1">{value}</dd>
    </div>
  );
}

function ValueCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl p-5 border border-white/10 bg-white/5">
      <span className="chip">{title}</span>
      <p className="mt-3 text-sm text-white/80 leading-relaxed">{body}</p>
    </div>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}
