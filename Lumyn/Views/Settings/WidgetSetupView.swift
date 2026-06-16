import SwiftUI
#if canImport(WidgetKit)
import WidgetKit
#endif

struct WidgetSetupView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 20) {
                Text("Pin today's switch word to your Home Screen or Lock Screen.")
                    .font(LumynTypography.bodySub)
                    .foregroundStyle(Color.lumynInkSoft)
                    .lineSpacing(4)

                instructionStep("1", "Long-press your Home Screen until apps jiggle.")
                instructionStep("2", "Tap + in the top corner and search for **Lumyn**.")
                instructionStep("3", "Choose **Daily Word** and pick a size.")
                instructionStep("4", "Open Lumyn once a day to refresh your word and moon phase.")

                #if canImport(WidgetKit)
                Button("Refresh Widget Now") {
                    WidgetDataStore.sync(profile: appState.profile)
                    HapticManager.shared.success()
                }
                .font(LumynTypography.ctaLabel)
                .foregroundStyle(Color.lumynCoral)
                .padding(.top, 8)
                #endif

                Text("The widget updates when you open the app and at midnight.")
                    .font(LumynTypography.caption)
                    .foregroundStyle(Color.lumynInkSoft)
            }
            .lumynScreenHorizontalPadding()
            .padding(.vertical, 16)
        }
        .background(LumynScreenBackground().ignoresSafeArea())
        .navigationTitle("Daily Word Widget")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func instructionStep(_ number: String, _ text: String) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Text(number)
                .font(LumynTypography.eyebrow)
                .foregroundStyle(Color.lumynGold)
                .frame(width: 24, height: 24)
                .background(Color.lumynGold.opacity(0.2))
                .clipShape(Circle())
            Text(LocalizedStringKey(text))
                .font(LumynTypography.bodyUI)
                .foregroundStyle(Color.lumynInk)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.lumynSurface)
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}

#Preview {
    NavigationStack {
        WidgetSetupView()
    }
}
