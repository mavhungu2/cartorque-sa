import Foundation
import Observation

@Observable
final class BrowseViewModel {
    private(set) var allListings: [Listing] = []
    private(set) var facets: ListingFacets = .empty
    private(set) var isLoading = false
    private(set) var error: String?

    var filters = ListingFilters()
    var showFilterSheet = false

    var filteredListings: [Listing] {
        filters.isActive ? filters.apply(to: allListings) : allListings
    }

    var resultCount: Int { filteredListings.count }

    func load() async {
        isLoading = true
        error = nil
        do {
            let response = try await APIClient.shared.fetchListings()
            allListings = response.listings
            facets = response.facets
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    func refresh() async {
        await load()
    }

    func applyFilters(_ newFilters: ListingFilters) {
        filters = newFilters
    }

    func clearFilters() {
        filters.clear()
    }
}
