// Finance pre-approval data layer. Applications are stored in Firestore
// (collection: finance_applications) and forwarded to registered credit
// providers by the Car Torque team. Car Torque SA is not a credit provider.
import "server-only";
import { adminConfigured, getAdminDb, stripUndefined } from "./firebase/admin";

export type EmploymentStatus = "permanent" | "contract" | "self_employed" | "pensioner" | "other";
export type ApplicationStatus = "new" | "contacted" | "submitted_to_bank" | "approved" | "declined" | "closed";

export type FinanceApplication = {
  id: string;

  // Applicant
  fullName: string;
  idNumber: string; // 13-digit SA ID
  phone: string;
  email: string;
  hasDriversLicence: boolean;

  // Employment & affordability (NCA affordability assessment inputs)
  employmentStatus: EmploymentStatus;
  employer?: string;
  occupation?: string;
  yearsEmployed?: number;
  grossMonthlyIncome: number;
  netMonthlyIncome: number;
  monthlyExpenses: number;
  existingCreditCommitments: number;

  // The deal
  listingId?: string;
  vehicleDescription?: string;
  purchasePriceZar?: number;
  depositZar: number;
  preferredTermMonths: number; // 12–96, 72 typical

  // POPIA + credit-check consent (both required to submit)
  consentPopia: boolean;
  consentCreditCheck: boolean;

  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export type NewFinanceApplicationInput = Omit<
  FinanceApplication,
  "id" | "status" | "createdAt" | "updatedAt"
>;

// Dev fallback when Firebase isn't configured (local only; resets on restart).
const MOCK_APPLICATIONS: FinanceApplication[] = [];

/** Quick affordability sanity flags shown to admins — not a credit decision. */
export function affordabilitySnapshot(app: FinanceApplication) {
  const disposable =
    app.netMonthlyIncome - app.monthlyExpenses - app.existingCreditCommitments;
  const estInstalment = app.purchasePriceZar
    ? estimateInstalment(app.purchasePriceZar - app.depositZar, app.preferredTermMonths)
    : null;
  return {
    disposable,
    estInstalment,
    meetsMinIncome: app.netMonthlyIncome >= 6500, // typical SA bank floor
    instalmentFits: estInstalment === null || estInstalment <= disposable * 0.8,
  };
}

/**
 * Illustrative monthly instalment: standard amortisation at a default
 * illustrative rate (prime-linked rates vary per applicant). Not an offer.
 */
export function estimateInstalment(
  principal: number,
  termMonths: number,
  annualRatePct = 13.5,
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -termMonths)));
}

/** SA ID numbers use the Luhn checksum on all 13 digits. */
export function isValidSaId(id: string): boolean {
  if (!/^\d{13}$/.test(id)) return false;
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let d = Number(id[12 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export async function createFinanceApplication(
  input: NewFinanceApplicationInput,
): Promise<string> {
  const now = new Date().toISOString();
  const doc: Omit<FinanceApplication, "id"> = {
    ...input,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };

  if (!adminConfigured()) {
    const id = `fin-${Date.now()}`;
    MOCK_APPLICATIONS.unshift({ ...doc, id });
    return id;
  }

  const db = getAdminDb();
  if (!db) throw new Error("Firebase admin not initialised");
  const ref = await db.collection("finance_applications").add(stripUndefined(doc));
  return ref.id;
}

export async function listFinanceApplications(): Promise<FinanceApplication[]> {
  if (!adminConfigured()) {
    return [...MOCK_APPLICATIONS];
  }
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snap = await db
      .collection("finance_applications")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FinanceApplication);
  } catch (err) {
    console.warn("[finance] Firestore list failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

export async function setApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  const now = new Date().toISOString();
  if (!adminConfigured()) {
    const idx = MOCK_APPLICATIONS.findIndex((a) => a.id === id);
    if (idx >= 0)
      MOCK_APPLICATIONS[idx] = { ...MOCK_APPLICATIONS[idx], status, updatedAt: now };
    return;
  }
  const db = getAdminDb();
  if (!db) throw new Error("Firebase admin not initialised");
  await db.collection("finance_applications").doc(id).update({ status, updatedAt: now });
}
