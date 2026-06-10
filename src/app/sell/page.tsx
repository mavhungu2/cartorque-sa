import { submitListingAction } from "./actions";
import { MAKES, PROVINCES } from "@/lib/listings";

// Bounded CDN staleness — fully-static pages otherwise cache for a year.
export const revalidate = 300;

export const metadata = {
  title: "Sell my car — Car Torque SA",
  description:
    "List your car for sale on Car Torque SA. Honest screening, optional video review by the channel.",
};

const CURRENT_YEAR = 2026;
const YEARS = Array.from({ length: 35 }, (_, i) => CURRENT_YEAR - i);

export default function SellPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <span className="eyebrow">Sell my car</span>
      <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">List your car.</h1>
      <p className="mt-4 text-lg text-[color:var(--muted)]">
        Free to list. Honest, screened listings only. Submitted listings are reviewed by the Car
        Torque team before going live — usually within 24 hours.
      </p>

      <form action={submitListingAction} encType="multipart/form-data" className="mt-10 space-y-6">
        <Section title="The car">
          <Grid cols={2}>
            <Field label="Make" required>
              <select name="make" required className={selectCls} defaultValue="">
                <option value="" disabled>
                  Select a make
                </option>
                {MAKES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Model" required>
              <input
                type="text"
                name="model"
                required
                placeholder="e.g. Clio"
                className={inputCls}
              />
            </Field>
            <Field label="Variant / Spec">
              <input
                type="text"
                name="variant"
                placeholder="e.g. V Zen Turbo"
                className={inputCls}
              />
            </Field>
            <Field label="Year" required>
              <select name="year" required className={selectCls} defaultValue="">
                <option value="" disabled>
                  Select year
                </option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Mileage (km)" required>
              <input
                type="number"
                inputMode="numeric"
                name="mileageKm"
                required
                min={0}
                placeholder="e.g. 48500"
                className={inputCls}
              />
            </Field>
            <Field label="Transmission" required>
              <select name="transmission" required className={selectCls} defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
                <option value="dct">DCT / DSG</option>
                <option value="cvt">CVT</option>
              </select>
            </Field>
            <Field label="Fuel" required>
              <select name="fuelType" required className={selectCls} defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </Field>
            <Field label="Body type">
              <input
                type="text"
                name="bodyType"
                placeholder="Hatchback, sedan, SUV…"
                className={inputCls}
              />
            </Field>
            <Field label="Colour">
              <input
                type="text"
                name="color"
                placeholder="e.g. Pearl White"
                className={inputCls}
              />
            </Field>
          </Grid>
        </Section>

        <Section title="Price & location">
          <Grid cols={2}>
            <Field label="Asking price (R)" required>
              <input
                type="number"
                inputMode="numeric"
                name="priceZar"
                required
                min={1000}
                placeholder="e.g. 199500"
                className={inputCls}
              />
            </Field>
            <Field label="Negotiable?">
              <label className="inline-flex items-center gap-2 py-2 text-sm">
                <input
                  type="checkbox"
                  name="negotiable"
                  defaultChecked
                  className="accent-[color:var(--ink)] w-4 h-4"
                />
                Yes, open to offers
              </label>
            </Field>
            <Field label="City / town" required>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Johannesburg"
                className={inputCls}
              />
            </Field>
            <Field label="Province" required>
              <select name="province" required className={selectCls} defaultValue="">
                <option value="" disabled>
                  Select province
                </option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
          </Grid>
        </Section>

        <Section title="Tell buyers about it">
          <Field label="Description" required>
            <textarea
              name="description"
              required
              rows={6}
              minLength={40}
              placeholder="Service history, mods, why you're selling, anything a buyer should know. Honesty wins."
              className={textareaCls}
            />
          </Field>
          <Field label="Photos">
            <input
              type="file"
              name="photos"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="block w-full text-sm text-[color:var(--fg)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[color:var(--ink)] file:text-[color:var(--accent)] file:font-bold hover:file:bg-[color:var(--fg)] cursor-pointer"
            />
            <p className="text-xs text-[color:var(--muted)] mt-2">
              JPEG, PNG, or WebP. Up to 8 MB each. Tip: a clean exterior shot from the front 3/4
              angle gets the most clicks. Add 2-3 more inside.
            </p>
          </Field>
        </Section>

        <Section title="How buyers reach you">
          <Grid cols={2}>
            <Field label="Your name" required>
              <input
                type="text"
                name="ownerName"
                required
                placeholder="First name + initial is fine"
                className={inputCls}
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                name="ownerEmail"
                required
                placeholder="you@example.com"
                className={inputCls}
              />
            </Field>
            <Field label="WhatsApp number">
              <input
                type="tel"
                name="ownerWhatsapp"
                placeholder="+27 82 123 4567"
                className={inputCls}
              />
            </Field>
            <Field label="Phone number">
              <input
                type="tel"
                name="ownerPhone"
                placeholder="+27 82 123 4567"
                className={inputCls}
              />
            </Field>
          </Grid>
          <p className="text-xs text-[color:var(--muted)]">
            We&apos;ll only show buyers the contact channels you provide. You can hide your phone number
            and only respond on WhatsApp if you prefer.
          </p>
        </Section>

        <div className="card rounded-2xl p-5">
          <div className="text-sm text-[color:var(--fg)]/85">
            By submitting, you confirm you&apos;re the legal owner and that all info is accurate. Car
            Torque SA reviews every listing before it goes live and may request additional info
            (NaTIS papers, photos) before approval.
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">Submit listing</button>
            <a href="/marketplace" className="btn-outline">Cancel</a>
          </div>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--ink)]";
const selectCls = inputCls;
const textareaCls =
  "w-full rounded-md border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:border-[color:var(--ink)]";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card rounded-2xl p-6 space-y-5">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ cols, children }: { cols: 1 | 2; children: React.ReactNode }) {
  return (
    <div className={cols === 2 ? "grid sm:grid-cols-2 gap-4" : "space-y-4"}>{children}</div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-[color:var(--muted)] font-bold">
        {label}
        {required && <span className="text-[color:var(--accent-2)] ml-1">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
