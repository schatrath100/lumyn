import Foundation

enum WidgetSnapshotStore {
    private static var defaults: UserDefaults? {
        UserDefaults(suiteName: WidgetDataKeys.appGroupID)
    }

    static func save(_ snapshot: WidgetSnapshot) {
        guard let defaults else { return }
        if let data = try? JSONEncoder().encode(snapshot) {
            defaults.set(data, forKey: WidgetDataKeys.snapshotKey)
        }
    }

    static func load() -> WidgetSnapshot? {
        guard let defaults,
              let data = defaults.data(forKey: WidgetDataKeys.snapshotKey),
              let snapshot = try? JSONDecoder().decode(WidgetSnapshot.self, from: data) else {
            return nil
        }
        return snapshot
    }
}
