import Foundation
import Observation

@Observable
final class VideosViewModel {
    private(set) var videos: [VideoItem] = []
    private(set) var isLoading = false
    private(set) var error: String?

    func load() async {
        isLoading = true
        error = nil
        do {
            let response = try await APIClient.shared.fetchVideos()
            videos = response.videos
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    func refresh() async {
        await load()
    }
}
