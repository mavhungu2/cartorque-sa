import SwiftUI

private let mileageBrackets: [Int] = [10_000, 25_000, 50_000, 75_000, 100_000, 150_000, 200_000]

struct FilterSheet: View {
    let facets: ListingFacets
    @Binding var isPresented: Bool
    let onApply: (ListingFilters) -> Void
    let onClear: () -> Void

    @State private var draftFilters = ListingFilters()

    var availableMileageBrackets: [Int] {
        mileageBrackets.filter { $0 <= facets.maxMileage }
    }

    var availableModels: [String] {
        if let make = draftFilters.make, !make.isEmpty {
            return facets.modelsByMake[make] ?? []
        }
        return facets.modelsByMake.values.flatMap { $0 }.sorted()
    }

    var body: some View {
        NavigationStack {
            Form {
                makeModelSection
                yearSection
                mileageSection
                priceSection
                provinceSection
                verifiedSection
            }
            .scrollContentBackground(.hidden)
            .background(Theme.bg)
            .navigationTitle("Filter")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Theme.ink, for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        isPresented = false
                    }
                    .foregroundStyle(Theme.accent)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Apply") {
                        onApply(draftFilters)
                        isPresented = false
                    }
                    .foregroundStyle(Theme.accent)
                    .fontWeight(.bold)
                }
            }
            .safeAreaInset(edge: .bottom) {
                clearButton
            }
        }
    }

    private var makeModelSection: some View {
        Section("Make & Model") {
            Picker("Make", selection: $draftFilters.make) {
                Text("Any Make").tag(String?.none)
                ForEach(facets.makes, id: \.self) { make in
                    Text(make).tag(String?.some(make))
                }
            }
            .onChange(of: draftFilters.make) {
                draftFilters.model = nil
            }

            Picker("Model", selection: $draftFilters.model) {
                Text("Any Model").tag(String?.none)
                ForEach(availableModels, id: \.self) { model in
                    Text(model).tag(String?.some(model))
                }
            }
        }
    }

    private var yearSection: some View {
        Section("Year") {
            Picker("Year From", selection: $draftFilters.yearFrom) {
                Text("Any Year").tag(Int?.none)
                ForEach(facets.years, id: \.self) { year in
                    Text(String(year)).tag(Int?.some(year))
                }
            }
        }
    }

    private var mileageSection: some View {
        Section("Max Mileage") {
            Picker("Max Mileage", selection: $draftFilters.maxMileage) {
                Text("Any").tag(Int?.none)
                ForEach(availableMileageBrackets, id: \.self) { bracket in
                    Text(Formatters.formatMileage(bracket, condition: nil)).tag(Int?.some(bracket))
                }
            }
        }
    }

    private var priceSection: some View {
        Section("Price (ZAR)") {
            HStack {
                Text("Min")
                    .foregroundStyle(Theme.muted)
                Spacer()
                TextField("e.g. 100000", value: $draftFilters.minPrice, format: .number)
                    .keyboardType(.numberPad)
                    .multilineTextAlignment(.trailing)
            }
            HStack {
                Text("Max")
                    .foregroundStyle(Theme.muted)
                Spacer()
                TextField("e.g. 500000", value: $draftFilters.maxPrice, format: .number)
                    .keyboardType(.numberPad)
                    .multilineTextAlignment(.trailing)
            }
        }
    }

    private var provinceSection: some View {
        Section("Province") {
            Picker("Province", selection: $draftFilters.province) {
                Text("Any Province").tag(String?.none)
                ForEach(facets.provinces, id: \.self) { province in
                    Text(province).tag(String?.some(province))
                }
            }
        }
    }

    private var verifiedSection: some View {
        Section {
            Toggle("Verified listings only", isOn: $draftFilters.verifiedOnly)
                .tint(Theme.accent)
        }
    }

    private var clearButton: some View {
        Button {
            draftFilters.clear()
            onClear()
            isPresented = false
        } label: {
            Text("Clear All Filters")
        }
        .buttonStyle(OutlineButtonStyle())
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Theme.bg)
    }
}
