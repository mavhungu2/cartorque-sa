import { type NextRequest } from "next/server";
import {
  createFinanceApplication,
  isValidSaId,
  type EmploymentStatus,
  type NewFinanceApplicationInput,
} from "@/lib/finance";

// Naive fixed-window per-IP rate limit. In-memory, so it resets per server
// instance — acceptable MVP abuse damping; App Check / Turnstile later.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; windowStart: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

const EMPLOYMENT: EmploymentStatus[] = ["permanent", "contract", "self_employed", "pensioner", "other"];

type Err = { code: string; message: string; field?: string };

function bad(error: Err, status = 400) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

function str(body: Record<string, unknown>, key: string, required = true): string | undefined {
  const v = body[key];
  if (typeof v === "string" && v.trim() !== "") return v.trim();
  if (required) throw { code: "validation", message: `${key} is required`, field: key } satisfies Err;
  return undefined;
}

function num(body: Record<string, unknown>, key: string, required = true): number | undefined {
  const v = body[key];
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v.replace(/[, ]/g, "")) : NaN;
  if (Number.isFinite(n) && n >= 0) return n;
  if (required) throw { code: "validation", message: `${key} must be a positive number`, field: key } satisfies Err;
  return undefined;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return bad({ code: "rate_limited", message: "Too many applications. Try again later." }, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad({ code: "validation", message: "Body must be JSON." });
  }

  try {
    const idNumber = str(body, "idNumber")!;
    if (!isValidSaId(idNumber)) {
      return bad({ code: "invalid_id", message: "SA ID number failed validation.", field: "idNumber" });
    }
    if (body.consentPopia !== true || body.consentCreditCheck !== true) {
      return bad({
        code: "consent_required",
        message: "Both POPIA and credit-check consent are required.",
      });
    }
    const employmentStatus = str(body, "employmentStatus")! as EmploymentStatus;
    if (!EMPLOYMENT.includes(employmentStatus)) {
      return bad({ code: "validation", message: "Invalid employmentStatus.", field: "employmentStatus" });
    }
    const preferredTermMonths = num(body, "preferredTermMonths")!;
    if (preferredTermMonths < 12 || preferredTermMonths > 96) {
      return bad({ code: "validation", message: "preferredTermMonths must be 12–96.", field: "preferredTermMonths" });
    }

    const input: NewFinanceApplicationInput = {
      fullName: str(body, "fullName")!,
      idNumber,
      phone: str(body, "phone")!,
      email: str(body, "email")!,
      hasDriversLicence: body.hasDriversLicence === true,
      employmentStatus,
      employer: str(body, "employer", false),
      occupation: str(body, "occupation", false),
      yearsEmployed: num(body, "yearsEmployed", false),
      grossMonthlyIncome: num(body, "grossMonthlyIncome")!,
      netMonthlyIncome: num(body, "netMonthlyIncome")!,
      monthlyExpenses: num(body, "monthlyExpenses")!,
      existingCreditCommitments: num(body, "existingCreditCommitments", false) ?? 0,
      listingId: str(body, "listingId", false),
      vehicleDescription: str(body, "vehicleDescription", false),
      purchasePriceZar: num(body, "purchasePriceZar", false),
      depositZar: num(body, "depositZar", false) ?? 0,
      preferredTermMonths,
      consentPopia: true,
      consentCreditCheck: true,
    };

    const id = await createFinanceApplication(input);
    return Response.json({ id }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && "message" in err) {
      return bad(err as Err);
    }
    console.error("[api/finance] unexpected:", err);
    return bad({ code: "internal", message: "Something went wrong. Try again." }, 500);
  }
}
