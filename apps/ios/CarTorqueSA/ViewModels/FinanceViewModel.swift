import Foundation
import Observation

@Observable
final class FinanceViewModel {
    // The car
    var vehicleDescription: String = ""
    var purchasePriceText: String = ""
    var depositText: String = ""
    var selectedTerm: LoanTermMonths = .t72

    // Prefilled listing data
    var prefilledListingId: String?
    var prefilledTitle: String?
    var prefilledPrice: Double?

    // About you
    var fullName: String = ""
    var idNumber: String = ""
    var phone: String = ""
    var email: String = ""
    var hasDriversLicence: Bool = true

    // Employment
    var employmentStatus: EmploymentStatus = .permanent
    var employer: String = ""
    var occupation: String = ""
    var yearsEmployedText: String = ""
    var grossIncomeText: String = ""
    var netIncomeText: String = ""
    var monthlyExpensesText: String = ""
    var existingCreditText: String = ""

    // Consents
    var consentPopia: Bool = false
    var consentCreditCheck: Bool = false

    // Submission
    private(set) var isSubmitting = false
    private(set) var submissionError: String?
    private(set) var idFieldError: String?
    private(set) var submittedReferenceId: String?

    // MARK: - Computed

    var effectivePrice: Double {
        prefilledPrice ?? Double(purchasePriceText) ?? 0
    }

    var deposit: Double {
        Double(depositText) ?? 0
    }

    var loanPrincipal: Double {
        max(0, effectivePrice - deposit)
    }

    var illustrativeInstalment: String? {
        guard loanPrincipal > 0 else { return nil }
        guard let monthly = InstalmentCalculator.monthlyInstalment(
            principal: loanPrincipal,
            termMonths: selectedTerm.rawValue
        ) else { return nil }
        return Formatters.formatZAR(monthly) + "/pm"
    }

    var idNumberIsValid: Bool {
        idNumber.count != 13 || SAIDValidator.isValid(idNumber)
    }

    var canSubmit: Bool {
        !fullName.isEmpty &&
        idNumber.count == 13 &&
        SAIDValidator.isValid(idNumber) &&
        !phone.isEmpty &&
        !email.isEmpty &&
        !(grossIncomeText.isEmpty) &&
        !(netIncomeText.isEmpty) &&
        !(monthlyExpensesText.isEmpty) &&
        !(existingCreditText.isEmpty) &&
        consentPopia &&
        consentCreditCheck
    }

    // MARK: - Setup

    func prefill(listing: Listing) {
        prefilledListingId = listing.id
        prefilledTitle = listing.title
        prefilledPrice = listing.priceZar
    }

    // MARK: - Submit

    func submit() async {
        idFieldError = nil
        submissionError = nil

        guard SAIDValidator.isValid(idNumber) else {
            idFieldError = "Please enter a valid 13-digit South African ID number."
            return
        }

        let application = FinanceApplication(
            fullName: fullName,
            idNumber: idNumber,
            phone: phone,
            email: email,
            hasDriversLicence: hasDriversLicence,
            employmentStatus: employmentStatus.rawValue,
            employer: employer.isEmpty ? nil : employer,
            occupation: occupation.isEmpty ? nil : occupation,
            yearsEmployed: Int(yearsEmployedText),
            grossMonthlyIncome: Double(grossIncomeText) ?? 0,
            netMonthlyIncome: Double(netIncomeText) ?? 0,
            monthlyExpenses: Double(monthlyExpensesText) ?? 0,
            existingCreditCommitments: Double(existingCreditText) ?? 0,
            listingId: prefilledListingId,
            vehicleDescription: prefilledTitle ?? (vehicleDescription.isEmpty ? nil : vehicleDescription),
            purchasePriceZar: effectivePrice > 0 ? effectivePrice : nil,
            depositZar: deposit,
            preferredTermMonths: selectedTerm.rawValue,
            consentPopia: consentPopia,
            consentCreditCheck: consentCreditCheck
        )

        isSubmitting = true
        do {
            let response = try await APIClient.shared.submitFinanceApplication(application)
            submittedReferenceId = response.id
        } catch let err as APIClientError {
            mapAPIError(err)
        } catch {
            submissionError = error.localizedDescription
        }
        isSubmitting = false
    }

    private func mapAPIError(_ error: APIClientError) {
        switch error.apiErrorCode {
        case "invalid_id":
            idFieldError = error.errorDescription ?? "Invalid ID number."
        case "consent_required":
            submissionError = "Both consent checkboxes are required."
        case "rate_limited":
            submissionError = "Too many requests. Please try again shortly."
        default:
            submissionError = error.errorDescription
        }
    }

    func reset() {
        submittedReferenceId = nil
        submissionError = nil
        idFieldError = nil
    }
}
