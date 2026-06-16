import WidgetKit
import SwiftUI

struct DailyWordEntry: TimelineEntry {
    let date: Date
    let snapshot: WidgetSnapshot
}

struct DailyWordProvider: TimelineProvider {
    func placeholder(in context: Context) -> DailyWordEntry {
        DailyWordEntry(date: Date(), snapshot: .placeholder)
    }

    func getSnapshot(in context: Context, completion: @escaping (DailyWordEntry) -> Void) {
        let snapshot = WidgetSnapshotStore.load() ?? .placeholder
        completion(DailyWordEntry(date: Date(), snapshot: snapshot))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<DailyWordEntry>) -> Void) {
        let snapshot = WidgetSnapshotStore.load() ?? .placeholder
        let entry = DailyWordEntry(date: Date(), snapshot: snapshot)
        let nextRefresh = Calendar.current.nextDate(
            after: Date(),
            matching: DateComponents(hour: 0, minute: 5),
            matchingPolicy: .nextTime
        ) ?? Date().addingTimeInterval(3600)
        completion(Timeline(entries: [entry], policy: .after(nextRefresh)))
    }
}

struct DailyWordWidgetView: View {
    let entry: DailyWordEntry

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: "#2A1810"), Color(hex: "#E8784B").opacity(0.55)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("TODAY'S WORD")
                        .font(.system(size: 10, weight: .bold, design: .rounded))
                        .foregroundStyle(Color(hex: "#F2C44A").opacity(0.9))
                    Spacer()
                    Text("\(entry.snapshot.moonEmoji) \(entry.snapshot.moonLabel)")
                        .font(.system(size: 11, weight: .medium, design: .rounded))
                        .foregroundStyle(.white.opacity(0.7))
                        .lineLimit(1)
                }
                Text(entry.snapshot.word)
                    .font(.system(size: 28, weight: .bold, design: .serif))
                    .foregroundStyle(Color(hex: entry.snapshot.wordColor))
                    .minimumScaleFactor(0.7)
                    .lineLimit(1)
                Text(entry.snapshot.ritualPrompt)
                    .font(.system(size: 12, weight: .regular, design: .rounded))
                    .foregroundStyle(.white.opacity(0.75))
                    .lineLimit(3)
            }
            .padding(14)
        }
    }
}

struct DailyWordWidget: Widget {
    let kind = "DailyWordWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: DailyWordProvider()) { entry in
            DailyWordWidgetView(entry: entry)
                .containerBackground(for: .widget) {
                    Color(hex: "#2A1810")
                }
        }
        .configurationDisplayName("Daily Word")
        .description("Today's switch word and moon-phase ritual prompt.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular])
    }
}

extension WidgetSnapshot {
    static let placeholder = WidgetSnapshot(
        word: "OPEN",
        wordColor: "#F2C44A",
        moonEmoji: "🌙",
        moonLabel: "Waxing Crescent",
        ritualPrompt: "Speak your word with steady breath.",
        updatedAt: Date()
    )
}

private extension Color {
    init(hex: String) {
        let cleaned = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var value: UInt64 = 0
        Scanner(string: cleaned).scanHexInt64(&value)
        let r = Double((value >> 16) & 0xFF) / 255
        let g = Double((value >> 8) & 0xFF) / 255
        let b = Double(value & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}
