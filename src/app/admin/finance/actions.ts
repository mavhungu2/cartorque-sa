"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthorised } from "@/lib/admin-auth";
import { setApplicationStatus, type ApplicationStatus } from "@/lib/finance";

const VALID: ApplicationStatus[] = [
  "new",
  "contacted",
  "submitted_to_bank",
  "approved",
  "declined",
  "closed",
];

export async function setFinanceStatusAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthorised())) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ApplicationStatus;
  if (!id || !VALID.includes(status)) return;
  await setApplicationStatus(id, status);
  revalidatePath("/admin/finance");
}
