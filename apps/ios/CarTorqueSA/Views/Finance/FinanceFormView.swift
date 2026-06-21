import SwiftUI

struct FinanceFormView: View {
    let prefilledListing: Listing?

    @State private var viewModel = FinanceViewModel()

    var body: some View {
        Group {
            if let refId = viewModel.submittedReferenceId {
                FinanceSuccessView(referenceId: refId) {
                    viewModel.reset()
                }
            } else {
                formContent
            }
        }
        .brandNavigationBar(title: "Finance Pre-Approval")
        .onAppear {
            if let listing = prefilledListing {
                viewModel.prefill(listing: listing)
            }
        }
    }

    private var formContent: some View {
        ScrollView {
            VStack(spacing: 24) {
                disclaimerBanner

                vehicleSection
                aboutYouSection
                employmentSection
                instalmentEstimate
                consentsSection
                submitButton
            }
            .padding(16)
        }
        .background(Theme.bg)
    }

    // MARK: - Disclaimer

    private var disclaimerBanner: some View {
        Text("Car Torque SA is not a credit provider and does not make credit decisions. Applications are forwarded to credit providers registered with the National Credit Regulator (NCR). Approval, rates and terms are determined solely by the credit provider. Submitting this form does not guarantee finance.")
            .font(.caption)
            .foregroundStyle(Theme.muted)
            .padding(12)
            .background(Theme.border.opacity(0.5))
            .cornerRadius(8)
    }

    // MARK: - Vehicle Section

    private var vehicleSection: some View {
        FormSection(title: "The Car") {
            if let title = viewModel.prefilledTitle {
                LabeledRow(label: "Vehicle", value: title)
                LabeledRow(label: "Price", value: Formatters.formatZAR(viewModel.prefilledPrice ?? 0))
            } else {
                FormField(label: "Vehicle Description") {
                    TextField("e.g. 2020 Toyota Corolla 1.8", text: $viewModel.vehicleDescription)
                        .keyboardType(.default)
                }
                FormField(label: "Purchase Price (ZAR)") {
                    TextField("e.g. 250000", text: $viewModel.purchasePriceText)
                        .keyboardType(.numberPad)
                }
            }

            FormField(label: "Deposit (ZAR)") {
                TextField("e.g. 50000", text: $viewModel.depositText)
                    .keyboardType(.numberPad)
            }

            FormField(label: "Loan Term") {
                Picker("Loan Term", selection: $viewModel.selectedTerm) {
                    ForEach(LoanTermMonths.allCases) { term in
                        Text(term.displayName).tag(term)
                    }
                }
                .pickerStyle(.menu)
            }
        }
    }

    // MARK: - About You Section

    private var aboutYouSection: some View {
        FormSection(title: "About You") {
            FormField(label: "Full Name") {
                TextField("Your full name", text: $viewModel.fullName)
                    .textContentType(.name)
                    .autocorrectionDisabled()
            }

            VStack(alignment: .leading, spacing: 4) {
                FormField(label: "SA ID Number") {
                    TextField("13-digit ID number", text: $viewModel.idNumber)
                        .keyboardType(.numberPad)
                        .onChange(of: viewModel.idNumber) { _, newValue in
                            if newValue.count > 13 {
                                viewModel.idNumber = String(newValue.prefix(13))
                            }
                        }
                }
                if !viewModel.idNumberIsValid && viewModel.idNumber.count == 13 {
                    Text("Invalid South African ID number.")
                        .font(.caption)
                        .foregroundStyle(Theme.danger)
                }
                if let err = viewModel.idFieldError {
                    Text(err)
                        .font(.caption)
                        .foregroundStyle(Theme.danger)
                }
            }

            FormField(label: "Cellphone") {
                TextField("e.g. 0821234567", text: $viewModel.phone)
                    .keyboardType(.phonePad)
                    .textContentType(.telephoneNumber)
            }

            FormField(label: "Email") {
                TextField("your@email.com", text: $viewModel.email)
                    .keyboardType(.emailAddress)
                    .textContentType(.emailAddress)
                    .autocapitalization(.none)
                    .autocorrectionDisabled()
            }

            HStack {
                Text("Has Driver's Licence")
                    .font(.subheadline)
                    .foregroundStyle(Theme.ink)
                Spacer()
                Toggle("", isOn: $viewModel.hasDriversLicence)
                    .tint(Theme.accent)
                    .labelsHidden()
            }
            .padding(.vertical, 4)
        }
    }

    // MARK: - Employment Section

