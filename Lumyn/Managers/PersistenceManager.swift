import Foundation
import os

final class PersistenceManager {
    static let shared = PersistenceManager()
    private init() {}

    private let defaults = UserDefaults.standard
    private let storageKey = "lumyn-state-v2"
    private let logger = Logger(subsystem: "com.whyteboard.lumyn", category: "Persistence")

    private let encoder: JSONEncoder = {
        let e = JSONEncoder()
        e.outputFormatting = [.sortedKeys]
        return e
    }()

    private let decoder = JSONDecoder()

    func save(_ state: PersistedState) {
        do {
            let data = try encoder.encode(state)
            defaults.set(data, forKey: storageKey)
        } catch {
            logger.error("Failed to encode persisted state: \(error.localizedDescription)")
        }
    }

    func load() -> PersistedState {
        guard let data = defaults.data(forKey: storageKey) else {
            return .empty
        }
        do {
            return try decoder.decode(PersistedState.self, from: data)
        } catch {
            logger.error("Failed to decode persisted state: \(error.localizedDescription)")
            return .empty
        }
    }

    func reset() {
        defaults.removeObject(forKey: storageKey)
    }
}
