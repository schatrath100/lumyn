import Foundation

enum MoonService {
    private static let synodicMonth = 29.530588853

    private static let phaseOrder: [MoonPhase] = [
        .new, .waxingCrescent, .firstQuarter, .waxingGibbous,
        .full, .waningGibbous, .lastQuarter, .waningCrescent,
    ]

    private static let phaseMeta: [MoonPhase: (label: String, emoji: String, guidance: String)] = [
        .new: ("New Moon", "🌑", "Plant intentions. Speak new beginnings softly."),
        .waxingCrescent: ("Waxing Crescent", "🌒", "Momentum builds. Repeat with growing conviction."),
        .firstQuarter: ("First Quarter", "🌓", "Push through resistance. Action words land strongest now."),
        .waxingGibbous: ("Waxing Gibbous", "🌔", "Refine and trust. Your field is receptive to refinement."),
        .full: ("Full Moon", "🌕", "Peak amplification. GLORIFY and magnify what is working."),
        .waningGibbous: ("Waning Gibbous", "🌖", "Share and integrate. Teach what you have received."),
        .lastQuarter: ("Last Quarter", "🌗", "Release and clear. Let go of what no longer serves."),
        .waningCrescent: ("Waning Crescent", "🌘", "Rest and restore. Gentle words, deep surrender."),
    ]

    private static let phaseWordBoost: [MoonPhase: [String]] = [
        .new: ["OPEN", "DIVINE", "TOGETHER"],
        .waxingCrescent: ["REACH", "BRING", "MOVE"],
        .firstQuarter: ["COUNT", "SHIFT", "CHANGE"],
        .waxingGibbous: ["CRYSTAL", "FIND", "CLEAR"],
        .full: ["GLORIFY", "ELATE", "LOVE"],
        .waningGibbous: ["ALLOW", "CHARM", "WAFT"],
        .lastQuarter: ["CLEAR", "RESTORE", "BETWEEN"],
        .waningCrescent: ["RESTORE", "WAFT", "ALLOW"],
    ]

    private static let timeWordBoost: [TimeOfDay: [String]] = [
        .morning: ["OPEN", "ELATE", "TOGETHER"],
        .afternoon: ["CRYSTAL", "MOVE", "REACH"],
        .evening: ["ALLOW", "LOVE", "RESTORE"],
        .night: ["DIVINE", "BETWEEN", "WAFT"],
    ]

    static func moonPhase(for date: Date = Date()) -> MoonPhase {
        let knownNewMoon = Date(timeIntervalSince1970: 947_182_440) // 2000-01-06 18:14 UTC
        let daysSince = date.timeIntervalSince(knownNewMoon) / 86_400
        var phase = daysSince.truncatingRemainder(dividingBy: synodicMonth)
        if phase < 0 { phase += synodicMonth }
        let index = Int(floor((phase / synodicMonth) * 8)) % 8
        return phaseOrder[index]
    }

    static func moonInfo(for date: Date = Date()) -> MoonInfo {
        let phase = moonPhase(for: date)
        let meta = phaseMeta[phase] ?? ("Moon", "🌙", "")
        return MoonInfo(phase: phase, label: meta.label, emoji: meta.emoji, guidance: meta.guidance)
    }

    static func timeOfDay(for date: Date = Date()) -> TimeOfDay {
        let hour = Calendar.current.component(.hour, from: date)
        if hour >= 5 && hour < 12 { return .morning }
        if hour >= 12 && hour < 17 { return .afternoon }
        if hour >= 17 && hour < 21 { return .evening }
        return .night
    }

    static func phaseAlignedWordCandidates(for date: Date = Date()) -> [String] {
        let phase = moonPhase(for: date)
        let time = timeOfDay(for: date)
        var seen = Set<String>()
        var result: [String] = []
        for word in (phaseWordBoost[phase] ?? []) + (timeWordBoost[time] ?? []) {
            if seen.insert(word).inserted { result.append(word) }
        }
        return result
    }

    static func timingRitualPrompt(for date: Date = Date()) -> String {
        let moon = moonInfo(for: date)
        let time = timeOfDay(for: date)
        let timeLabel: String
        switch time {
        case .morning: timeLabel = "dawn"
        case .afternoon: timeLabel = "midday"
        case .evening: timeLabel = "dusk"
        case .night: timeLabel = "night"
        }
        return "\(moon.emoji) \(moon.label) · \(timeLabel) — \(moon.guidance)"
    }
}
