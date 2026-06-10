import { MERCH, CHANNEL } from "@/lib/data";

// Bounded CDN staleness — fully-static pages otherwise cache for a year.
export const revalidate = 300;

export const metadata = {
  title: "Merch — Car Torque SA",
  description: "Official Car Torque SA merchandise. Wear the torque.",
};

const SWATCHES = [
  ["#000000", "#ffd400"],
  ["#1a1a1a", "#ffb700"],
  ["#ffd400", "#000000"],
  ["#0a0a0b", "#3b3b3b"],
];

export default function MerchPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">Shop</span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Wear the torque.</h1>
        <p className="text-[color:var(--muted)] max-w-2xl">
          A small drop of Car Torque SA gear, made for petrolheads. First batch is on the way.
        </p>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MERCH.map((m, i) => {
          const [a, b] = SWATCHES[i % SWATCHES.length];
          const textColor = a === "#ffd400" || b === "#ffd400" ? "#000000" : "#ffd400";
          return (
            <div key={m.name} className="card rounded-xl overflow-hidden">
              <div
                className="aspect-square relative grid place-items-center"
                style={{ background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)` }}
              >
                <span className="text-5xl font-black italic tracking-tighter" style={{ color: textColor }}>CT</span>
                <span className="absolute top-3 right-3 chip">{m.tag}</span>
              </div>
              <div className="p-4">
                <div className="font-semibold">{m.name}</div>
                <div className="text-[color:var(--ink)] font-black mt-1">{m.price}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 card rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Get notified when merch drops</h2>
          <p className="text-[color:var(--muted)] mt-1">
            Subscribe on YouTube — drops are announced in our community tab first.
          </p>
        </div>
        <a
          href={`${CHANNEL.url}?sub_confirmation=1`}
          target="_blank"
          rel="noreferrer"
          className="btn-primary whitespace-nowrap"
        >
          Subscribe on YouTube
        </a>
      </div>
    </div>
  );
}
