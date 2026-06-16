import Foundation

struct WidgetSnapshot: Codable {
    var word: String
    var wordColor: String
    var moonEmoji: String
    var moonLabel: String
    var ritualPrompt: String
    var updatedAt: Date
}

enum WidgetDataKeys {
    static let appGroupID = "group.com.whyteboard.lumyn"
    static let snapshotKey = "lumyn.widget.snapshot"
}
