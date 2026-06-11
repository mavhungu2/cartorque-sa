// Bounded CDN staleness — fully-static pages otherwise cache for a year.
export const revalidate = 300;

export const metadata = {
  title: "Privacy Policy — Car Torque SA",
  description:
    "How Car Torque SA collects, uses, and protects your personal information under POPIA.",
};

const LAST_UPDATED = "11 June 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <span className="eyebrow">Legal</span>
      <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-3 text-sm text-[color:var(--muted)]">Last updated: {LAST_UPDATED}</p>

      <div className="mt-10 space-y-8 text-[color:var(--fg)]/85 leading-relaxed">
        <Section title="1. Who we are">
          <p>
            Car Torque SA (&quot;we&quot;, &quot;us&quot;) operates the website cartorquesa.co.za, the Car
            Torque SA mobile applications, and the Car Torque SA YouTube channel. We are the
            &quot;responsible party&quot; for your personal information under the Protection of
            Personal Information Act, 2013 (POPIA). Contact:{" "}
            <a className="link-cta" href="mailto:hello@cartorque.co.za">
              hello@cartorque.co.za
            </a>
            .
          </p>
        </Section>

        <Section title="2. What we collect">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Browsing:</strong> standard server logs (IP address, pages viewed, device
              type). No advertising trackers; no third-party analytics cookies.
            </li>
            <li>
              <strong>Selling a car:</strong> your name, contact details (phone, WhatsApp, email),
              and the vehicle information and photos you submit.
            </li>
            <li>
              <strong>Finance pre-approval applications:</strong> full name, South African ID
              number, contact details, employment details, income, expenses, and existing credit
              commitments. This is sensitive information — see section 3 for exactly how it is
              used.
            </li>
          </ul>
        </Section>

        <Section title="3. Why we collect it and who we share it with">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Listing information is published on the marketplace so buyers can contact you — that
              is its purpose.
            </li>
            <li>
              Finance application information is collected for one purpose only: to submit your
              application to credit providers registered with the National Credit Regulator (NCR)
              and/or their authorised finance intermediaries, with your explicit consent given at
              submission. Car Torque SA is not a credit provider and does not make credit
              decisions.
            </li>
            <li>
              Credit providers may perform credit bureau checks on you — you consent to this
              separately and explicitly when applying.
            </li>
            <li>We do not sell personal information to anyone.</li>
          </ul>
        </Section>

        <Section title="4. Where it is stored and for how long">
          <p>
            Data is stored in Google Cloud (Firebase) data centres with encryption in transit and
            at rest. Finance applications are retained for up to 12 months after the application
            is closed (to handle queries and meet record-keeping obligations), then deleted.
            Listing data is retained while the listing is active and for up to 12 months after it
            is sold or withdrawn.
          </p>
        </Section>

        <Section title="5. Your rights (POPIA)">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              You may request access to, correction of, or deletion of your personal information
              at any time by emailing{" "}
              <a className="link-cta" href="mailto:hello@cartorque.co.za">
                hello@cartorque.co.za
              </a>{" "}
              with the subject &quot;Data request&quot;. We respond within a reasonable time and at
              most within 30 days.
            </li>
            <li>You may withdraw consent for a pending finance application at any time.</li>
            <li>
              You may lodge a complaint with the Information Regulator (South Africa):{" "}
              <a
                className="link-cta"
                href="https://inforegulator.org.za"
                target="_blank"
                rel="noreferrer"
              >
                inforegulator.org.za
              </a>{" "}
              /{" "}
              <a className="link-cta" href="mailto:enquiries@inforegulator.org.za">
                enquiries@inforegulator.org.za
              </a>
              .
            </li>
          </ul>
        </Section>

        <Section title="6. Mobile applications">
          <p>
            The Car Torque SA Android and iOS apps collect the same information as the website and
            nothing more. The apps do not access your contacts, location, microphone, or camera
            roll (photo selection for listings uses the system picker, which shares only the
            photos you choose). If you enable new-stock notifications, an anonymous push token is
            stored to deliver them; disable notifications at any time in your device settings, and
            the token is removed.
          </p>
        </Section>

        <Section title="7. Children">
          <p>
            Our services are intended for users 18 and older (you must be a major to conclude a
            vehicle sale or credit agreement in South Africa). We do not knowingly collect
            information from children.
          </p>
        </Section>

        <Section title="8. Changes">
          <p>
            We will update this policy as the product evolves and change the date at the top. For
            material changes affecting finance-application data we will notify applicants by
            email.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}
