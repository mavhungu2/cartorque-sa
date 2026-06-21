import SwiftUI

struct MoreView: View {
    @Environment(\.openURL) private var openURL

    private let links: [(title: String, icon: String, urlString: String)] = [
        ("Sell my car", "car.badge.plus", "https://cartorque-sa--cartorque-sa.us-east4.hosted.app/sell"),
        ("Watch on YouTube", "play.rectangle.fill", "https://www.youtube.com/@CarTorqueSA"),
        ("Instagram", "camera.fill", "https://www.instagram.com/car_torque_za/"),
        ("Facebook", "person.2.fill", "https://www.facebook.com/profile.php?id=100076080243370"),
        ("Contact us", "envelope.fill", "mailto:hello@cartorque.co.za"),
        ("Privacy Policy", "doc.text.fill", "https://cartorque-sa--cartorque-sa.us-east4.hosted.app/privacy")
    ]

    var body: some View {
        List {
            Section {
                ForEach(links, id: \.title) { link in
                    Button {
                        if let url = URL(string: link.urlString) {
                            openURL(url)
                        }
                    } label: {
                        HStack(spacing: 14) {
                            Image(systemName: link.icon)
                                .font(.system(size: 16))
                                .foregroundStyle(Theme.accent)
                                .frame(width: 24)
                            Text(link.title)
                                .foregroundStyle(Theme.ink)
                            Spacer()
                            Image(systemName: "chevron.right")
                                .font(.caption)
                                .foregroundStyle(Theme.muted)
                        }
                        .padding(.vertical, 4)
                    }
                }
            }

            Section {
                HStack {
                    Spacer()
                    Text("Car Torque SA v1.0 — honest cars from SA.")
                        .font(.caption)
                        .foregroundStyle(Theme.muted)
                        .multilineTextAlignment(.center)
                    Spacer()
                }
                .listRowBackground(Color.clear)
            }
        }
        .scrollContentBackground(.hidden)
        .background(Theme.bg)
        .brandNavigationBar(title: "More")
    }
}
