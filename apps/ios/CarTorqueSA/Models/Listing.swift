import Foundation

struct Listing: Codable, Identifiable, Hashable {
    let id: String
    let ownerId: String?
    let ownerName: String?
    let ownerPhone: String?
    let ownerWhatsapp: String?
    let ownerEmail: String?
    let title: String
    let make: String
    let model: String
    let variant: String?
    let year: Int
    let mileageKm: Int
    let transmission: String?
    let fuelType: String?
    let bodyType: String?
    let color: String?
    let priceZar: Double
    let monthlyZar: Double?
    let condition: String?
    let negotiable: Bool
    let location: String?
    let province: String?
    let description: String?
    let photos: [String]
    let status: String?
    let verified: String?
    let videoReviewUrl: String?
    let createdAt: String?
    let updatedAt: String?

    var isNew: Bool {
        condition == "new"
    }

    var isVerified: Bool {
        verified != nil && verified != "unverified"
    }

    var verifiedBadgeText: String? {
        switch verified {
        case "vin_checked": return "VIN VERIFIED"
        case "fully_verified": return "✓ REVIEWED"
        default: return nil
        }
    }

    var transmissionDisplay: String {
        switch transmission {
        case "manual": return "Manual"
        case "automatic": return "Automatic"
        case "dct": return "DCT"
        case "cvt": return "CVT"
        default: return transmission?.capitalized ?? "—"
        }
    }

    var fuelTypeDisplay: String {
        switch fuelType {
        case "petrol": return "Petrol"
        case "diesel": return "Diesel"
        case "hybrid": return "Hybrid"
        case "electric": return "Electric"
        default: return fuelType?.capitalized ?? "—"
        }
    }

    var conditionDisplay: String {
        switch condition {
        case "new": return "New"
        case "used": return "Used"
        default: return condition?.capitalized ?? "—"
        }
    }

    static func == (lhs: Listing, rhs: Listing) -> Bool {
        lhs.id == rhs.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

struct ListingsResponse: Codable {
    let listings: [Listing]
    let facets: ListingFacets
    let total: Int
    let nextCursor: String?
}

struct ListingDetailResponse: Codable {
    let listing: Listing
}
