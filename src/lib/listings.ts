// Listings data layer. Reads from Firestore when configured; falls back to
// seeded mock data so the UI works before Firebase is wired up.
//
// Types, mock data, and the in-memory filter live in ./mock-listings.ts so
// they can also be used by non-server-side scripts (seed, tests).
import "server-only";
import { adminConfigured, getAdminDb, stripUndefined } from "./firebase/admin";
import {
  MOCK_LISTINGS,
  applyListingFilters,
  type Listing,
  type ListingFilters,
  type ListingStatus,
} from "./mock-listings";

export {
  PROVINCES,
  MAKES,
  type Listing,
  type ListingFilters,
  type ListingStatus,
  type VerifiedStatus,
  type Transmission,
  type FuelType,
} from "./mock-listings";

export async function listLiveListings(filters: ListingFilters = {}): Promise<Listing[]> {
  if (!adminConfigured()) {
    const live = MOCK_LISTINGS.filter((l) => l.status === "live");
    return applyListingFilters(live, filters).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  const db = getAdminDb();
  if (!db) return [];
  try {
    const snap = await db
      .collection("listings")
      .where("status", "==", "live")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Listing);
    return applyListingFilters(items, filters);
  } catch (err) {
    console.warn("[listings] Firestore read failed, returning empty list:", err instanceof Error ? err.message : err);
    return [];
  }
}

export async function getListing(id: string): Promise<Listing | null> {
  if (!adminConfigured()) {
    return MOCK_LISTINGS.find((l) => l.id === id) ?? null;
  }
  const db = getAdminDb();
  if (!db) return null;
  try {
    const doc = await db.collection("listings").doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data() as Omit<Listing, "id">;
    if (data.status !== "live") return null;
    return { id: doc.id, ...data };
  } catch (err) {
    console.warn("[listings] Firestore getListing failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

export async function listPendingListings(): Promise<Listing[]> {
  if (!adminConfigured()) {
    return MOCK_LISTINGS.filter((l) => l.status === "pending_review").sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snap = await db
      .collection("listings")
      .where("status", "==", "pending_review")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Listing);
  } catch (err) {
    console.warn("[listings] Firestore listPending failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

export async function setListingStatus(id: string, status: ListingStatus): Promise<void> {
  const now = new Date().toISOString();
  if (!adminConfigured()) {
    const idx = MOCK_LISTINGS.findIndex((l) => l.id === id);
    if (idx >= 0) MOCK_LISTINGS[idx] = { ...MOCK_LISTINGS[idx], status, updatedAt: now };
    return;
  }
  const db = getAdminDb();
  if (!db) throw new Error("Firebase admin not initialised");
  await db.collection("listings").doc(id).update({ status, updatedAt: now });
}

export type NewListingInput = Omit<
  Listing,
  "id" | "status" | "verified" | "createdAt" | "updatedAt" | "title" | "ownerId"
> & { ownerId?: string };

export async function createPendingListing(input: NewListingInput): Promise<string> {
  const now = new Date().toISOString();
  const title = `${input.year} ${input.make} ${input.model}${input.variant ? ` ${input.variant}` : ""}`;
  const doc: Omit<Listing, "id"> = {
    ...input,
    ownerId: input.ownerId ?? `anon-${Math.floor(Math.random() * 1e6)}`,
    title,
    status: "pending_review",
    verified: "unverified",
    createdAt: now,
    updatedAt: now,
  };

  if (!adminConfigured()) {
    const id = `demo-${Date.now()}`;
    MOCK_LISTINGS.unshift({ ...doc, id });
    return id;
  }

  const db = getAdminDb();
  if (!db) throw new Error("Firebase admin not initialised");
  const ref = await db.collection("listings").add(stripUndefined(doc));
  return ref.id;
}
