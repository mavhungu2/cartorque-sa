// Listings data layer. Reads from Firestore when configured; falls back to
// seeded mock data so the UI works before Firebase is wired up.
import "server-only";
import { adminConfigured, getAdminDb } from "./firebase/admin";

export type ListingStatus = "draft" | "pending_review" | "live" | "sold" | "withdrawn" | "flagged";
export type VerifiedStatus = "unverified" | "vin_checked" | "fully_verified";
export type Transmission = "manual" | "automatic" | "dct" | "cvt";
export type FuelType = "petrol" | "diesel" | "hybrid" | "electric";

export type Listing = {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone?: string; // E.164 if present (e.g. +27...)
  ownerWhatsapp?: string;
  ownerEmail?: string;

  title: string; // computed: "2019 Renault Clio IV Expression"
  make: string;
  model: string;
  variant?: string;
  year: number;
  mileageKm: number;
  transmission: Transmission;
  fuelType: FuelType;
  bodyType?: string;
  color?: string;

  priceZar: number;
  negotiable: boolean;

  location: string; // city, e.g. "Johannesburg"
  province: string; // e.g. "Gauteng"

  description: string;
  photos: string[]; // image URLs (Storage URLs once we wire that)

  status: ListingStatus;
  verified: VerifiedStatus;
  videoReviewUrl?: string; // optional CarTorque-recorded review

  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type ListingFilters = {
  make?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  province?: string;
  verifiedOnly?: boolean;
};

export const PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Mpumalanga",
  "Limpopo",
  "North West",
  "Northern Cape",
] as const;

export const MAKES = [
  "Audi", "BMW", "Chery", "Citroën", "Datsun", "Fiat", "Ford", "Haval",
  "Honda", "Hyundai", "Isuzu", "Jeep", "Kia", "Land Rover", "Mahindra",
  "Mazda", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Nissan", "Opel",
  "Peugeot", "Porsche", "Renault", "Suzuki", "Toyota", "Volkswagen", "Volvo",
] as const;

// ------- Mock data ----------------------------------------------------------

