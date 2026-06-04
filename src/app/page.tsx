import Link from "next/link";
import VideoCard from "@/components/VideoCard";
import ListingCard from "@/components/ListingCard";
import { CHANNEL, FEATURED_VIDEOS, CATEGORIES, POSTS } from "@/lib/data";
import { listLiveListings } from "@/lib/listings";

// Refresh the "Recently listed" section every 60s so newly-approved listings show up.
export const revalidate = 60;

export default async function Home() {
  const latestPosts = POSTS.slice(0, 3);
  const featuredListings = (await listLiveListings()).slice(0, 3);

  return (
    <div className="flex flex-col">
      <section className="hero-grad border-b border-[color:var(--border)]">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="eyebrow">YouTube Channel</span>
            <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight leading-[1.02]">
              {CHANNEL.name}.{" "}
              <span className="block mt-2">
                Real cars.
                <br />
                Real roads.{" "}
                <span className="relative inline-block">
                  <span className="absolute inset-x-[-4px] bottom-[6px] h-[14px] bg-[color:var(--accent)] -z-0" aria-hidden />
                  <span className="relative z-10">Real takes.</span>
                </span>
              </span>
            </h1>
            <p className="mt-6 text-lg text-[color:var(--muted)] max-w-xl">
              {CHANNEL.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`${CHANNEL.url}?sub_confirmation=1`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                <YouTubeIcon /> Subscribe on YouTube
              </a>
              <Link href="/videos" className="btn-outline">
                Watch latest
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat label="Reviews" value="20+" />
              <Stat label="Driven" value="SA-wide" />
              <Stat label="New every" value="Week" />
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-[color:var(--accent)]/25 blur-3xl rounded-full" aria-hidden />
            <div className="relative card rounded-2xl overflow-hidden">
              <div className="aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${FEATURED_VIDEOS[0].id}`}
                  title={FEATURED_VIDEOS[0].title}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <span className="chip">Now Playing</span>
                <div className="font-semibold mt-2 leading-snug">{FEATURED_VIDEOS[0].title}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto w-full px-5 py-16">
        <div className="card rounded-2xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-[color:var(--accent)] rounded-full blur-3xl opacity-40" aria-hidden />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 md:items-center">
            <div>
              <span className="eyebrow">New — Marketplace</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
                Buying or selling a car?
              </h2>
              <p className="mt-3 text-[color:var(--muted)] max-w-xl">
                We&apos;re opening up Car Torque SA to private listings. Every car is screened by
                the team, and selected ones get a full video review on the channel — the only place
                in SA where editorial honesty meets the classifieds.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/marketplace" className="btn-primary">Browse cars</Link>
              <Link href="/sell" className="btn-outline">Sell my car</Link>
            </div>
          </div>
        </div>

        {featuredListings.length > 0 && (
          <div className="mt-12">
            <SectionHeader
              eyebrow="On the marketplace"
              title="Recently listed"
              href="/marketplace"
              hrefLabel="See all cars"
            />
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {featuredListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto w-full px-5 py-16 border-t border-[color:var(--border)]">
        <SectionHeader
          eyebrow="Featured"
          title="The latest from the channel"
          href="/videos"
          hrefLabel="See all videos"
        />
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {FEATURED_VIDEOS.map((v, i) => (
            <VideoCard key={`${v.id}-${i}`} video={v} />
          ))}
        </div>
      </section>

      <section className="bg-[color:var(--ink)] text-white">
        <div className="stripe-divider" aria-hidden />
        <div className="max-w-6xl mx-auto w-full px-5 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow" style={{ color: "#ffffff" }}>Browse</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">What we cover</h2>
            </div>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/videos?category=${c.slug}`}
                className="rounded-xl p-5 block group border border-white/10 bg-white/5 hover:bg-[color:var(--accent)] hover:text-[color:var(--ink)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg">{c.title}</div>
                  <span className="text-[color:var(--accent)] group-hover:text-[color:var(--ink)] transition-colors text-xl">→</span>
                </div>
                <p className="text-sm text-white/70 group-hover:text-[color:var(--ink)]/80 mt-2 transition-colors">{c.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="stripe-divider" aria-hidden />
      </section>

      <section className="max-w-6xl mx-auto w-full px-5 py-16">
        <SectionHeader
          eyebrow="From the blog"
          title="Read, then watch"
          href="/blog"
          hrefLabel="All posts"
        />
        <div className="mt-8 grid md:grid-cols-3 gap-6">
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

      <section className="max-w-6xl mx-auto w-full px-5 pb-20">
        <div className="card rounded-2xl p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[color:var(--accent)] rounded-full blur-3xl opacity-30" aria-hidden />
          <div className="relative">
            <span className="eyebrow">Stay in the loop</span>
            <h3 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">New reviews every week. Don&apos;t miss one.</h3>
            <p className="mt-2 text-[color:var(--muted)] max-w-xl">Hit subscribe on YouTube for the full library, road tests, and weekly motoring takes.</p>
          </div>
          <a
            href={`${CHANNEL.url}?sub_confirmation=1`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary whitespace-nowrap relative"
          >
            <YouTubeIcon /> Subscribe
          </a>
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

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}
