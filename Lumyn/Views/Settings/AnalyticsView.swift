import SwiftUI

struct AnalyticsView: View {
    @Environment(AppState.self) private var appState

    private var analytics: LumynAnalytics {
        AnalyticsService.compute(
            streak: appState.streak,
            journalEntries: appState.journalEntries,
            moodCheckins: appState.moodCheckins,
            synchronicityEntries: appState.synchronicityEntries,
            savedWords: appState.savedWords,
            savedCombos: appState.savedCombos
        )
    }

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 20) {
                Text("Your practice at a glance — all stats stay on this device.")
                    .font(LumynTypography.bodySub)
                    .foregroundStyle(Color.lumynInkSoft)
                    .lineSpacing(4)

                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    statCard("Current streak", value: "\(analytics.currentStreak)", suffix: analytics.currentStreak == 1 ? "day" : "days")
                    statCard("This week", value: "\(analytics.practicesThisWeek)", suffix: "mood check-ins")
                    statCard("Practice sessions", value: "\(analytics.practiceSessions)", suffix: "logged")
                    statCard("Unique words", value: "\(analytics.uniqueWordsPracticed)", suffix: "practiced")
                    statCard("Mood check-ins", value: "\(analytics.moodCheckins)", suffix: "total")
                    statCard("Synchronicities", value: "\(analytics.synchronicities)", suffix: "logged")
                    statCard("Saved words", value: "\(analytics.savedWords)", suffix: "bookmarked")
                    statCard("Saved combos", value: "\(analytics.savedCombos)", suffix: "rituals")
                }

                if let topMood = analytics.topMoodLabel {
                    insightCard(
                        title: "Most checked-in mood",
                        detail: topMood
                    )
                }

                if let lift = analytics.averageMoodLift {
                    let sign = lift >= 0 ? "+" : ""
                    insightCard(
                        title: "Average mood shift",
                        detail: "\(sign)\(String(format: "%.1f", lift)) after practice sessions"
                    )
                }
            }
            .lumynScreenHorizontalPadding()
            .padding(.vertical, 16)
        }
        .background(LumynScreenBackground().ignoresSafeArea())
        .navigationTitle("Analytics")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func statCard(_ title: String, value: String, suffix: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title.uppercased())
                .font(LumynTypography.eyebrow)
                .foregroundStyle(Color.lumynInkSoft)
            Text(value)
                .font(LumynTypography.dailyWord)
                .foregroundStyle(Color.lumynCoral)
            Text(suffix)
                .font(LumynTypography.caption)
                .foregroundStyle(Color.lumynInkSoft)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(Color.lumynSurface)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    private func insightCard(title: String, detail: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title.uppercased())
                .font(LumynTypography.eyebrow)
                .foregroundStyle(Color.lumynGold)
            Text(detail)
                .font(LumynTypography.bodyUI)
                .foregroundStyle(Color.lumynInk)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(Color.lumynCoral.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}

#Preview {
    NavigationStack {
        AnalyticsView()
    }
    .environment(AppState())
}
