import Link from "next/link";
import VideoCard from "@/components/VideoCard";
import { VIDEOS, CATEGORIES, CHANNEL } from "@/lib/data";

// Bounded CDN staleness — fully-static pages otherwise cache for a year.
export const revalidate = 300;

export const metadata = {
  title: "Videos — Car Torque SA",
  description: "All the latest reviews, road tests, and motoring news from Car Torque SA.",
};

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = CATEGORIES.find((c) => c.slug === category);

  const videos = activeCategory
    ? VIDEOS.filter((v) => v.category.toLowerCase() === activeCategory.title.toLowerCase())
    : VIDEOS;

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">Library</span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {activeCategory ? activeCategory.title : "All videos"}
        </h1>
        <p className="text-[color:var(--muted)] max-w-2xl">
          {activeCategory?.blurb ?? "Every review and feature from the Car Torque SA channel."}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <CategoryPill href="/videos" label="All" active={!activeCategory} />
        {CATEGORIES.map((c) => (
          <CategoryPill
            key={c.slug}
            href={`/videos?category=${c.slug}`}
            label={c.title}
            active={activeCategory?.slug === c.slug}
          />
        ))}
      </div>

      {videos.length > 0 ? (
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <VideoCard key={`${v.id}-${i}`} video={v} />
          ))}
        </div>
      ) : (
        <div className="mt-10 card rounded-xl p-10 text-center">
          <div className="text-lg font-semibold">No videos in this category yet.</div>
          <p className="text-[color:var(--muted)] mt-2">
            New uploads land on the channel every week — head over and subscribe to be notified.
          </p>
          <a
            href={`${CHANNEL.url}?sub_confirmation=1`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-6"
          >
            Subscribe on YouTube
          </a>
        </div>
      )}

      <div className="mt-16 card rounded-2xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">Looking for a specific car?</h3>
          <p className="text-[color:var(--muted)] mt-1">
            Drop us a request — we&apos;ll add it to the review queue.
          </p>
        </div>
        <Link href="/contact" className="btn-outline whitespace-nowrap">
          Request a review
        </Link>
      </div>
    </div>
  );
}

function CategoryPill({ href, label, active }: { href: string; label: string; active: boolean }) {
  const base = "px-4 py-2 rounded-full text-sm font-bold border transition-colors";
  const cls = active
    ? `${base} bg-[color:var(--ink)] border-[color:var(--ink)] text-[color:var(--accent)]`
    : `${base} border-[color:var(--border)] text-[color:var(--muted)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]`;
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}
