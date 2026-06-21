import SwiftUI

struct VideosView: View {
    @State private var viewModel = VideosViewModel()
    @Environment(\.openURL) private var openURL

    var body: some View {
        Group {
            if viewModel.isLoading && viewModel.videos.isEmpty {
                LoadingView()
            } else if let error = viewModel.error, viewModel.videos.isEmpty {
                ErrorView(message: error) {
                    Task { await viewModel.load() }
                }
            } else if viewModel.videos.isEmpty {
                EmptyStateView(
                    title: "No videos yet",
                    message: "Check back soon for Car Torque SA reviews.",
                    systemImage: "play.rectangle.fill"
                )
            } else {
                videoList
            }
        }
        .brandNavigationBar(title: "Videos")
        .task {
            if viewModel.videos.isEmpty {
                await viewModel.load()
            }
        }
    }

    private var videoList: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(viewModel.videos) { video in
                    VideoCard(video: video)
                        .onTapGesture {
                            if let url = video.youtubeURL { openURL(url) }
                        }
                }
            }
            .padding(16)
        }
        .background(Theme.bg)
        .refreshable {
            await viewModel.refresh()
        }
    }
}

struct VideoCard: View {
    let video: VideoItem

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            thumbnailSection
            infoSection
        }
        .background(Theme.card)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.06), radius: 6, x: 0, y: 2)
    }

    private var thumbnailSection: some View {
        ZStack {
            AsyncImage(url: video.thumbnailURL) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                case .failure:
                    Color(Theme.border)
                        .overlay(Image(systemName: "video.fill").foregroundStyle(Theme.muted))
                case .empty:
                    Color(Theme.border).overlay(ProgressView().tint(Theme.muted))
                @unknown default:
                    Color(Theme.border)
                }
            }
            .aspectRatio(16/9, contentMode: .fill)
            .clipped()

            Image(systemName: "play.circle.fill")
                .font(.system(size: 44))
                .foregroundStyle(Color.white)
                .shadow(color: Color.black.opacity(0.4), radius: 4)
        }
    }

    private var infoSection: some View {
        VStack(alignment: .leading, spacing: 6) {
            if let category = video.category {
                ChipLabel(text: category.uppercased(), background: Theme.accent, foreground: Theme.ink)
            }

            Text(video.title)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(Theme.ink)
                .lineLimit(2)

            if let description = video.description, !description.isEmpty {
                Text(description)
                    .font(.caption)
                    .foregroundStyle(Theme.muted)
                    .lineLimit(2)
            }
        }
        .padding(12)
    }
}
