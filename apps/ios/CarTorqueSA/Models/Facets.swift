import Foundation

struct ListingFacets: Codable {
    let makes: [String]
    let modelsByMake: [String: [String]]
    let years: [Int]
    let maxMileage: Int
    let provinces: [String]

    static let empty = ListingFacets(
        makes: [],
        modelsByMake: [:],
        years: [],
        maxMileage: 200_000,
        provinces: []
    )
}

struct ListingFilters {
    var make: String?
    var model: String?
    var yearFrom: Int?
    var maxMileage: Int?
    var minPrice: Double?
    var maxPrice: Double?
    var province: String?
    var verifiedOnly: Bool = false

    var isActive: Bool {
        make != nil || model != nil || yearFrom != nil || maxMileage != nil ||
        minPrice != nil || maxPrice != nil || province != nil || verifiedOnly
    }

    func apply(to listings: [Listing]) -> [Listing] {
        listings.filter { listing in
            if let make = make, !make.isEmpty {
                guard listing.make.lowercased() == make.lowercased() else { return false }
            }
            if let model = model, !model.isEmpty {
                guard listing.model.lowercased() == model.lowercased() else { return false }
            }
            if let yearFrom = yearFrom {
                guard listing.year >= yearFrom else { return false }
            }
            if let maxMileage = maxMileage {
                guard listing.mileageKm <= maxMileage else { return false }
            }
            if let minPrice = minPrice {
                guard listing.priceZar >= minPrice else { return false }
            }
            if let maxPrice = maxPrice {
                guard listing.priceZar <= maxPrice else { return false }
            }
            if let province = province, !province.isEmpty {
                guard listing.province?.lowercased() == province.lowercased() else { return false }
            }
            if verifiedOnly {
                guard listing.isVerified else { return false }
            }
            return true
        }
    }

    mutating func clear() {
        make = nil
        model = nil
        yearFrom = nil
        maxMileage = nil
        minPrice = nil
        maxPrice = nil
        province = nil
        verifiedOnly = false
    }
}
