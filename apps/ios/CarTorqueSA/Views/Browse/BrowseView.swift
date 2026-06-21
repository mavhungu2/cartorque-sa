import SwiftUI

struct BrowseView: View {
    @State private var viewModel = BrowseViewModel()

    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12)
    ]

    var body: some View {
        Group {
            if viewModel.isLoading && viewModel.allListings.isEmpty {
                LoadingView()
            } else if let error = viewModel.error, viewModel.allListings.isEmpty {
                ErrorView(message: error) {
                    Task { await viewModel.load() }
                }
            } else if viewModel.filteredListings.isEmpty && !viewModel.allListings.isEmpty {
                EmptyStateView(
                    title: "No results",
                    message: "Try adjusting your filters to find more cars.",
                    systemImage: "car.fill"
                )
                .overlay(alignment: .top) { filterBar }
            } else if viewModel.allListings.isEmpty {
                EmptyStateView(
                    title: "No listings yet",
                    message: "Check back soon for great cars from Car Torque SA.",
                    systemImage: "car.fill"
                )
            } else {
                listingsGrid
            }
        }
        .brandNavigationBar(title: "Car Torque SA")
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                filterButton
            }
        }
        .sheet(isPresented: $viewModel.showFilterSheet) {
            FilterSheet(
                facets: viewModel.facets,
                isPresented: $viewModel.showFilterSheet,
                onApply: { viewModel.applyFilters($0) },
                onClear: { viewModel.clearFilters() }
            )
        }
        .task {
            if viewModel.allListings.isEmpty {
                await viewModel.load()
            }
        }
    }

    private var listingsGrid: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                filterBar

                if viewModel.filters.isActive {
                    Text("\(viewModel.resultCount) result\(viewModel.resultCount == 1 ? "" : "s")")
                        .font(.caption)
                        .foregroundStyle(Theme.muted)
                        .padding(.horizontal, 16)
                        .padding(.bottom, 8)
                }

                LazyVGrid(columns: columns, spacing: 12) {
                    ForEach(viewModel.filteredListings) { listing in
                        NavigationLink(value: listing) {
                            ListingCard(listing: listing)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 12)
                .padding(.bottom, 16)
            }
        }
        .background(Theme.bg)
        .refreshable {
            await viewModel.refresh()
        }
        .navigationDestination(for: Listing.self) { listing in
            ListingDetailView(listing: listing)
        }
    }

    private var filterBar: some View {
        HStack {
            Button {
                viewModel.showFilterSheet = true
            } label: {
                HStack(spacing: 6) {
                    Image(systemName: "slider.horizontal.3")
                    Text("Filter")
                    if viewModel.filters.isActive {
                        Circle()
                            .fill(Theme.accent)
                            .frame(width: 8, height: 8)
                    }
                }
                .font(.subheadline.weight(.medium))
                .foregroundStyle(Theme.ink)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(viewModel.filters.isActive ? Theme.accent.opacity(0.15) : Theme.card)
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Theme.border, lineWidth: 1)
                )
            }
            Spacer()
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
    }

    private var filterButton: some View {
        Button {
            viewModel.showFilterSheet = true
        } label: {
            Image(systemName: viewModel.filters.isActive ? "slider.horizontal.3" : "slider.horizontal.3")
                .foregroundStyle(viewModel.filters.isActive ? Theme.accent : Color.white)
        }
    }
}
