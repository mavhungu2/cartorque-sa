// MIRROR of the pure parts of cartorque-sa/src/lib/finance.ts.
// Do not edit independently — run `npm run check-contracts` to verify sync.

export type EmploymentStatus = "permanent" | "contract" | "self_employed" | "pensioner" | "other";

export type NewFinanceApplicationInput = {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  hasDriversLicence: boolean;

  employmentStatus: EmploymentStatus;
  employer?: string;
  occupation?: string;
  yearsEmployed?: number;
  grossMonthlyIncome: number;
  netMonthlyIncome: number;
  monthlyExpenses: number;
  existingCreditCommitments: number;

  listingId?: string;
  vehicleDescription?: string;
  purchasePriceZar?: number;
  depositZar: number;
  preferredTermMonths: number;

  consentPopia: boolean;
  consentCreditCheck: boolean;
};

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
