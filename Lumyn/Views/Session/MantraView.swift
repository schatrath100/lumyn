import AVFoundation
import SwiftUI

struct MantraView: View {
    @Environment(AppState.self) private var appState
    let word: SwitchWord

    @Environment(\.dismiss) private var dismiss
    @State private var count = 0
    @State private var playing = false
    @State private var timer: Timer?
    @State private var didJournal = false

    private let synthesizer = AVSpeechSynthesizer()

    private var targetReps: Int { max(word.reps, 1) }
    private var progress: Double { min(Double(count) / Double(targetReps), 1) }
    private var done: Bool { count >= targetReps }

    var body: some View {
        VStack(spacing: 24) {
            HStack {
                Text("Mantra")
                    .font(LumynTypography.eyebrow)
                    .foregroundStyle(.white.opacity(0.5))
                Spacer()
                Button("Exit") { stop(); dismiss() }
                    .font(LumynTypography.bodySub)
                    .foregroundStyle(.white.opacity(0.45))
            }
            .lumynScreenHorizontalPadding()
            .padding(.top, 8)

            Spacer()

            ZStack {
                Circle()
                    .stroke(Color.white.opacity(0.12), lineWidth: 10)
                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(Color(hex: word.color), style: StrokeStyle(lineWidth: 10, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                    .animation(.easeOut(duration: 0.25), value: progress)

                VStack(spacing: 10) {
                    Text(word.word)
                        .font(LumynTypography.dailyWord)
                        .foregroundStyle(.white)
                    Text("\(count) / \(targetReps)")
                        .font(LumynTypography.bodySub)
                        .foregroundStyle(.white.opacity(0.65))
                }
            }
            .frame(width: 240, height: 240)

            Button {
                HapticManager.shared.light()
                if playing { stop() } else { start() }
            } label: {
                Text(playing ? "Pause" : done ? "Replay" : "Play Mantra")
                    .font(LumynTypography.ctaLabel)
                    .foregroundStyle(Color.lumynInk)
                    .padding(.horizontal, 28)
                    .padding(.vertical, 14)
                    .background(Color.lumynGold)
                    .clipShape(Capsule())
            }
            .buttonStyle(.plain)

            Text("Spoken repetition with gentle pacing")
                .font(LumynTypography.bodySub)
                .foregroundStyle(.white.opacity(0.5))

            Spacer()

            if done {
                PrimaryButton(title: "Complete") {
                    guard !didJournal else {
                        stop()
                        dismiss()
                        return
                    }
                    didJournal = true
                    stop()
                    appState.saveJournalEntry(
                        word: word.word,
                        moodBefore: 3,
                        moodAfter: 5,
                        note: "Completed mantra session (\(targetReps) reps)."
                    )
                    dismiss()
                }
                .lumynScreenHorizontalPadding()
                .padding(.bottom, 32)
            }
        }
        .background(
            RadialGradient(
                colors: [Color(hex: word.color).opacity(0.15), Color.lumynMoodDark],
                center: .center,
                startRadius: 0,
                endRadius: 360
            )
            .ignoresSafeArea()
        )
        .preferredColorScheme(.dark)
        .onDisappear { stop() }
    }

    private func start() {
        if done { count = 0 }
        playing = true
        speak()
        timer = Timer.scheduledTimer(withTimeInterval: 2.8, repeats: true) { _ in
            guard playing else { return }
            count += 1
            if count >= targetReps {
                stop()
                HapticManager.shared.success()
                return
            }
            speak()
        }
    }

    private func stop() {
        playing = false
        timer?.invalidate()
        timer = nil
        synthesizer.stopSpeaking(at: .immediate)
    }

    private func speak() {
        let utterance = AVSpeechUtterance(string: word.word)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        utterance.rate = 0.42
        synthesizer.speak(utterance)
    }
}

#Preview {
    MantraView(word: DataCatalog.shared.switchWords[0])
        .environment(AppState())
}