    private var employmentSection: some View {
        FormSection(title: "Employment & Affordability") {
            FormField(label: "Employment Status") {
                Picker("Employment Status", selection: $viewModel.employmentStatus) {
                    ForEach(EmploymentStatus.allCases) { status in
                        Text(status.displayName).tag(status)
                    }
                }
                .pickerStyle(.menu)
            }

            FormField(label: "Employer") {
                TextField("Company / employer name", text: $viewModel.employer)
                    .autocorrectionDisabled()
            }

            FormField(label: "Occupation") {
                TextField("Your job title", text: $viewModel.occupation)
                    .autocorrectionDisabled()
            }

            FormField(label: "Years Employed") {
                TextField("e.g. 3", text: $viewModel.yearsEmployedText)
                    .keyboardType(.numberPad)
            }

            FormField(label: "Gross Monthly Income (ZAR)") {
                TextField("Before tax", text: $viewModel.grossIncomeText)
                    .keyboardType(.numberPad)
            }

            FormField(label: "Net Monthly Income (ZAR)") {
                TextField("After tax (take-home)", text: $viewModel.netIncomeText)
                    .keyboardType(.numberPad)
            }

            FormField(label: "Monthly Expenses (ZAR)") {
                TextField("Rent, food, utilities, etc.", text: $viewModel.monthlyExpensesText)
                    .keyboardType(.numberPad)
            }

            FormField(label: "Existing Credit Commitments (ZAR)") {
                TextField("Existing loan / card repayments", text: $viewModel.existingCreditText)
                    .keyboardType(.numberPad)
            }
        }
    }

    // MARK: - Instalment Estimate

    @ViewBuilder
    private var instalmentEstimate: some View {
        if let estimate = viewModel.illustrativeInstalment {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Illustrative instalment")
                        .font(.caption)
                        .foregroundStyle(Theme.muted)
                    Text(estimate)
                        .font(.title3.bold())
                        .foregroundStyle(Theme.ink)
                }
                Spacer()
                Image(systemName: "info.circle")
                    .foregroundStyle(Theme.muted)
                    .font(.caption)
            }
            .padding(14)
            .background(Theme.accent.opacity(0.12))
            .cornerRadius(10)
            .overlay(
                VStack {
                    Spacer()
                    Text("Illustrative only. Based on 13.5% p.a. Actual rate set by credit provider.")
                        .font(.caption2)
                        .foregroundStyle(Theme.muted)
                        .padding(.horizontal, 14)
                        .padding(.bottom, 8)
                },
                alignment: .bottom
            )
            .padding(.bottom, 8)
        }
    }

    // MARK: - Consents

    private var consentsSection: some View {
        FormSection(title: "Consent") {
            Toggle(isOn: $viewModel.consentPopia) {
                Text("I consent to Car Torque SA processing and sharing my personal information with registered credit providers for the purpose of this application (POPIA).")
                    .font(.caption)
                    .foregroundStyle(Theme.ink)
            }
            .tint(Theme.accent)

            Toggle(isOn: $viewModel.consentCreditCheck) {
                Text("I consent to credit bureau enquiries being conducted in relation to this application.")
                    .font(.caption)
                    .foregroundStyle(Theme.ink)
            }
            .tint(Theme.accent)
        }
    }

    // MARK: - Submit

    private var submitButton: some View {
        VStack(spacing: 8) {
            if let err = viewModel.submissionError {
                Text(err)
                    .font(.caption)
                    .foregroundStyle(Theme.danger)
                    .multilineTextAlignment(.center)
            }

            Button {
                Task { await viewModel.submit() }
            } label: {
                if viewModel.isSubmitting {
                    HStack(spacing: 8) {
                        ProgressView().tint(Theme.ink)
                        Text("Submitting…")
                    }
                } else {
                    Text("Submit Application")
                }
            }
            .buttonStyle(PrimaryButtonStyle())
            .disabled(!viewModel.canSubmit || viewModel.isSubmitting)
            .opacity(viewModel.canSubmit ? 1 : 0.5)
        }
    }
}

// MARK: - Supporting Views

struct FormSection<Content: View>: View {
    let title: String
    @ViewBuilder let content: () -> Content

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(title)
                .font(.headline)
                .foregroundStyle(Theme.ink)
                .padding(.bottom, 12)

            VStack(spacing: 1) {
                content()
            }
            .background(Theme.card)
            .cornerRadius(12)
        }
    }
}

struct FormField<Content: View>: View {
    let label: String
    @ViewBuilder let content: () -> Content

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(.caption.weight(.medium))
                .foregroundStyle(Theme.muted)
            content()
                .font(.subheadline)
                .foregroundStyle(Theme.ink)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.card)
    }
}

struct LabeledRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .foregroundStyle(Theme.muted)
            Spacer()
            Text(value)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(Theme.ink)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .background(Theme.card)
    }
}
