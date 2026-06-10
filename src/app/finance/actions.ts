"use server";

import { redirect } from "next/navigation";
import {
  createFinanceApplication,
  isValidSaId,
  type EmploymentStatus,
} from "@/lib/finance";

function str(form: FormData, key: string, required = true): string {
  const v = form.get(key);
  const t = typeof v === "string" ? v.trim() : "";
  if (required && t === "") throw new Error(`${key} is required`);
  return t;
}

function num(form: FormData, key: string, required = true): number {
  const raw = str(form, key, required).replace(/[, ]/g, "");
  if (raw === "" && !required) return 0;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) throw new Error(`${key} must be a positive number`);
  return n;
}

export async function submitFinanceApplicationAction(formData: FormData): Promise<void> {
  const idNumber = str(formData, "idNumber");
  if (!isValidSaId(idNumber)) {
    redirect("/finance?error=invalid_id");
  }

  if (formData.get("consentPopia") !== "on" || formData.get("consentCreditCheck") !== "on") {
    redirect("/finance?error=consent_required");
  }

  const id = await createFinanceApplication({
    fullName: str(formData, "fullName"),
    idNumber,
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    hasDriversLicence: formData.get("hasDriversLicence") === "on",

    employmentStatus: str(formData, "employmentStatus") as EmploymentStatus,
    employer: str(formData, "employer", false) || undefined,
    occupation: str(formData, "occupation", false) || undefined,
    yearsEmployed: num(formData, "yearsEmployed", false) || undefined,
    grossMonthlyIncome: num(formData, "grossMonthlyIncome"),
    netMonthlyIncome: num(formData, "netMonthlyIncome"),
    monthlyExpenses: num(formData, "monthlyExpenses"),
    existingCreditCommitments: num(formData, "existingCreditCommitments", false),

    listingId: str(formData, "listingId", false) || undefined,
    vehicleDescription: str(formData, "vehicleDescription", false) || undefined,
    purchasePriceZar: num(formData, "purchasePriceZar", false) || undefined,
    depositZar: num(formData, "depositZar", false),
    preferredTermMonths: num(formData, "preferredTermMonths"),

    consentPopia: true,
    consentCreditCheck: true,
  });

  redirect(`/finance/success?ref=${id}`);
}
