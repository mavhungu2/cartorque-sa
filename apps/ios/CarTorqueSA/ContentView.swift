import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            NavigationStack {
                BrowseView()
                    .navigationDestination(for: FinanceDestination.self) { dest in
                        FinanceFormView(prefilledListing: dest.listing)
                    }
            }
            .tabItem {
                Label("Browse", systemImage: "car.fill")
            }

            NavigationStack {
                FinanceFormView(prefilledListing: nil)
            }
            .tabItem {
                Label("Finance", systemImage: "doc.text.fill")
            }

            NavigationStack {
                VideosView()
            }
            .tabItem {
                Label("Videos", systemImage: "play.rectangle.fill")
            }

            NavigationStack {
                MoreView()
            }
            .tabItem {
                Label("More", systemImage: "ellipsis.circle.fill")
            }
        }
        .tint(Theme.accent)
        .onAppear {
            configureTabBarAppearance()
        }
    }

    private func configureTabBarAppearance() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(Theme.ink)

        let normalAttrs: [NSAttributedString.Key: Any] = [
            .foregroundColor: UIColor(Theme.tabUnselected)
        ]
        let selectedAttrs: [NSAttributedString.Key: Any] = [
            .foregroundColor: UIColor(Theme.accent)
        ]

        appearance.stackedLayoutAppearance.normal.titleTextAttributes = normalAttrs
        appearance.stackedLayoutAppearance.selected.titleTextAttributes = selectedAttrs
        appearance.stackedLayoutAppearance.normal.iconColor = UIColor(Theme.tabUnselected)
        appearance.stackedLayoutAppearance.selected.iconColor = UIColor(Theme.accent)

        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
}
