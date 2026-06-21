import Foundation
import Observation

@Observable
final class ListingDetailViewModel {
    private(set) var listing: Listing?
    private(set) var isLoading = false
    private(set) var error: String?

    private let preloaded: Listing?

    init(preloaded: Listing? = nil) {
        self.preloaded = preloaded
        self.listing = preloaded
    }

    func load(id: String) async {
        guard preloaded == nil else { return }
        isLoading = true
        error = nil
        do {
            listing = try await APIClient.shared.fetchListing(id: id)
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }
}
