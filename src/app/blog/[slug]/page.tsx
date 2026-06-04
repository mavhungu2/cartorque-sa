import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS } from "@/lib/data";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found — Car Torque SA" };
  return {
    title: `${post.title} — Car Torque SA`,
    description: post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article className="max-w-3xl mx-auto px-5 py-16">
      <Link href="/blog" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)] font-semibold">
        ← Back to blog
      </Link>

      <header className="mt-6">
        <div className="text-xs text-[color:var(--muted)] font-semibold uppercase tracking-wider">
          {new Date(post.date).toLocaleDateString("en-ZA", { dateStyle: "long" })}
        </div>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight leading-tight">{post.title}</h1>
        <p className="mt-4 text-xl text-[color:var(--muted)]">{post.excerpt}</p>
      </header>

      <div className="mt-10 text-lg leading-relaxed text-[color:var(--fg)]/90 space-y-5">
        <p>{post.body}</p>
        <p className="text-[color:var(--muted)]">
          This is a short preview. Watch the full video review on the Car Torque SA YouTube channel for the deep dive,
          driving footage, and our final verdict.
        </p>
      </div>

      {others.length > 0 && (
        <section className="mt-16 pt-10 border-t border-[color:var(--border)]">
          <h2 className="text-xl font-bold">Keep reading</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-4">
            {others.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="card rounded-xl p-5 block">
                  <div className="font-semibold leading-snug">{p.title}</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">{p.excerpt}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
