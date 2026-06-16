import Foundation
#if canImport(WidgetKit)
import WidgetKit
#endif

enum WidgetDataStore {
    static func sync(profile: UserProfile) {
        let context = DailyWordService.dailyWord(profile: profile)
        let snapshot = WidgetSnapshot(
            word: context.word.word,
            wordColor: context.word.color,
            moonEmoji: context.moonEmoji,
            moonLabel: context.moonLabel,
            ritualPrompt: context.ritualPrompt,
            updatedAt: Date()
        )
        WidgetSnapshotStore.save(snapshot)
        #if canImport(WidgetKit)
        WidgetCenter.shared.reloadAllTimelines()
        #endif
    }
}
