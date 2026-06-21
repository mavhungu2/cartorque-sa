import Foundation

enum APIClientError: LocalizedError {
    case invalidURL
    case invalidResponse
    case httpError(statusCode: Int, apiError: APIError?)
    case decodingError(Error)
    case networkError(Error)

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL."
        case .invalidResponse:
            return "Invalid server response."
        case .httpError(let code, let apiError):
            if let message = apiError?.message { return message }
            return "Server error (\(code))."
        case .decodingError:
            return "Failed to parse server response."
        case .networkError(let err):
            return err.localizedDescription
        }
    }

    var apiErrorCode: String? {
        if case .httpError(_, let apiError) = self { return apiError?.code }
        return nil
    }

    var apiErrorField: String? {
        if case .httpError(_, let apiError) = self { return apiError?.field }
        return nil
    }
}

final class APIClient {
    static let shared = APIClient()

    private let baseURL = "https://cartorque-sa--cartorque-sa.us-east4.hosted.app/api/v1"
    private let session: URLSession

    private init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.timeoutIntervalForResource = 60
        self.session = URLSession(configuration: config)
    }

    // MARK: - Listings

    func fetchListings() async throws -> ListingsResponse {
        let url = try makeURL(path: "/listings")
        return try await get(url: url)
    }

    func fetchListing(id: String) async throws -> Listing {
        let url = try makeURL(path: "/listings/\(id)")
        let response: ListingDetailResponse = try await get(url: url)
        return response.listing
    }

    // MARK: - Videos

    func fetchVideos() async throws -> VideosResponse {
        let url = try makeURL(path: "/videos")
        return try await get(url: url)
    }

    // MARK: - Finance

    func submitFinanceApplication(_ application: FinanceApplication) async throws -> FinanceSubmitResponse {
        let url = try makeURL(path: "/finance")
        return try await post(url: url, body: application)
    }

    // MARK: - Private Helpers

    private func makeURL(path: String) throws -> URL {
        guard let url = URL(string: baseURL + path) else {
            throw APIClientError.invalidURL
        }
        return url
    }

    private func get<T: Decodable>(url: URL) async throws -> T {
        do {
            let (data, response) = try await session.data(from: url)
            return try decode(data: data, response: response)
        } catch let error as APIClientError {
            throw error
        } catch {
            throw APIClientError.networkError(error)
        }
    }

    private func post<B: Encodable, T: Decodable>(url: URL, body: B) async throws -> T {
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(body)
        do {
            let (data, response) = try await session.data(for: request)
            return try decode(data: data, response: response)
        } catch let error as APIClientError {
            throw error
        } catch {
            throw APIClientError.networkError(error)
        }
    }

    private func decode<T: Decodable>(data: Data, response: URLResponse) throws -> T {
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIClientError.invalidResponse
        }
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        if (200..<300).contains(httpResponse.statusCode) {
            do {
                return try decoder.decode(T.self, from: data)
            } catch {
                throw APIClientError.decodingError(error)
            }
        } else {
            let apiError = try? decoder.decode(APIErrorWrapper.self, from: data)
            throw APIClientError.httpError(statusCode: httpResponse.statusCode, apiError: apiError?.error)
        }
    }
}
