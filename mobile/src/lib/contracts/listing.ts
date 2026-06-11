// MIRROR of cartorque-sa/src/lib/mock-listings.ts (types + filter/facet logic).
// Do not edit independently — run `npm run check-contracts` to verify sync.
// The REST API at /api/v1 is the runtime contract; these types describe it.

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
  monthlyZar?: number;
  condition?: "new" | "used";
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
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  province?: string;
  verifiedOnly?: boolean;
};

export type ListingFacets = {
  makes: string[];
  modelsByMake: Record<string, string[]>;
  years: number[];
  maxMileage: number;
  provinces: string[];
};

export function applyListingFilters(items: Listing[], filters: ListingFilters): Listing[] {
  return items.filter((l) => {
    if (filters.make && l.make.toLowerCase() !== filters.make.toLowerCase()) return false;
    if (filters.model && l.model.toLowerCase() !== filters.model.toLowerCase()) return false;
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
