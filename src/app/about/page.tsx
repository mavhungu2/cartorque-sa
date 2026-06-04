import Link from "next/link";
import { CHANNEL } from "@/lib/data";

export const metadata = {
  title: "About — Car Torque SA",
  description: "About Car Torque SA — the honest South African motoring channel.",
};

const VALUES = [
  {
    title: "Honest",
    body: "No paid puff pieces. If it doesn't deliver, we say so — even when the launch dinner is excellent.",
  },
  {
    title: "Local",
    body: "Reviewed on South African roads, at South African fuel prices, with South African conditions in mind.",
  },
  {
    title: "Useful",
    body: "We answer the questions you actually have before you sign at the dealership.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <span className="eyebrow">About</span>
      <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
        Cars, reviewed properly. From here.
      </h1>
      <p className="mt-6 text-lg text-[color:var(--muted)]">
        {CHANNEL.about}
      </p>
      <p className="mt-4 text-lg text-[color:var(--muted)]">
        We started Car Torque SA because the cars we wanted to buy weren&apos;t the ones getting the headlines. So
        we decided to drive them ourselves — properly, on real roads, in real traffic — and tell the truth.
      </p>

      <section className="mt-12 grid sm:grid-cols-3 gap-4">
        {VALUES.map((v) => (
          <div key={v.title} className="card rounded-xl p-5">
            <span className="chip">{v.title}</span>
            <div className="mt-3 text-sm text-[color:var(--muted)]">{v.body}</div>
          </div>
        ))}
      </section>

      <section className="mt-14 card rounded-2xl p-8">
        <h2 className="text-2xl font-bold">Want a car reviewed?</h2>
        <p className="mt-2 text-[color:var(--muted)]">
          Manufacturers, dealers, and viewers — get in touch. We&apos;re always happy to add to the queue.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary">Contact us</Link>
          <a href={CHANNEL.url} target="_blank" rel="noreferrer" className="btn-outline">
            Watch on YouTube
          </a>
        </div>
      </section>
    </div>
  );
}
