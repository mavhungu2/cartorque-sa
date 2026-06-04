"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthorised, loginAdmin, logoutAdmin } from "@/lib/admin-auth";
import { setListingStatus } from "@/lib/listings";

export async function adminLoginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const ok = await loginAdmin(password);
  if (!ok) {
    redirect("/admin/login?error=1");
  }
  redirect("/admin/listings");
}

export async function adminLogoutAction(): Promise<void> {
  await logoutAdmin();
  redirect("/admin/login");
}

export async function approveListingAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthorised())) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await setListingStatus(id, "live");
  revalidatePath("/admin/listings");
  revalidatePath("/marketplace");
}

export async function rejectListingAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthorised())) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await setListingStatus(id, "flagged");
  revalidatePath("/admin/listings");
}
