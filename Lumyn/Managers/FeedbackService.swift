import Foundation
import os

enum FeedbackError: LocalizedError {
    case notConfigured
    case emptyMessage
    case messageTooLong
    case networkFailed
    case authFailed
    case submitFailed

    var errorDescription: String? {
        switch self {
        case .notConfigured:
            return "Feedback isn't configured yet. Add Supabase credentials to Secrets.plist."
        case .emptyMessage:
            return "Please enter a short message."
        case .messageTooLong:
            return "Keep feedback to 140 characters or less."
        case .networkFailed:
            return "Couldn't reach the server. Check your connection and try again."
        case .authFailed:
            return "Couldn't sign in to send feedback. Try again later."
        case .submitFailed:
            return "Couldn't send feedback. Try again later."
        }
    }
}

private struct StoredSession: Codable {
    let accessToken: String
    let refreshToken: String
    let expiresAt: Date
}

private struct AuthResponse: Decodable {
    let accessToken: String
    let refreshToken: String
    let expiresIn: Int

    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case expiresIn = "expires_in"
    }
}

@MainActor
final class FeedbackService {
    static let shared = FeedbackService()

    private let sessionKey = "lumyn-feedback-session"
    private let deviceIDKey = "lumyn-feedback-device-id"
    private let logger = Logger(subsystem: "com.whyteboard.lumyn", category: "Feedback")

    private init() {}

    func submit(message: String) async throws {
        let trimmed = message.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { throw FeedbackError.emptyMessage }
        guard trimmed.count <= 140 else { throw FeedbackError.messageTooLong }
        guard let config = SecretsProvider.supabase else { throw FeedbackError.notConfigured }

        let token = try await accessToken(config: config)
        try await insertFeedback(message: trimmed, token: token, config: config)
    }

    private func accessToken(config: SupabaseConfig) async throws -> String {
        if let cached = loadSession(), cached.expiresAt > Date().addingTimeInterval(60) {
            return cached.accessToken
        }
        if let cached = loadSession() {
            if let refreshed = try? await refreshSession(cached, config: config) {
                return refreshed.accessToken
            }
        }
        let session = try await signIn(config: config)
        saveSession(session)
        return session.accessToken
    }

    private func signIn(config: SupabaseConfig) async throws -> StoredSession {
        if let anonymous = try? await anonymousSignIn(config: config) {
            return anonymous
        }
        return try await deviceSignIn(config: config)
    }

    private func anonymousSignIn(config: SupabaseConfig) async throws -> StoredSession {
        var request = URLRequest(url: config.url.appendingPathComponent("auth/v1/signup"))
        request.httpMethod = "POST"
        request.setValue(config.anonKey, forHTTPHeaderField: "apikey")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(config.anonKey)", forHTTPHeaderField: "Authorization")
        request.httpBody = Data("{}".utf8)

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            throw FeedbackError.authFailed
        }
        return try decodeSession(from: data)
    }

    private func deviceSignIn(config: SupabaseConfig) async throws -> StoredSession {
        let deviceID = deviceIdentifier()
        let email = "lumyn-\(deviceID)@lumyn.app"
        let password = devicePassword(for: deviceID)

        if let session = try? await passwordGrant(email: email, password: password, config: config) {
            return session
        }

        var signup = URLRequest(url: config.url.appendingPathComponent("auth/v1/signup"))
        signup.httpMethod = "POST"
        signup.setValue(config.anonKey, forHTTPHeaderField: "apikey")
        signup.setValue("application/json", forHTTPHeaderField: "Content-Type")
        signup.setValue("Bearer \(config.anonKey)", forHTTPHeaderField: "Authorization")
        let body: [String: String] = ["email": email, "password": password]
        signup.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: signup)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            throw FeedbackError.authFailed
        }
        return try decodeSession(from: data)
    }

    private func passwordGrant(email: String, password: String, config: SupabaseConfig) async throws -> StoredSession {
        var components = URLComponents(url: config.url.appendingPathComponent("auth/v1/token"), resolvingAgainstBaseURL: false)!
        components.queryItems = [URLQueryItem(name: "grant_type", value: "password")]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "POST"
        request.setValue(config.anonKey, forHTTPHeaderField: "apikey")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let body: [String: String] = ["email": email, "password": password]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            throw FeedbackError.authFailed
        }
        return try decodeSession(from: data)
    }

    private func refreshSession(_ session: StoredSession, config: SupabaseConfig) async throws -> StoredSession {
        var components = URLComponents(url: config.url.appendingPathComponent("auth/v1/token"), resolvingAgainstBaseURL: false)!
        components.queryItems = [URLQueryItem(name: "grant_type", value: "refresh_token")]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "POST"
        request.setValue(config.anonKey, forHTTPHeaderField: "apikey")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: ["refresh_token": session.refreshToken])

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            throw FeedbackError.authFailed
        }
        let refreshed = try decodeSession(from: data)
        saveSession(refreshed)
        return refreshed
    }

    private func insertFeedback(message: String, token: String, config: SupabaseConfig) async throws {
        var request = URLRequest(url: config.url.appendingPathComponent("rest/v1/feedback"))
        request.httpMethod = "POST"
        request.setValue(config.anonKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("return=minimal", forHTTPHeaderField: "Prefer")

        let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
        let body: [String: String] = ["message": message, "app_version": version]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (_, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            logger.error("Feedback insert failed with status \((response as? HTTPURLResponse)?.statusCode ?? -1)")
            throw FeedbackError.submitFailed
        }
    }

    private func decodeSession(from data: Data) throws -> StoredSession {
        let decoded = try JSONDecoder().decode(AuthResponse.self, from: data)
        return StoredSession(
            accessToken: decoded.accessToken,
            refreshToken: decoded.refreshToken,
            expiresAt: Date().addingTimeInterval(TimeInterval(decoded.expiresIn))
        )
    }

    private func loadSession() -> StoredSession? {
        guard let data = UserDefaults.standard.data(forKey: sessionKey) else { return nil }
        return try? JSONDecoder().decode(StoredSession.self, from: data)
    }

    private func saveSession(_ session: StoredSession) {
        if let data = try? JSONEncoder().encode(session) {
            UserDefaults.standard.set(data, forKey: sessionKey)
        }
    }

    private func deviceIdentifier() -> String {
        if let existing = UserDefaults.standard.string(forKey: deviceIDKey) {
            return existing
        }
        let id = UUID().uuidString.lowercased()
        UserDefaults.standard.set(id, forKey: deviceIDKey)
        return id
    }

    private func devicePassword(for deviceID: String) -> String {
        let key = "lumyn-feedback-pw-\(deviceID)"
        if let existing = UserDefaults.standard.string(forKey: key) {
            return existing
        }
        let password = UUID().uuidString + UUID().uuidString
        UserDefaults.standard.set(password, forKey: key)
        return password
    }
}
