"use server";

import { redirect } from "next/navigation";
import {
  createPendingListing,
  MAKES,
  PROVINCES,
  type FuelType,
  type Transmission,
} from "@/lib/listings";
import { uploadListingPhotos } from "@/lib/uploads";

function requireString(form: FormData, key: string): string {
  const v = form.get(key);
  if (typeof v !== "string" || v.trim() === "") {
    throw new Error(`${key} is required`);
  }
  return v.trim();
}

function requireNumber(form: FormData, key: string): number {
  const raw = requireString(form, key).replace(/[, ]/g, "");
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) throw new Error(`${key} must be a number`);
  return n;
}

function optionalString(form: FormData, key: string): string | undefined {
  const v = form.get(key);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t === "" ? undefined : t;
}

export async function submitListingAction(formData: FormData): Promise<void> {
  const make = requireString(formData, "make");
  const model = requireString(formData, "model");
  const province = requireString(formData, "province");
  const transmission = requireString(formData, "transmission") as Transmission;
  const fuelType = requireString(formData, "fuelType") as FuelType;

  if (!(MAKES as readonly string[]).includes(make)) throw new Error("Unknown make");
  if (!(PROVINCES as readonly string[]).includes(province)) throw new Error("Unknown province");

  const photoFiles = formData.getAll("photos").filter((v): v is File => v instanceof File && v.size > 0);
  const uploaded = await uploadListingPhotos(photoFiles);

  const id = await createPendingListing({
    make,
    model,
    variant: optionalString(formData, "variant"),
    year: requireNumber(formData, "year"),
    mileageKm: requireNumber(formData, "mileageKm"),
    transmission,
    fuelType,
    bodyType: optionalString(formData, "bodyType"),
    color: optionalString(formData, "color"),
    priceZar: requireNumber(formData, "priceZar"),
    negotiable: formData.get("negotiable") === "on",
    location: requireString(formData, "location"),
    province,
    description: requireString(formData, "description"),
    photos: uploaded.map((u) => u.url),
    ownerName: requireString(formData, "ownerName"),
    ownerPhone: optionalString(formData, "ownerPhone"),
    ownerWhatsapp: optionalString(formData, "ownerWhatsapp"),
    ownerEmail: requireString(formData, "ownerEmail"),
  });

  redirect(`/sell/success?id=${id}`);
}
