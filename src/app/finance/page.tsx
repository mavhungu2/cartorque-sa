import { getListing } from "@/lib/listings";
import { submitFinanceApplicationAction } from "./actions";

export const metadata = {
  title: "Finance pre-approval — Car Torque SA",
  description:
    "Apply for vehicle finance pre-approval. We submit your application to registered credit providers and come back to you with options.",
};

const FORMAT_PRICE = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

const ERRORS: Record<string, string> = {
  invalid_id: "That SA ID number doesn't look valid — please double-check it.",
  consent_required: "Both consent boxes are required to submit an application.",
};

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ listing?: string; error?: string }>;
}) {
  const { listing: listingId, error } = await searchParams;
  const listing = listingId ? await getListing(listingId) : null;

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <span className="eyebrow">Vehicle finance</span>
      <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
        Get pre-approved.
      </h1>
      <p className="mt-4 text-lg text-[color:var(--muted)]">
        One application, multiple banks. We submit your details to registered credit providers
        (WesBank, MFC, Standard Bank, Absa and others via our finance partners) and come back to
        you with your best options — usually within 24–48 hours.
      </p>

      <div className="mt-6 card rounded-xl p-5">
        <div className="text-xs uppercase tracking-wider font-bold text-[color:var(--muted)]">
          Have these ready (you&apos;ll need them at approval stage)
        </div>
        <ul className="mt-2 text-sm text-[color:var(--muted)] grid sm:grid-cols-2 gap-x-6 gap-y-1 list-disc pl-5">
          <li>SA ID document</li>
          <li>Valid driver&apos;s licence</li>
          <li>Latest 3 months&apos; payslips or bank statements</li>
          <li>Proof of residence (not older than 3 months)</li>
        </ul>
      </div>

      {error && ERRORS[error] && (
        <div className="mt-6 card rounded-xl p-4 border-2 border-[color:var(--accent)] text-sm font-semibold">
          {ERRORS[error]}
        </div>
      )}

      <form action={submitFinanceApplicationAction} className="mt-8 space-y-6">
        {listing && (
          <input type="hidden" name="listingId" value={listing.id} />
        )}

        <Section title="The car you're financing">
          {listing ? (
            <div className="flex items-start justify-between gap-4 text-sm">
              <div>
                <div className="font-semibold text-base">{listing.title}</div>
                <div className="text-[color:var(--muted)] mt-1">
                  {listing.location}, {listing.province}
                </div>
              </div>
              <div className="font-black whitespace-nowrap">{FORMAT_PRICE.format(listing.priceZar)}</div>
            </div>
          ) : (
            <Grid cols={2}>
              <Field label="Vehicle (make & model)">
                <input
                  type="text"
                  name="vehicleDescription"
                  placeholder="e.g. 2026 VW Tiguan R-Line"
                  className={inputCls}
                />
              </Field>
              <Field label="Purchase price (R)">
                <input
                  type="number"
                  inputMode="numeric"
                  name="purchasePriceZar"
                  min={50000}
                  placeholder="e.g. 379900"
                  className={inputCls}
                />
              </Field>
            </Grid>
          )}
          {listing && (
            <input type="hidden" name="purchasePriceZar" value={listing.priceZar} />
          )}
          {listing && (
            <input type="hidden" name="vehicleDescription" value={listing.title} />
          )}
          <Grid cols={2}>
            <Field label="Deposit (R, optional)">
              <input
                type="number"
                inputMode="numeric"
                name="depositZar"
                min={0}
                defaultValue={0}
                className={inputCls}
              />
            </Field>
            <Field label="Preferred term" required>
              <select name="preferredTermMonths" required defaultValue="72" className={inputCls}>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="48">48 months</option>
                <option value="60">60 months</option>
                <option value="72">72 months</option>
                <option value="96">96 months</option>
              </select>
            </Field>
          </Grid>
        </Section>

        <Section title="About you">
          <Grid cols={2}>
            <Field label="Full name" required>
              <input type="text" name="fullName" required autoComplete="name" className={inputCls} />
            </Field>
            <Field label="SA ID number" required>
              <input
                type="text"
                name="idNumber"
                required
                inputMode="numeric"
                pattern="\d{13}"
                maxLength={13}
                placeholder="13 digits"
                className={inputCls}
              />
            </Field>
            <Field label="Cellphone" required>
              <input type="tel" name="phone" required autoComplete="tel" placeholder="+27 82 123 4567" className={inputCls} />
            </Field>
            <Field label="Email" required>
              <input type="email" name="email" required autoComplete="email" className={inputCls} />
            </Field>
          </Grid>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="hasDriversLicence" defaultChecked className="accent-[color:var(--ink)] w-4 h-4" />
            I have a valid driver&apos;s licence
          </label>
        </Section>

        <Section title="Employment & affordability">
          <Grid cols={2}>
            <Field label="Employment status" required>
              <select name="employmentStatus" required defaultValue="permanent" className={inputCls}>
                <option value="permanent">Permanently employed</option>
                <option value="contract">Contract</option>
                <option value="self_employed">Self-employed</option>
                <option value="pensioner">Pensioner</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Employer">
              <input type="text" name="employer" className={inputCls} />
            </Field>
            <Field label="Occupation">
              <input type="text" name="occupation" className={inputCls} />
            </Field>
            <Field label="Years with employer">
              <input type="number" inputMode="numeric" name="yearsEmployed" min={0} max={60} className={inputCls} />
            </Field>
            <Field label="Gross monthly income (R)" required>
              <input type="number" inputMode="numeric" name="grossMonthlyIncome" required min={0} className={inputCls} />
            </Field>
            <Field label="Net (take-home) income (R)" required>
              <input type="number" inputMode="numeric" name="netMonthlyIncome" required min={0} className={inputCls} />
            </Field>
            <Field label="Total monthly expenses (R)" required>
              <input type="number" inputMode="numeric" name="monthlyExpenses" required min={0} className={inputCls} />
            </Field>
            <Field label="Existing credit repayments (R/m)">
              <input type="number" inputMode="numeric" name="existingCreditCommitments" min={0} defaultValue={0} className={inputCls} />
            </Field>
          </Grid>
          <p className="text-xs text-[color:var(--muted)]">
            Banks use this for the affordability assessment required by the National Credit Act.
            Most lenders require a net income of at least ±R6,500/month.
          </p>
        </Section>

        <Section title="Consent">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="consentPopia" required className="accent-[color:var(--ink)] w-4 h-4 mt-0.5" />
            <span>
              I consent to Car Torque SA processing my personal information for the purpose of this
              finance application and sharing it with registered credit providers and finance
              partners, in line with POPIA. <span className="text-[color:var(--muted)]">(Required)</span>
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="consentCreditCheck" required className="accent-[color:var(--ink)] w-4 h-4 mt-0.5" />
            <span>
              I consent to credit providers performing credit bureau checks on me as part of the
              application. <span className="text-[color:var(--muted)]">(Required)</span>
            </span>
          </label>
        </Section>

        <div className="card rounded-2xl p-5">
          <p className="text-xs text-[color:var(--muted)]">
            Car Torque SA is not a credit provider and does not make credit decisions. Applications
            are forwarded to credit providers registered with the National Credit Regulator (NCR).
            Approval, interest rates and terms are determined solely by the credit provider, subject
            to their affordability assessment under the National Credit Act. Submitting this form
            does not guarantee finance.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">Submit application</button>
            <a href={listing ? `/marketplace/${listing.id}` : "/marketplace"} className="btn-outline">
              Cancel
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--ink)]";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card rounded-2xl p-6 space-y-5">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ cols, children }: { cols: 1 | 2; children: React.ReactNode }) {
  return <div className={cols === 2 ? "grid sm:grid-cols-2 gap-4" : "space-y-4"}>{children}</div>;
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