const MOCK_LISTINGS: Listing[] = [
  {
    id: "mock-1",
    ownerId: "mock-user-1",
    ownerName: "Thabo M.",
    ownerPhone: "+27821234567",
    ownerWhatsapp: "+27821234567",
    title: "2021 Renault Clio V Zen Turbo",
    make: "Renault",
    model: "Clio",
    variant: "V Zen Turbo",
    year: 2021,
    mileageKm: 48500,
    transmission: "manual",
    fuelType: "petrol",
    bodyType: "Hatchback",
    color: "Pearl White",
    priceZar: 224900,
    negotiable: true,
    location: "Johannesburg",
    province: "Gauteng",
    description:
      "One-owner Clio V, full service history at Renault dealership. Recently serviced (48k major service done). Tyres at 60%. Light city use. Selling because I'm relocating overseas.",
    photos: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&q=80",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1600&q=80",
    ],
    status: "live",
    verified: "vin_checked",
    createdAt: "2026-05-12T08:00:00Z",
    updatedAt: "2026-05-12T08:00:00Z",
  },
  {
    id: "mock-2",
    ownerId: "mock-user-2",
    ownerName: "Lerato K.",
    ownerWhatsapp: "+27839876543",
    title: "2019 Kia Picanto 1.2 Smart",
    make: "Kia",
    model: "Picanto",
    variant: "1.2 Smart",
    year: 2019,
    mileageKm: 72000,
    transmission: "manual",
    fuelType: "petrol",
    bodyType: "Hatchback",
    color: "Signal Red",
    priceZar: 139000,
    negotiable: true,
    location: "Pretoria",
    province: "Gauteng",
    description:
      "Reliable little car. Perfect first car or daily commuter. Service history available, never been in an accident. Some minor stone chips on the bonnet, otherwise immaculate.",
    photos: [
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1600&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&q=80",
    ],
    status: "live",
    verified: "fully_verified",
    videoReviewUrl: "rr7ef1k5G-w",
    createdAt: "2026-05-08T14:30:00Z",
    updatedAt: "2026-05-08T14:30:00Z",
  },
  {
    id: "mock-3",
    ownerId: "mock-user-3",
    ownerName: "Sipho N.",
    ownerPhone: "+27114567890",
    title: "2022 Renault Triber 1.0 Prestige",
    make: "Renault",
    model: "Triber",
    variant: "1.0 Prestige",
    year: 2022,
    mileageKm: 36200,
    transmission: "manual",
    fuelType: "petrol",
    bodyType: "MPV",
    color: "Moonlight Silver",
    priceZar: 199500,
    negotiable: false,
    location: "Durban",
    province: "KwaZulu-Natal",
    description:
      "7-seater family car. Third row is genuinely usable. Got a bigger SUV recently so this needs to go. Full service history, balance of factory warranty. Bluetooth, cruise control, reverse camera.",
    photos: [
      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=1600&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1600&q=80",
    ],
    status: "live",
    verified: "vin_checked",
    createdAt: "2026-05-20T11:15:00Z",
    updatedAt: "2026-05-20T11:15:00Z",
  },
  {
    id: "mock-4",
    ownerId: "mock-user-4",
    ownerName: "Ayanda P.",
    ownerWhatsapp: "+27761112222",
    title: "2018 Renault Megane RS 280 Cup",
    make: "Renault",
    model: "Megane",
    variant: "RS 280 Cup",
    year: 2018,
    mileageKm: 65000,
    transmission: "manual",
    fuelType: "petrol",
    bodyType: "Hatchback",
    color: "Tonic Orange",
    priceZar: 489000,
    negotiable: true,
    location: "Cape Town",
    province: "Western Cape",
    description:
      "Iconic hot hatch. Cup chassis with Torsen diff, original Recaro buckets. Stage 1 remap (around 320hp), full set of stock parts available. Track-day specced but daily-driveable. Heart-breaker to sell.",
    photos: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=80",
    ],
    status: "live",
    verified: "fully_verified",
    videoReviewUrl: "IFkvWYvKIpQ",
    createdAt: "2026-04-28T16:45:00Z",
    updatedAt: "2026-05-01T09:00:00Z",
  },
  {
    id: "mock-5",
    ownerId: "mock-user-5",
    ownerName: "Daniel V.",
    ownerPhone: "+27828887766",
    title: "2020 Renault Kwid 1.0 Dynamique",
    make: "Renault",
    model: "Kwid",
    variant: "1.0 Dynamique",
    year: 2020,
    mileageKm: 41000,
    transmission: "manual",
    fuelType: "petrol",
    bodyType: "Hatchback",
    color: "Outback Bronze",
    priceZar: 119900,
    negotiable: true,
    location: "Port Elizabeth",
    province: "Eastern Cape",
    description:
      "Cheap to run, sips fuel (around 5L/100km in town). Aircon icy. Reverse camera. Touchscreen with Bluetooth and Android Auto. Selling because I'm getting a company car.",
    photos: [
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1600&q=80",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1600&q=80",
    ],
    status: "live",
    verified: "unverified",
    createdAt: "2026-05-26T07:20:00Z",
    updatedAt: "2026-05-26T07:20:00Z",
  },
  {
    id: "mock-pending-1",
    ownerId: "mock-user-7",
    ownerName: "Mandla S.",
    ownerEmail: "mandla@example.com",
    ownerWhatsapp: "+27791110000",
    title: "2015 Volkswagen Polo 1.2 TSI Comfortline",
    make: "Volkswagen",
    model: "Polo",
    variant: "1.2 TSI Comfortline",
    year: 2015,
    mileageKm: 168000,
    transmission: "manual",
    fuelType: "petrol",
    bodyType: "Hatchback",
    color: "Reflex Silver",
    priceZar: 124900,
    negotiable: true,
    location: "Centurion",
    province: "Gauteng",
    description:
      "Honest second-owner Polo. Full service history. New cambelt at 160k. Selling because I bought a bakkie. Has the usual age dents but mechanically excellent.",
    photos: [
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&q=80",
    ],
    status: "pending_review",
    verified: "unverified",
    createdAt: "2026-05-30T09:00:00Z",
    updatedAt: "2026-05-30T09:00:00Z",
  },
  {
    id: "mock-6",
    ownerId: "mock-user-6",
    ownerName: "Nokuthula B.",
    ownerWhatsapp: "+27713334444",
    title: "2017 Toyota Corolla Quest 1.6 Plus",
    make: "Toyota",
    model: "Corolla",
    variant: "Quest 1.6 Plus",
    year: 2017,
    mileageKm: 124000,
    transmission: "manual",
    fuelType: "petrol",
    bodyType: "Sedan",
    color: "Silver Metallic",
    priceZar: 159000,
    negotiable: true,
    location: "Bloemfontein",
    province: "Free State",
    description:
      "Bulletproof Toyota Corolla. High kays but everything works. Just had a major service, new clutch fitted at 119k. Tyres are okay, will probably need new front pair in 10k or so. All paperwork in order.",
    photos: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1600&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1600&q=80",
    ],
    status: "live",
    verified: "vin_checked",
    createdAt: "2026-05-18T13:00:00Z",
    updatedAt: "2026-05-18T13:00:00Z",
  },
];

