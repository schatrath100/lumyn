import SwiftUI

struct IntentionsEditorView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 16) {
                Text("Choose what you're calling in. Your selections shape daily word resonance and ritual prompts.")
                    .font(LumynTypography.bodySub)
                    .foregroundStyle(Color.lumynInkSoft)
                    .lineSpacing(4)

                IntentionsGrid()

                PrimaryButton(
                    title: "Done",
                    enabled: !appState.profile.selectedIntentions.isEmpty
                ) {
                    HapticManager.shared.success()
                    dismiss()
                }
            }
            .lumynScreenHorizontalPadding()
            .padding(.vertical, 16)
        }
        .background(LumynScreenBackground().ignoresSafeArea())
        .navigationTitle("Your Intentions")
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    NavigationStack {
        IntentionsEditorView()
    }
    .environment(AppState())
}
