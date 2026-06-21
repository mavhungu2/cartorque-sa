import SwiftUI

struct ListingDetailView: View {
    let listing: Listing
    @State private var selectedPhotoIndex = 0
    @Environment(\.openURL) private var openURL

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                photoPager
                infoBlock
                specsGrid
                if let description = listing.description, !description.isEmpty {
                    descriptionBlock(description)
                }
                if let videoId = listing.videoReviewUrl {
                    videoReviewCard(videoId: videoId)
                }
                safetyTips
                Spacer(minLength: 80)
            }
        }
        .background(Theme.bg)
        .ignoresSafeArea(edges: .top)
        .overlay(alignment: .bottom) { ctaBar }
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(Theme.ink.opacity(0.0), for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
    }

    // MARK: - Photo Pager

    private var photoPager: some View {
        Group {
            if listing.photos.isEmpty {
                Rectangle()
                    .fill(Theme.border)
                    .aspectRatio(16/9, contentMode: .fill)
                    .overlay(
                        Image(systemName: "car.fill")
                            .font(.system(size: 60))
                            .foregroundStyle(Theme.muted)
                    )
            } else {
                ZStack(alignment: .bottom) {
                    TabView(selection: $selectedPhotoIndex) {
                        ForEach(listing.photos.indices, id: \.self) { index in
                            AsyncImage(url: URL(string: listing.photos[index])) { phase in
                                switch phase {
                                case .success(let image):
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fill)
                                case .failure:
                                    Color(Theme.border)
                                        .overlay(Image(systemName: "photo").foregroundStyle(Theme.muted))
                                case .empty:
                                    Color(Theme.border)
                                        .overlay(ProgressView().tint(Theme.muted))
                                @unknown default:
                                    Color(Theme.border)
                                }
                            }
                            .tag(index)
                            .clipped()
                        }
                    }
                    .tabViewStyle(.page(indexDisplayMode: .never))
                    .frame(height: 280)

                    if listing.photos.count > 1 {
                        pageDots
                    }
                }
            }
        }
    }

    private var pageDots: some View {
        HStack(spacing: 6) {
            ForEach(listing.photos.indices, id: \.self) { index in
                Circle()
                    .fill(index == selectedPhotoIndex ? Theme.accent : Color.white.opacity(0.5))
                    .frame(width: index == selectedPhotoIndex ? 8 : 6,
                           height: index == selectedPhotoIndex ? 8 : 6)
                    .animation(.easeInOut(duration: 0.2), value: selectedPhotoIndex)
            }
        }
        .padding(.bottom, 12)
    }

    // MARK: - Info Block

    private var infoBlock: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(listing.title)
                        .font(.title3.bold())
                        .foregroundStyle(Theme.ink)

                    HStack(spacing: 6) {
                        if listing.isNew {
                            ChipLabel(text: "NEW", background: Theme.ink, foreground: Theme.accent)
                        }
                        if let badge = listing.verifiedBadgeText {
                            ChipLabel(text: badge, background: Theme.accent, foreground: Theme.ink)
                        }
                        if listing.negotiable {
                            ChipLabel(text: "Negotiable", background: Theme.bg, foreground: Theme.muted)
                        }
                    }
                }
                Spacer()
            }

            Text(Formatters.formatZAR(listing.priceZar))
                .font(.title2.bold())
                .foregroundStyle(Theme.ink)

            if let monthly = listing.monthlyZar {
                Text("± \(Formatters.formatZAR(monthly))/pm")
                    .font(.subheadline)
                    .foregroundStyle(Theme.muted)
            }
        }
        .padding(16)
        .background(Theme.card)
    }

    // MARK: - Specs Grid

    private var specsGrid: some View {
        let specs: [(String, String)] = [
            ("Condition", listing.conditionDisplay),
            ("Year", String(listing.year)),
            ("Mileage", Formatters.formatMileage(listing.mileageKm, condition: listing.condition)),
            ("Transmission", listing.transmissionDisplay),
            ("Fuel Type", listing.fuelTypeDisplay),
            listing.bodyType.map { ("Body Type", $0) },
            listing.color.map { ("Colour", $0) },
            (listing.location != nil || listing.province != nil) ? ("Location", [listing.location, listing.province].compactMap { $0 }.joined(separator: ", ")) : nil
        ].compactMap { $0 }

        return VStack(alignment: .leading, spacing: 0) {
            Text("Specifications")
                .font(.headline)
                .foregroundStyle(Theme.ink)
                .padding(.horizontal, 16)
                .padding(.top, 16)
                .padding(.bottom, 12)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 0) {
                ForEach(specs.indices, id: \.self) { i in
                    SpecCell(label: specs[i].0, value: specs[i].1, isAlternate: i % 2 != 0)
                }
            }
        }
        .background(Theme.card)
        .padding(.top, 12)
    }

    // MARK: - Description

    private func descriptionBlock(_ text: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Description")
                .font(.headline)
                .foregroundStyle(Theme.ink)
            Text(text)
                .font(.body)
                .foregroundStyle(Theme.ink)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.card)
        .padding(.top, 12)
    }

    // MARK: - Video Review

    private func videoReviewCard(videoId: String) -> some View {
        let youtubeURL = URL(string: "https://www.youtube.com/watch?v=\(videoId)")
        let thumbnailURL = URL(string: "https://i.ytimg.com/vi/\(videoId)/hqdefault.jpg")

        return Button {
            if let url = youtubeURL { openURL(url) }
        } label: {
            VStack(alignment: .leading, spacing: 0) {
                AsyncImage(url: thumbnailURL) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().aspectRatio(16/9, contentMode: .fill).clipped()
                    default:
                        Color(Theme.border).aspectRatio(16/9, contentMode: .fill)
                    }
                }
                .overlay(
                    Image(systemName: "play.circle.fill")
                        .font(.system(size: 48))
                        .foregroundStyle(Color.white)
                        .shadow(radius: 4)
                )

                VStack(alignment: .leading, spacing: 4) {
                    Text("Watch the Car Torque Review")
                        .font(.subheadline.bold())
                        .foregroundStyle(Theme.ink)
                    Text("Opens YouTube")
                        .font(.caption)
                        .foregroundStyle(Theme.muted)
                }
                .padding(12)
            }
            .background(Theme.card)
            .cornerRadius(12)
        }
        .buttonStyle(.plain)
        .padding(.horizontal, 16)
        .padding(.top, 12)
    }

    // MARK: - Safety Tips

    private var safetyTips: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "shield.fill")
                .foregroundStyle(Theme.accent)
                .font(.subheadline)
                .padding(.top, 2)
            Text("Always meet in a safe public place. Never pay before seeing the car and original NaTIS papers.")
                .font(.caption)
                .foregroundStyle(Theme.muted)
        }
        .padding(16)
        .background(Theme.accent.opacity(0.08))
        .cornerRadius(10)
        .padding(.horizontal, 16)
        .padding(.top, 12)
    }

    // MARK: - CTA Bar

    private var ctaBar: some View {
        VStack(spacing: 10) {
            if let whatsapp = listing.ownerWhatsapp {
                Button {
                    openWhatsApp(phone: whatsapp, title: listing.title)
                } label: {
                    Label("WhatsApp seller", systemImage: "message.fill")
                }
                .buttonStyle(PrimaryButtonStyle())
            }

            HStack(spacing: 10) {
                if let phone = listing.ownerPhone {
                    Button {
                        if let url = URL(string: "tel:\(phone.filter { $0.isNumber })") {
                            openURL(url)
                        }
                    } label: {
                        Label("Call", systemImage: "phone.fill")
                    }
                    .buttonStyle(OutlineButtonStyle())
                }

                if listing.ownerPhone == nil && listing.ownerWhatsapp == nil, let email = listing.ownerEmail {
                    Button {
                        if let url = URL(string: "mailto:\(email)") { openURL(url) }
                    } label: {
                        Label("Email", systemImage: "envelope.fill")
                    }
                    .buttonStyle(OutlineButtonStyle())
                }

                NavigationLink(value: FinanceDestination(listing: listing)) {
                    Text("Apply for Finance")
                        .font(.headline)
                        .foregroundStyle(Theme.ink)
                        .frame(maxWidth: .infinity, minHeight: 50)
                        .background(Theme.accent2)
                        .cornerRadius(10)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(
            Rectangle()
                .fill(Theme.card)
                .shadow(color: Color.black.opacity(0.1), radius: 8, y: -2)
        )
    }

    private func openWhatsApp(phone: String, title: String) {
        let digits = phone.filter { $0.isNumber }
        let message = "Hi, I saw your \(title) on Car Torque SA — is it still available?"
        guard let encoded = message.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "https://wa.me/\(digits)?text=\(encoded)") else { return }
        openURL(url)
    }
}

// MARK: - Spec Cell

private struct SpecCell: View {
    let label: String
    let value: String
    let isAlternate: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.caption)
                .foregroundStyle(Theme.muted)
            Text(value)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(Theme.ink)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(isAlternate ? Theme.bg : Theme.card)
    }
}

// MARK: - Finance Destination

struct FinanceDestination: Hashable {
    let listing: Listing
}
