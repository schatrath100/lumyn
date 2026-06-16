import Foundation

struct LumynAnalytics: Hashable {
    let currentStreak: Int
    let practiceSessions: Int
    let moodCheckins: Int
    let synchronicities: Int
    let savedWords: Int
    let savedCombos: Int
    let practicesThisWeek: Int
    let uniqueWordsPracticed: Int
    let topMoodLabel: String?
    let averageMoodLift: Double?
}

enum AnalyticsService {
    static func compute(
        streak: Int,
        journalEntries: [JournalEntry],
        moodCheckins: [MoodCheckin],
        synchronicityEntries: [SynchronicityEntry],
        savedWords: [String],
        savedCombos: [Combo]
    ) -> LumynAnalytics {
        let uniqueWords = Set(journalEntries.map(\.word))
        let weekAgo = Calendar.current.date(byAdding: .day, value: -7, to: Date()) ?? Date()
        let practicesThisWeek = moodCheckins.filter { checkin in
            guard let date = LumynDate.date(from: checkin.date) else { return false }
            return date >= weekAgo
        }.count

        let moodCounts = Dictionary(grouping: moodCheckins, by: \.moodLabel).mapValues(\.count)
        let topMood = moodCounts.max(by: { $0.value < $1.value })?.key

        let lifts = journalEntries.map { Double($0.moodAfter - $0.moodBefore) }
        let averageLift = lifts.isEmpty ? nil : lifts.reduce(0, +) / Double(lifts.count)

        return LumynAnalytics(
            currentStreak: streak,
            practiceSessions: journalEntries.count,
            moodCheckins: moodCheckins.count,
            synchronicities: synchronicityEntries.count,
            savedWords: savedWords.count,
            savedCombos: savedCombos.count,
            practicesThisWeek: practicesThisWeek,
            uniqueWordsPracticed: uniqueWords.count,
            topMoodLabel: topMood,
            averageMoodLift: averageLift
        )
    }
}
