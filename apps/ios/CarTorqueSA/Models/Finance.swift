import Foundation

struct FinanceApplication: Codable {
    let fullName: String
    let idNumber: String
    let phone: String
    let email: String
    let hasDriversLicence: Bool
    let employmentStatus: String
    let employer: String?
    let occupation: String?
    let yearsEmployed: Int?
    let grossMonthlyIncome: Double
    let netMonthlyIncome: Double
    let monthlyExpenses: Double
    let existingCreditCommitments: Double
    let listingId: String?
    let vehicleDescription: String?
    let purchasePriceZar: Double?
    let depositZar: Double
    let preferredTermMonths: Int
    let consentPopia: Bool
    let consentCreditCheck: Bool
}

struct FinanceSubmitResponse: Codable {
    let id: String
}

struct APIError: Codable {
    let code: String?
    let message: String
    let field: String?
}

struct APIErrorWrapper: Codable {
    let error: APIError
}

enum EmploymentStatus: String, CaseIterable, Identifiable {
    case permanent
    case contract
    case selfEmployed = "self_employed"
    case pensioner
    case other

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .permanent: return "Permanent"
        case .contract: return "Contract"
        case .selfEmployed: return "Self Employed"
        case .pensioner: return "Pensioner"
        case .other: return "Other"
        }
    }
}

enum LoanTermMonths: Int, CaseIterable, Identifiable {
    case t24 = 24
    case t36 = 36
    case t48 = 48
    case t60 = 60
    case t72 = 72
    case t96 = 96

    var id: Int { rawValue }

    var displayName: String { "\(rawValue) months" }
}

// MARK: - SA ID Luhn Validation
enum SAIDValidator {
    static func isValid(_ id: String) -> Bool {
        guard id.count == 13, id.allSatisfy({ $0.isNumber }) else { return false }
        let digits = id.compactMap { $0.wholeNumberValue }
        var sum = 0
        for (index, digit) in digits.enumerated() {
            if index % 2 == 0 {
                sum += digit
            } else {
                let doubled = digit * 2
                sum += doubled > 9 ? doubled - 9 : doubled
            }
        }
        return sum % 10 == 0
    }
}

// MARK: - Instalment Calculator
enum InstalmentCalculator {
    static let annualRate: Double = 0.135

    static func monthlyInstalment(principal: Double, termMonths: Int) -> Double? {
        guard principal > 0, termMonths > 0 else { return nil }
        let r = annualRate / 12
        let n = Double(termMonths)
        let numerator = principal * r
        let denominator = 1 - pow(1 + r, -n)
        guard denominator > 0 else { return nil }
        return numerator / denominator
    }
}
