import SwiftUI

struct SessionView: View {
    @Environment(AppState.self) private var appState
    let word: SwitchWord

    @Environment(\.dismiss) private var dismiss

    @State private var didComplete = false

    private var targetReps: Int { max(word.reps, 1) }
    private var progress: Double {
        min(Double(appState.sessionCount) / Double(targetReps), 1)
    }

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            ZStack {
                Circle()
                    .stroke(Color.lumynInk.opacity(0.1), lineWidth: 10)
                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(Color.lumynCoral, style: StrokeStyle(lineWidth: 10, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                    .animation(.easeOut(duration: 0.25), value: progress)

                VStack(spacing: 8) {
                    Text(word.word)
                        .font(LumynTypography.dailyWord)
                        .foregroundStyle(Color.lumynInk)
                    Text("\(appState.sessionCount) / \(targetReps)")
                        .font(LumynTypography.bodySub)
                        .foregroundStyle(Color.lumynInkSoft)
                }
            }
            .frame(width: 220, height: 220)
            .contentShape(Circle())
            .onTapGesture {
                guard !didComplete, appState.sessionCount < targetReps else { return }
                HapticManager.shared.light()
                appState.incrementSession()
                if appState.sessionCount >= targetReps {
                    didComplete = true
                    HapticManager.shared.success()
                    appState.saveJournalEntry(
                        word: word.word,
                        moodBefore: 3,
                        moodAfter: 4,
                        note: "Completed \(targetReps) repetitions."
                    )
                    appState.recordActivity()
                }
            }

            Text("Tap the circle to count each repetition")
                .font(LumynTypography.bodySub)
                .foregroundStyle(Color.lumynInkSoft)

            Spacer()

            if appState.sessionCount >= targetReps {
                PrimaryButton(title: "Complete") { dismiss() }
                    .lumynScreenHorizontalPadding()
                    .padding(.bottom, 32)
            }
        }
        .background(LumynScreenBackground().ignoresSafeArea())
        .navigationTitle("Session")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear { appState.resetSession() }
    }
}

#Preview {
    NavigationStack {
        SessionView(word: DataCatalog.shared.switchWords[0])
    }
    .environment(AppState())
}
