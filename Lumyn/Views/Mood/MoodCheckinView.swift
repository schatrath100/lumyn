import SwiftUI

struct MoodCheckinView: View {
    @Environment(AppState.self) private var appState

    private let colors = DataCatalog.shared.moodColors
    private let columns = Array(repeating: GridItem(.flexible(), spacing: 10), count: 4)

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 16) {
                    TabScreenHeader(
                        title: "Mood Check-in",
                        subtitle: "Choose the colour that matches how you feel",
                        onDark: true
                    )

                    LazyVGrid(columns: columns, spacing: 10) {
                        ForEach(colors) { moodColor in
                            NavigationLink {
                                MoodResultView(mood: .color(moodColor))
                            } label: {
                                VStack(spacing: 8) {
                                    Circle()
                                        .fill(Color(hex: moodColor.color))
                                        .frame(width: 44, height: 44)
                                    Text(moodColor.label)
                                        .font(LumynTypography.tabLabel)
                                        .foregroundStyle(.white.opacity(0.85))
                                        .lineLimit(1)
                                        .minimumScaleFactor(0.8)
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .lumynScreenHorizontalPadding()
                }
                .padding(.bottom, 24)
            }
            .background(LumynDarkScreenBackground().ignoresSafeArea())
            .preferredColorScheme(.dark)
        }
    }
}

#Preview {
    MoodCheckinView()
        .environment(AppState())
}
