import SwiftUI

struct ComboBuilderView: View {
    @Environment(AppState.self) private var appState
    @State private var showSaved = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                TabScreenHeader(
                    title: "Combo Builder",
                    subtitle: "Stack words into a ritual sequence",
                    trailing: AnyView(
                        Button("Saved") { showSaved = true }
                            .font(LumynTypography.ctaLabel)
                            .foregroundStyle(Color.lumynCoral)
                    )
                )

                TextField("Combo name", text: Binding(
                    get: { appState.comboName },
                    set: { appState.comboName = $0 }
                ))
                .lumynField()
                .lumynScreenHorizontalPadding()

                if appState.comboWords.isEmpty {
                    Spacer()
                    Text("Add words from the Library to build your combo.")
                        .font(LumynTypography.bodySub)
                        .foregroundStyle(Color.lumynInkSoft)
                        .multilineTextAlignment(.center)
                        .lumynScreenHorizontalPadding()
                    Spacer()
                } else {
                    List {
                        ForEach(appState.comboWords) { word in
                            HStack {
                                Text(word.word)
                                    .font(LumynTypography.switchWord)
                                    .foregroundStyle(Color(hex: word.color))
                                Spacer()
                                Button {
                                    appState.removeFromCombo(id: word.id)
                                } label: {
                                    Image(systemName: "minus.circle.fill")
                                        .foregroundStyle(Color.lumynCoral)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .onDelete { offsets in
                            offsets.map { appState.comboWords[$0].id }.forEach { appState.removeFromCombo(id: $0) }
                        }
                    }
                    .listStyle(.plain)
                }

                HStack(spacing: 12) {
                    Button("Clear") {
                        appState.clearCombo()
                    }
                    .font(LumynTypography.ctaLabel)
                    .foregroundStyle(Color.lumynInkSoft)

                    PrimaryButton(
                        title: "Save Combo",
                        enabled: !appState.comboName.trimmingCharacters(in: .whitespaces).isEmpty && !appState.comboWords.isEmpty
                    ) {
                        appState.saveCombo()
                        HapticManager.shared.success()
                    }
                }
                .lumynScreenHorizontalPadding()
                .padding(.bottom, 16)
            }
            .background(LumynScreenBackground().ignoresSafeArea())
            .navigationDestination(isPresented: $showSaved) {
                SavedCombosView()
            }
        }
    }
}

#Preview {
    ComboBuilderView()
        .environment(AppState())
}
