// Mock listing data + shared types. No "server-only" guard so this can be
// imported from standalone scripts (e.g. scripts/seed-listings.ts).
//
// In production, src/lib/listings.ts reads from Firestore. This file is the
// fallback when Firebase isn't configured, and the seed source for first-time
// Firestore population.

export type ListingStatus =
  | "draft"
  | "pending_review"
  | "live"
  | "sold"
  | "withdrawn"
  | "flagged";
export type VerifiedStatus = "unverified" | "vin_checked" | "fully_verified";
export type Transmission = "manual" | "automatic" | "dct" | "cvt";
export type FuelType = "petrol" | "diesel" | "hybrid" | "electric";

export type Listing = {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone?: string;
  ownerWhatsapp?: string;
  ownerEmail?: string;

  title: string;
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
  monthlyZar?: number; // estimated monthly instalment (dealer-style "±R/pm")
  condition?: "new" | "used"; // absent = used (typical private listing)
  negotiable: boolean;

  location: string;
  province: string;

  description: string;
  photos: string[];

  status: ListingStatus;
  verified: VerifiedStatus;
  videoReviewUrl?: string;

  createdAt: string;
  updatedAt: string;
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
  "Audi", "BMW", "Chery", "Citroën", "Datsun", "Fiat", "Ford", "GWM", "Haval",
  "Honda", "Hyundai", "Isuzu", "Jeep", "Kia", "Land Rover", "Mahindra",
  "Mazda", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Nissan", "Opel",
  "Peugeot", "Porsche", "Renault", "Suzuki", "Toyota", "Volkswagen", "Volvo",
] as const;

export function applyListingFilters(items: Listing[], filters: ListingFilters): Listing[] {
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

export const MOCK_LISTINGS: Listing[] = [
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
