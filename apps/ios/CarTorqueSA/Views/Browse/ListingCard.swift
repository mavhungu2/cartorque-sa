import SwiftUI

struct ListingCard: View {
    let listing: Listing

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            photoSection
            infoSection
        }
        .background(Theme.card)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.06), radius: 6, x: 0, y: 2)
    }

    private var photoSection: some View {
        ZStack(alignment: .topLeading) {
            Group {
                if let firstPhoto = listing.photos.first, let url = URL(string: firstPhoto) {
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        case .failure:
                            placeholderPhoto
                        case .empty:
                            Color(Theme.border)
                                .overlay(ProgressView().tint(Theme.muted))
                        @unknown default:
                            placeholderPhoto
                        }
                    }
                } else {
                    placeholderPhoto
                }
            }
            .aspectRatio(4/3, contentMode: .fill)
            .clipped()

            VStack(alignment: .leading, spacing: 4) {
                if listing.isNew {
                    ChipLabel(text: "NEW", background: Theme.ink, foreground: Theme.accent)
                }
                if let badge = listing.verifiedBadgeText {
                    ChipLabel(text: badge, background: Theme.accent, foreground: Theme.ink)
                }
            }
            .padding(8)
        }
    }

    private var placeholderPhoto: some View {
        Color(Theme.border)
            .overlay(
                Image(systemName: "car.fill")
                    .font(.system(size: 36))
                    .foregroundStyle(Theme.muted)
            )
    }

    private var infoSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(listing.title)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(Theme.ink)
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)

            Text(Formatters.formatZAR(listing.priceZar))
                .font(.headline.bold())
                .foregroundStyle(Theme.ink)

            if let monthly = listing.monthlyZar {
                Text("± \(Formatters.formatZAR(monthly))/pm")
                    .font(.caption)
                    .foregroundStyle(Theme.muted)
            }

            HStack(spacing: 4) {
                // String(...) avoids SwiftUI's locale grouping on Int interpolation ("2 026").
                Text(String(listing.year))
                Text("•")
                Text(Formatters.formatMileage(listing.mileageKm, condition: listing.condition))
                if let location = listing.location {
                    Text("•")
                    Text(location)
                        .lineLimit(1)
                }
            }
            .font(.caption)
            .foregroundStyle(Theme.muted)
        }
        .padding(10)
    }
}
