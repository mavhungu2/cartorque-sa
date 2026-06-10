import { CHANNEL } from "@/lib/data";

// Bounded CDN staleness — fully-static pages otherwise cache for a year.
export const revalidate = 300;

export const metadata = {
  title: "Contact — Car Torque SA",
  description: "Get in touch with Car Torque SA — review requests, partnerships, viewer mail.",
};

const CHANNELS = [
  {
    label: "Email",
    detail: "hello@cartorque.co.za",
    href: "mailto:hello@cartorque.co.za",
    blurb: "Best for review requests, partnerships, and press.",
  },
  {
    label: "YouTube",
    detail: CHANNEL.handle,
    href: CHANNEL.url,
    blurb: "Drop a comment on any video — we read them all.",
  },
  {
    label: "Instagram",
    detail: "@car_torque_za",
    href: "https://www.instagram.com/car_torque_za/",
    blurb: "Behind-the-scenes, BTS clips, and stories from the road.",
  },
  {
    label: "Facebook",
    detail: "Car Torque",
    href: "https://www.facebook.com/profile.php?id=100076080243370",
    blurb: "New stock drops, deals, and community chat.",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <span className="eyebrow">Contact</span>
      <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">Get in touch.</h1>
      <p className="mt-4 text-lg text-[color:var(--muted)]">
        Review requests, brand partnerships, viewer questions — pick the channel that fits and we&apos;ll get back to you.
      </p>

      <ul className="mt-10 grid sm:grid-cols-2 gap-4">
        {CHANNELS.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noreferrer" : undefined}
              className="card rounded-xl p-5 block"
            >
              <span className="chip">{c.label}</span>
              <div className="mt-3 font-semibold">{c.detail}</div>
              <div className="mt-1 text-sm text-[color:var(--muted)]">{c.blurb}</div>
            </a>
          </li>
        ))}
      </ul>

      <section className="mt-14 card rounded-2xl p-8">
        <h2 className="text-xl font-bold">Press kit</h2>
        <p className="mt-2 text-[color:var(--muted)]">
          High-res logos, channel stats, and reviewer bios available on request — email us above.
        </p>
      </section>
    </div>
  );
}
