import SwiftUI

struct MoodResultView: View {
    @Environment(AppState.self) private var appState
    let mood: MoodSelection

    @State private var matchedWord: SwitchWord?
    @State private var showSession = false
    @State private var didRecord = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text(mood.label)
                    .font(LumynTypography.screenTitle)
                    .foregroundStyle(.white)

                Text(mood.guidance)
                    .font(LumynTypography.bodyUI)
                    .foregroundStyle(.white.opacity(0.8))
                    .lineSpacing(5)

                if let word = matchedWord {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("YOUR MATCHED WORD")
                            .font(LumynTypography.eyebrow)
                            .foregroundStyle(Color.lumynGold)
                        Text(word.word)
                            .font(LumynTypography.dailyWord)
                            .foregroundStyle(Color(hex: word.color))
                    }
                    .padding(20)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color.white.opacity(0.08))
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                    PrimaryButton(title: "Start Session") {
                        appState.selectedWord = word
                        appState.resetSession()
                        showSession = true
                    }
                }
            }
            .lumynScreenHorizontalPadding()
            .padding(.vertical, 16)
        }
        .background(LumynDarkScreenBackground().ignoresSafeArea())
        .preferredColorScheme(.dark)
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(isPresented: $showSession) {
            if let word = matchedWord {
                SessionView(word: word)
            }
        }
        .onAppear {
            if !didRecord {
                matchedWord = appState.pickMood(mood)
                didRecord = true
            } else if matchedWord == nil {
                matchedWord = DataCatalog.shared.word(named: mood.matchWord)
            }
        }
    }
}

#Preview {
    NavigationStack {
        MoodResultView(mood: .tile(DataCatalog.shared.moods[0]))
    }
    .environment(AppState())
}
