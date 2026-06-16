import SwiftUI

struct IntentionsGrid: View {
    @Environment(AppState.self) private var appState

    private let intentions = DataCatalog.shared.intentions

    var body: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            ForEach(intentions) { intention in
                let selected = appState.isIntentionSelected(intention.id)
                Button {
                    HapticManager.shared.selection()
                    appState.toggleIntention(intention.id)
                } label: {
                    VStack(spacing: 8) {
                        Text(intention.icon)
                            .font(.system(size: 24))
                        Text(intention.label)
                            .font(LumynTypography.bodySub)
                            .multilineTextAlignment(.center)
                    }
                    .foregroundStyle(Color.lumynInk)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(selected ? Color.lumynGold.opacity(0.35) : Color.lumynSurface)
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                            .strokeBorder(selected ? Color.lumynCoral : .clear, lineWidth: 1.5)
                    )
                }
                .buttonStyle(.plain)
            }
        }
    }
}

#Preview {
    IntentionsGrid()
        .lumynScreenHorizontalPadding()
        .environment(AppState())
}
