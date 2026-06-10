import Link from "next/link";
import { POSTS } from "@/lib/data";

// Bounded CDN staleness — fully-static pages otherwise cache for a year.
export const revalidate = 300;

export const metadata = {
  title: "Blog — Car Torque SA",
  description: "Written motoring features from Car Torque SA — buying guides, comparisons, and the SA car scene.",
};

export default function BlogPage() {
  const posts = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">Read</span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The Car Torque Blog</h1>
        <p className="text-[color:var(--muted)] max-w-2xl">
          Long-form takes, buyer&apos;s guides, and a behind-the-scenes look at what we&apos;re driving.
        </p>
      </div>

      <ul className="mt-10 space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="card rounded-xl p-6 block">
              <div className="text-xs text-[color:var(--muted)] font-semibold">
                {new Date(p.date).toLocaleDateString("en-ZA", { dateStyle: "long" })}
              </div>
              <h2 className="mt-2 text-2xl font-bold leading-snug">{p.title}</h2>
              <p className="mt-2 text-[color:var(--muted)]">{p.excerpt}</p>
              <div className="mt-5 link-cta text-sm">Read article →</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
