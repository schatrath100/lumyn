import SwiftUI

struct WordDetailView: View {
    @Environment(AppState.self) private var appState
    let word: SwitchWord

    @State private var showSession = false
    @State private var showMantra = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text(word.word)
                    .font(LumynTypography.wordmark)
                    .foregroundStyle(Color(hex: word.color))

                Text(word.intention)
                    .font(LumynTypography.eyebrow)
                    .foregroundStyle(Color.lumynInkSoft)

                Text(word.description)
                    .font(LumynTypography.bodyUI)
                    .foregroundStyle(Color.lumynInk)
                    .lineSpacing(5)

                VStack(alignment: .leading, spacing: 8) {
                    Text("HOW TO USE")
                        .font(LumynTypography.eyebrow)
                        .foregroundStyle(Color.lumynCoral)
                    Text(word.how)
                        .font(LumynTypography.bodySub)
                        .foregroundStyle(Color.lumynInkSoft)
                }
                .padding(16)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.lumynSurface)
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

                HStack(spacing: 12) {
                    PrimaryButton(title: "Start Session") {
                        appState.selectedWord = word
                        appState.resetSession()
                        showSession = true
                    }
                    Button {
                        appState.toggleSavedWord(word.word)
                        HapticManager.shared.selection()
                    } label: {
                        Image(systemName: appState.isWordSaved(word.word) ? "bookmark.fill" : "bookmark")
                            .font(.system(size: 22))
                            .foregroundStyle(Color.lumynCoral)
                            .frame(width: 52, height: 52)
                            .background(Color.lumynCoral.opacity(0.12))
                            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    }
                    .buttonStyle(.plain)
                }

                Button("Mantra Mode") {
                    appState.selectedWord = word
                    showMantra = true
                }
                .font(LumynTypography.ctaLabel)
                .foregroundStyle(Color.lumynCoral)

                Button("Add to Combo") {
                    appState.addToCombo(word)
                    HapticManager.shared.success()
                }
                .font(LumynTypography.ctaLabel)
                .foregroundStyle(Color.lumynCoral)
            }
            .lumynScreenHorizontalPadding()
            .padding(.vertical, 16)
        }
        .background(LumynScreenBackground().ignoresSafeArea())
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(isPresented: $showSession) {
            SessionView(word: word)
        }
        .navigationDestination(isPresented: $showMantra) {
            MantraView(word: word)
        }
    }
}

#Preview {
    NavigationStack {
        WordDetailView(word: DataCatalog.shared.switchWords[0])
    }
    .environment(AppState())
}
