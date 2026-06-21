import Foundation

struct VideosResponse: Codable {
    let channel: ChannelInfo
    let videos: [VideoItem]
    let categories: [VideoCategory]
}

struct ChannelInfo: Codable {
    let name: String
    let handle: String?
    let url: String?
    let tagline: String?
    let about: String?
}

struct VideoItem: Codable, Identifiable {
    let id: String
    let title: String
    let category: String?
    let description: String?

    var thumbnailURL: URL? {
        URL(string: "https://i.ytimg.com/vi/\(id)/hqdefault.jpg")
    }

    var youtubeURL: URL? {
        URL(string: "https://www.youtube.com/watch?v=\(id)")
    }
}

struct VideoCategory: Codable, Identifiable {
    let slug: String
    let title: String
    let blurb: String?

    var id: String { slug }
}
