import SwiftUI

struct JournalView: View {
    @Environment(AppState.self) private var appState
    @State private var tab: JournalTab = .practice

    enum JournalTab: String, CaseIterable {
        case practice = "Practice"
        case synchronicity = "Synchronicity"
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                TabScreenHeader(title: "Journal", subtitle: "Track practice and signs")

                Picker("Tab", selection: $tab) {
                    ForEach(JournalTab.allCases, id: \.self) { t in
                        Text(t.rawValue).tag(t)
                    }
                }
                .pickerStyle(.segmented)
                .lumynScreenHorizontalPadding()
                .padding(.bottom, 8)

                List {
                    switch tab {
                    case .practice:
                        if appState.journalEntries.isEmpty {
                            emptyRow("No practice entries yet.")
                        } else {
                            ForEach(appState.journalEntries) { entry in
                                journalRow(
                                    title: entry.word,
                                    subtitle: entry.date,
                                    detail: entry.note
                                )
                            }
                        }
                    case .synchronicity:
                        if appState.synchronicityEntries.isEmpty {
                            emptyRow("No synchronicities logged yet.")
                        } else {
                            ForEach(appState.synchronicityEntries) { entry in
                                journalRow(
                                    title: entry.sign,
                                    subtitle: "\(entry.word) · \(entry.date)",
                                    detail: entry.note
                                )
                            }
                        }
                    }
                }
                .listStyle(.plain)

                addEntrySection
            }
            .background(LumynScreenBackground().ignoresSafeArea())
        }
    }

    @State private var newWord = ""
    @State private var newNote = ""
    @State private var newSign = ""

    @ViewBuilder
    private var addEntrySection: some View {
        VStack(spacing: 8) {
            TextField(tab == .practice ? "Word practiced" : "Sign or symbol", text: tab == .practice ? $newWord : $newSign)
                .lumynField()
            TextField("Note", text: $newNote)
                .lumynField()
            PrimaryButton(title: "Add Entry") {
                if tab == .practice, !newWord.isEmpty {
                    appState.saveJournalEntry(word: newWord, moodBefore: 3, moodAfter: 4, note: newNote)
                    newWord = ""; newNote = ""
                } else if tab == .synchronicity, !newSign.isEmpty {
                    appState.saveSynchronicityEntry(word: newWord.isEmpty ? "—" : newWord, sign: newSign, note: newNote)
                    newSign = ""; newWord = ""; newNote = ""
                    HapticManager.shared.success()
                }
            }
        }
        .lumynScreenHorizontalPadding()
        .padding(.vertical, 12)
    }

    private func journalRow(title: String, subtitle: String, detail: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(LumynTypography.sans(size: 16, weight: .semibold))
            Text(subtitle)
                .font(LumynTypography.bodySub)
                .foregroundStyle(Color.lumynInkSoft)
            if !detail.isEmpty {
                Text(detail)
                    .font(LumynTypography.bodySub)
                    .foregroundStyle(Color.lumynInk)
            }
        }
        .padding(.vertical, 4)
    }

    private func emptyRow(_ text: String) -> some View {
        Text(text)
            .foregroundStyle(Color.lumynInkSoft)
    }
}

#Preview {
    JournalView()
        .environment(AppState())
}
