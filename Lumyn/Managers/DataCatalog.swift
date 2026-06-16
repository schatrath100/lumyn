import Foundation

final class DataCatalog {
    static let shared = DataCatalog()

    private(set) var switchWords: [SwitchWord] = []
    private(set) var moods: [Mood] = []
    private(set) var moodColors: [MoodColor] = []
    private(set) var intentions: [IntentionOption] = []
    private(set) var categories: [String] = []
    private(set) var communityCombos: [CommunityCombo] = []
    private(set) var paywallFeatures: [PaywallFeature] = []
    private(set) var personalNumberProfiles: [Int: PersonalNumberProfile] = [:]

    private var wordsByName: [String: SwitchWord] = [:]

    private init() {
        loadAll()
    }

    func word(named name: String) -> SwitchWord? {
        wordsByName[name.uppercased()]
    }

    func word(id: Int) -> SwitchWord? {
        switchWords.first { $0.id == id }
    }

    func personalProfile(for number: Int) -> PersonalNumberProfile? {
        personalNumberProfiles[number]
    }

    private func loadAll() {
        switchWords = loadJSON("switch-words", fallback: [])
        moods = loadJSON("moods", fallback: [])
        moodColors = loadJSON("mood-colors", fallback: [])
        intentions = loadJSON("intentions", fallback: [])
        categories = loadJSON("categories", fallback: ["All"])
        communityCombos = loadJSON("community-combos", fallback: [])
        paywallFeatures = loadJSON("paywall-features", fallback: defaultPaywallFeatures)
        loadPersonalNumbers()
        wordsByName = switchWords.reduce(into: [:]) { dict, word in
            dict[word.word.uppercased()] = word
        }
    }

    private func loadPersonalNumbers() {
        guard let url = bundleURL("personal-numbers"),
              let data = try? Data(contentsOf: url),
              let raw = try? JSONDecoder().decode([String: PersonalNumberProfile].self, from: data) else {
            return
        }
        personalNumberProfiles = Dictionary(uniqueKeysWithValues: raw.compactMap { key, value in
            guard let intKey = Int(key) else { return nil }
            return (intKey, value)
        })
    }

    private func loadJSON<T: Decodable>(_ name: String, fallback: T) -> T {
        guard let url = bundleURL(name),
              let data = try? Data(contentsOf: url),
              let decoded = try? JSONDecoder().decode(T.self, from: data) else {
            return fallback
        }
        return decoded
    }

    private func bundleURL(_ name: String) -> URL? {
        Bundle.main.url(forResource: name, withExtension: "json", subdirectory: "Data")
            ?? Bundle.main.url(forResource: name, withExtension: "json")
    }

    private var defaultPaywallFeatures: [PaywallFeature] {
        [
            PaywallFeature(icon: "≡", title: "Full Switch Word Library", detail: "All 540+ words with guided sessions"),
            PaywallFeature(icon: "◎", title: "Mood-Matched Words", detail: "Instant word pairing from how you feel"),
            PaywallFeature(icon: "◈", title: "Combo Builder & Exchange", detail: "Custom rituals and community combos"),
            PaywallFeature(icon: "↗", title: "Journal & Synchronicity Log", detail: "Track shifts and signs over time"),
        ]
    }
}
