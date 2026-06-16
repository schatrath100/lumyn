import Foundation

enum DailyWordService {
    static func greeting(for date: Date = Date()) -> String {
        let hour = Calendar.current.component(.hour, from: date)
        if hour < 12 { return "Good morning ✦" }
        if hour < 17 { return "Good afternoon ✦" }
        return "Good evening ✦"
    }

    static func dailyWord(for date: Date = Date(), profile: UserProfile? = nil) -> DailyWordContext {
        let moon = MoonService.moonInfo(for: date)
        let ritualPrompt = MoonService.timingRitualPrompt(for: date)
        let candidates = MoonService.phaseAlignedWordCandidates(for: date)

        let resonance = profile.map {
            NumerologyService.resonanceNumber(
                personalNumber: $0.personalNumber,
                lifePathNumber: $0.lifePathNumber
            )
        } ?? nil
        let personalWords = NumerologyService.resonantWordNames(number: resonance)

        var pool: [String] = []
        var seen = Set<String>()
        for word in personalWords + candidates {
            if seen.insert(word).inserted { pool.append(word) }
        }

        let catalog = DataCatalog.shared
        let dayOfYear = Calendar.current.ordinality(of: .day, in: .year, for: date) ?? 1

        var word: SwitchWord?
        if !pool.isEmpty {
            let pick = pool[(dayOfYear - 1) % pool.count]
            word = catalog.word(named: pick)
        }
        if word == nil, !catalog.switchWords.isEmpty {
            word = catalog.switchWords[(dayOfYear - 1) % catalog.switchWords.count]
        }
        let resolved = word ?? SwitchWord(
            id: 0, word: "OPEN", category: "Spiritual", color: "#F2C44A",
            intention: "New Beginnings", description: "Open to possibility.",
            reps: 9, how: "Repeat with steady breath."
        )

        return DailyWordContext(
            word: resolved,
            ritualPrompt: ritualPrompt,
            moonLabel: moon.label,
            moonEmoji: moon.emoji,
            isPersonalized: personalWords.contains(resolved.word)
        )
    }
}
