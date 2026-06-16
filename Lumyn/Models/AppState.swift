import Foundation
import Observation

@Observable
@MainActor
final class AppState {
    // MARK: - Onboarding / paywall
    var onboardingStep: Int = 0
    var showPaywall: Bool = false

    // MARK: - Persisted (mirrors web PersistedState)
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

    // MARK: - Ephemeral session
    var selectedWord: SwitchWord? = nil
    var selectedMood: MoodSelection? = nil
    var comboWords: [SwitchWord] = []
    var comboName: String = ""
    var sessionCount: Int = 0

    // MARK: - Computed
    var isOnboardingComplete: Bool {
        get { profile.onboardingComplete }
        set { profile.onboardingComplete = newValue }
    }

    var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        if hour < 12 { return "Good morning ✦" }
        if hour < 17 { return "Good afternoon ✦" }
        return "Good evening ✦"
    }

    init() {
        load()
    }

    // MARK: - Onboarding
    func completeOnboarding() {
        profile.onboardingComplete = true
        save()
    }

    func grantSubscription(plan: SubscriptionPlanId) {
        profile.isSubscribed = true
        profile.subscriptionPlan = plan
        profile.trialStartDate = LumynDate.todayKey()
        showPaywall = false
        save()
    }

    // MARK: - Intentions
    func toggleIntention(_ id: String) {
        if let idx = profile.selectedIntentions.firstIndex(of: id) {
            profile.selectedIntentions.remove(at: idx)
        } else {
            profile.selectedIntentions.append(id)
        }
        save()
    }

    func isIntentionSelected(_ id: String) -> Bool {
        profile.selectedIntentions.contains(id)
    }

    // MARK: - Profile
    func updateProfile(_ partial: (inout UserProfile) -> Void) {
        partial(&profile)
        save()
    }

    // MARK: - Settings
    func updateSettings(_ partial: (inout AppSettings) -> Void) {
        partial(&settings)
        save()
        NotificationManager.shared.sync(settings: settings)
    }

    func toggleDarkMode() {
        settings.darkMode.toggle()
        save()
    }

    // MARK: - Combos
    func addToCombo(_ word: SwitchWord) {
        guard !comboWords.contains(where: { $0.id == word.id }) else { return }
        comboWords.append(word)
    }

    func removeFromCombo(id: Int) {
        comboWords.removeAll { $0.id == id }
    }

    func clearCombo() {
        comboWords = []
        comboName = ""
    }

    func saveCombo() {
        let name = comboName.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !name.isEmpty, !comboWords.isEmpty else { return }
        let combo = Combo(
            id: UUID().uuidString,
            name: name,
            words: comboWords.map(\.word),
            date: LumynDate.formatDate(),
            communityPublishedId: nil
        )
        savedCombos.insert(combo, at: 0)
        clearCombo()
        save()
    }

    func deleteCombo(id: String) {
        savedCombos.removeAll { $0.id == id }
        save()
    }

    // MARK: - Mood
    @discardableResult
    func pickMood(_ mood: MoodSelection) -> SwitchWord? {
        selectedMood = mood
        guard let word = DataCatalog.shared.word(named: mood.matchWord) else { return nil }
        selectedWord = word
        let checkin = MoodCheckin(
            id: UUID().uuidString,
            date: LumynDate.todayKey(),
            moodId: mood.moodId,
            moodLabel: mood.label,
            matchWord: mood.matchWord,
            source: mood.source
        )
        moodCheckins.insert(checkin, at: 0)
        save()
        return word
    }

    // MARK: - Journal
    func saveJournalEntry(word: String, moodBefore: Int, moodAfter: Int, note: String) {
        let entry = JournalEntry(
            id: UUID().uuidString,
            date: LumynDate.formatDate(),
            word: word,
            moodBefore: moodBefore,
            moodAfter: moodAfter,
            note: note
        )
        journalEntries.insert(entry, at: 0)
        save()
    }

    func saveSynchronicityEntry(word: String, sign: String, note: String) {
        let entry = SynchronicityEntry(
            id: UUID().uuidString,
            date: LumynDate.formatDate(),
            word: word,
            sign: sign,
            note: note
        )
        synchronicityEntries.insert(entry, at: 0)
        save()
    }

    // MARK: - Saved words
    func toggleSavedWord(_ word: String) {
        if let idx = savedWords.firstIndex(of: word) {
            savedWords.remove(at: idx)
        } else {
            savedWords.append(word)
        }
        save()
    }

    func isWordSaved(_ word: String) -> Bool {
        savedWords.contains(word)
    }

    // MARK: - Session
    func incrementSession() {
        sessionCount += 1
    }

    func resetSession() {
        sessionCount = 0
    }

    // MARK: - Activity
    func recordActivity() {
        let today = LumynDate.todayKey()
        if lastActiveDate != today {
            if let last = lastActiveDate,
               let lastDate = LumynDate.date(from: last),
               Calendar.current.dateComponents([.day], from: lastDate, to: Date()).day == 1 {
                streak += 1
            } else if lastActiveDate == nil {
                streak = 1
            } else {
                streak = 1
            }
            lastActiveDate = today
            save()
        }
    }

    // MARK: - Data wipe
    func deleteAllData() {
        PersistenceManager.shared.reset()
        let fresh = PersistedState.empty
        applyPersisted(fresh)
        onboardingStep = 0
        showPaywall = false
        selectedWord = nil
        selectedMood = nil
        comboWords = []
        comboName = ""
        sessionCount = 0
        NotificationManager.shared.cancel()
    }

    #if DEBUG
    func resetForDevelopment() {
        deleteAllData()
    }
    #endif

    // MARK: - Persistence
    func save() {
        PersistenceManager.shared.save(persistedSnapshot)
    }

    private func load() {
        applyPersisted(PersistenceManager.shared.load())
        reconcileOnboardingState()
    }

    private var persistedSnapshot: PersistedState {
        PersistedState(
            onboardingStep: onboardingStep,
            profile: profile,
            settings: settings,
            savedCombos: savedCombos,
            journalEntries: journalEntries,
            synchronicityEntries: synchronicityEntries,
            communityUpvotes: communityUpvotes,
            moodCheckins: moodCheckins,
            streak: streak,
            lastActiveDate: lastActiveDate,
            savedWords: savedWords
        )
    }

    private func applyPersisted(_ state: PersistedState) {
        onboardingStep = state.onboardingStep
        profile = state.profile
        settings = state.settings
        savedCombos = state.savedCombos
        journalEntries = state.journalEntries
        synchronicityEntries = state.synchronicityEntries
        communityUpvotes = state.communityUpvotes
        moodCheckins = state.moodCheckins
        streak = state.streak
        lastActiveDate = state.lastActiveDate
        savedWords = state.savedWords
    }

    private func reconcileOnboardingState() {
        if profile.isSubscribed || SubscriptionManager.shared.isEntitled {
            profile.isSubscribed = true
            if !profile.onboardingComplete {
                profile.onboardingComplete = true
                showPaywall = false
                save()
            } else {
                showPaywall = false
            }
        } else if onboardingStep >= 7 && !profile.onboardingComplete {
            showPaywall = true
        }
    }
}

enum LumynDate {
    static func todayKey() -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: Date())
    }

    static func formatDate(_ date: Date = Date()) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d"
        return formatter.string(from: date)
    }

    static func date(from key: String) -> Date? {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.date(from: key)
    }
}