// ------- API ----------------------------------------------------------------

function applyFilters(items: Listing[], filters: ListingFilters): Listing[] {
  return items.filter((l) => {
    if (filters.make && l.make.toLowerCase() !== filters.make.toLowerCase()) return false;
    if (filters.minPrice !== undefined && l.priceZar < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && l.priceZar > filters.maxPrice) return false;
    if (filters.minYear !== undefined && l.year < filters.minYear) return false;
    if (filters.maxYear !== undefined && l.year > filters.maxYear) return false;
    if (filters.maxMileage !== undefined && l.mileageKm > filters.maxMileage) return false;
    if (filters.province && l.province !== filters.province) return false;
    if (filters.verifiedOnly && l.verified === "unverified") return false;
    return true;
  });
}

export async function listLiveListings(filters: ListingFilters = {}): Promise<Listing[]> {
  if (!adminConfigured()) {
    // Mock path
    const live = MOCK_LISTINGS.filter((l) => l.status === "live");
    return applyFilters(live, filters).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const db = getAdminDb();
  if (!db) return [];
  // Firestore: filter by status first (indexed), do remaining filters in memory for now.
  // Phase 2 will move common filters into the query and add composite indexes.
  const snap = await db
    .collection("listings")
    .where("status", "==", "live")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Listing);
  return applyFilters(items, filters);
}

export async function getListing(id: string): Promise<Listing | null> {
  if (!adminConfigured()) {
    return MOCK_LISTINGS.find((l) => l.id === id) ?? null;
  }
  const db = getAdminDb();
  if (!db) return null;
  const doc = await db.collection("listings").doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data() as Omit<Listing, "id">;
  if (data.status !== "live") return null;
  return { id: doc.id, ...data };
}

export type NewListingInput = Omit<
  Listing,
  "id" | "status" | "verified" | "createdAt" | "updatedAt" | "title" | "ownerId"
> & { ownerId?: string };

export async function listPendingListings(): Promise<Listing[]> {
  if (!adminConfigured()) {
    return MOCK_LISTINGS.filter((l) => l.status === "pending_review").sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  const db = getAdminDb();
  if (!db) return [];
  const snap = await db
    .collection("listings")
    .where("status", "==", "pending_review")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Listing);
}

export async function setListingStatus(
  id: string,
  status: ListingStatus,
): Promise<void> {
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
    // Demo mode — push into the in-memory mock list with pending_review status so
    // the admin moderation flow has something to act on. Resets on server restart.
    const id = `demo-${Date.now()}`;
    MOCK_LISTINGS.unshift({ ...doc, id });
    return id;
  }

  const db = getAdminDb();
  if (!db) throw new Error("Firebase admin not initialised");
  const ref = await db.collection("listings").add(doc);
  return ref.id;
}
