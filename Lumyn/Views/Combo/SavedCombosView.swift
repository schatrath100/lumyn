import SwiftUI

struct SavedCombosView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        List {
            if appState.savedCombos.isEmpty {
                Text("No saved combos yet.")
                    .foregroundStyle(Color.lumynInkSoft)
            } else {
                ForEach(appState.savedCombos) { combo in
                    VStack(alignment: .leading, spacing: 6) {
                        Text(combo.name)
                            .font(LumynTypography.sans(size: 16, weight: .semibold))
                        Text(combo.words.joined(separator: " · "))
                            .font(LumynTypography.bodySub)
                            .foregroundStyle(Color.lumynInkSoft)
                    }
                    .padding(.vertical, 4)
                }
                .onDelete { offsets in
                    offsets.map { appState.savedCombos[$0].id }.forEach { appState.deleteCombo(id: $0) }
                }
            }
        }
        .navigationTitle("Saved Combos")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                NavigationLink("Discover") {
                    DiscoverView()
                }
                .font(LumynTypography.ctaLabel)
                .foregroundStyle(Color.lumynCoral)
            }
        }
        .background(LumynScreenBackground().ignoresSafeArea())
    }
}

#Preview {
    NavigationStack {
        SavedCombosView()
    }
    .environment(AppState())
}
