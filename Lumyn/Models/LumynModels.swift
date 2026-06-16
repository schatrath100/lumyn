import Foundation

// MARK: - Core catalog types

struct SwitchWord: Codable, Identifiable, Hashable {
    let id: Int
    let word: String
    let category: String
    let color: String
    let intention: String
    let description: String
    let reps: Int
    let how: String
}

struct Mood: Codable, Identifiable, Hashable {
    let id: String
    let label: String
    let sym: String
    let color: String
    let tileBg: String
    let matchWord: String
    let guidance: String
}

struct MoodColor: Codable, Identifiable, Hashable {
    let id: String
    let label: String
    let color: String
    let matchWord: String
    let guidance: String
}

struct IntentionOption: Codable, Identifiable, Hashable {
    let id: String
    let label: String
    let icon: String
}

struct PersonalNumberProfile: Codable, Hashable {
    let title: String
    let description: String
    let words: [String]
}

struct Combo: Codable, Identifiable, Hashable {
    var id: String
    var name: String
    var words: [String]
    var date: String
    var communityPublishedId: String?
}

struct CommunityCombo: Codable, Identifiable, Hashable {
    let id: String
    let name: String
    let words: [String]
    let author: String
    let resonance: Int
    let upvotes: Int
    let tag: String
}

struct JournalEntry: Codable, Identifiable, Hashable {
    var id: String
    var date: String
    var word: String
    var moodBefore: Int
    var moodAfter: Int
    var note: String
}

struct SynchronicityEntry: Codable, Identifiable, Hashable {
    var id: String
    var date: String
    var word: String
    var sign: String
    var note: String
}

struct MoodCheckin: Codable, Identifiable, Hashable {
    var id: String
    var date: String
    var moodId: String
    var moodLabel: String
    var matchWord: String
    var source: MoodCheckinSource
}

enum MoodCheckinSource: String, Codable {
    case tile
    case colorGrid = "color_grid"
}

struct PaywallFeature: Codable, Identifiable, Hashable {
    var id: String { title }
    let icon: String
    let title: String
    let detail: String
}

// MARK: - Settings & profile

enum NumerologySystem: String, Codable, CaseIterable {
    case chaldean
    case pythagorean

    var label: String {
        switch self {
        case .chaldean: return "Chaldean"
        case .pythagorean: return "Pythagorean"
        }
    }
}

enum ReminderFrequency: String, Codable, CaseIterable {
    case off, daily, weekly

    var label: String {
        switch self {
        case .off: return "Off"
        case .daily: return "Daily"
        case .weekly: return "Weekly"
        }
    }
}

enum SubscriptionPlanId: String, Codable {
    case weekly
    case quarterly
}

struct AppSettings: Codable, Hashable {
    var darkMode: Bool = false
    var reminderFrequency: ReminderFrequency = .off
    var reminderTime: String = "8:00 AM"
    var reminderWeekday: Int = 2
    var mantraAmbient: Bool = false
    var mantraBinaural: Bool = false
    var cloudBackupEnabled: Bool = false
}

struct UserProfile: Codable, Hashable {
    var firstName: String = ""
    var lastName: String = ""
    var email: String = ""
    var avatarEmoji: String = "🌙"
    var selectedIntentions: [String] = []
    var userName: String = ""
    var birthDate: String = ""
    var numerologySystem: NumerologySystem = .chaldean
    var personalNumber: Int? = nil
    var lifePathNumber: Int? = nil
    var onboardingComplete: Bool = false
    var isSubscribed: Bool = false
    var trialStartDate: String? = nil
    var subscriptionPlan: SubscriptionPlanId? = nil

    var displayName: String {
        let full = [firstName, lastName].filter { !$0.isEmpty }.joined(separator: " ")
        if !full.isEmpty { return full }
        if !userName.isEmpty { return userName }
        return "Seeker"
    }
}

enum ReminderTimeParser {
    static func components(from time: String) -> (hour: Int, minute: Int) {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "h:mm a"
        if let date = formatter.date(from: time) {
            let cal = Calendar.current
            return (cal.component(.hour, from: date), cal.component(.minute, from: date))
        }
        return (8, 0)
    }

    static func string(hour: Int, minute: Int) -> String {
        var comps = DateComponents()
        comps.hour = hour
        comps.minute = minute
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "h:mm a"
        guard let date = Calendar.current.date(from: comps) else { return "8:00 AM" }
        return formatter.string(from: date)
    }
}

struct PersistedState: Codable, Hashable {
    var onboardingStep: Int = 0
    var profile: UserProfile = UserProfile()
    var settings: AppSettings = AppSettings()
    var savedCombos: [Combo] = []
    var journalEntries: [JournalEntry] = []
    var synchronicityEntries: [SynchronicityEntry] = []
    var communityUpvotes: [String] = []
    var moodCheckins: [MoodCheckin] = []
    var streak: Int = 0
    var lastActiveDate: String? = nil
    var savedWords: [String] = []

    static let empty = PersistedState()
}

// MARK: - Moon & daily word

enum MoonPhase: String, Codable, CaseIterable {
    case new
    case waxingCrescent = "waxing-crescent"
    case firstQuarter = "first-quarter"
    case waxingGibbous = "waxing-gibbous"
    case full
    case waningGibbous = "waning-gibbous"
    case lastQuarter = "last-quarter"
    case waningCrescent = "waning-crescent"
}

struct MoonInfo: Hashable {
    let phase: MoonPhase
    let label: String
    let emoji: String
    let guidance: String
}

enum TimeOfDay: String, Codable {
    case morning, afternoon, evening, night
}

struct DailyWordContext: Hashable {
    let word: SwitchWord
    let ritualPrompt: String
    let moonLabel: String
    let moonEmoji: String
    let isPersonalized: Bool
}

// MARK: - Mood selection union

enum MoodSelection: Hashable {
    case tile(Mood)
    case color(MoodColor)

    var label: String {
        switch self {
        case .tile(let m): return m.label
        case .color(let c): return c.label
        }
    }

    var matchWord: String {
        switch self {
        case .tile(let m): return m.matchWord
        case .color(let c): return c.matchWord
        }
    }

    var guidance: String {
        switch self {
        case .tile(let m): return m.guidance
        case .color(let c): return c.guidance
        }
    }

    var moodId: String {
        switch self {
        case .tile(let m): return m.id
        case .color(let c): return c.id
        }
    }

    var source: MoodCheckinSource {
        switch self {
        case .tile: return .tile
        case .color: return .colorGrid
        }
    }
}
