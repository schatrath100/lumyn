import SwiftUI

struct HomeView: View {
    @Environment(AppState.self) private var appState
    @State private var showSettings = false

    private var dailyContext: DailyWordContext {
        DailyWordService.dailyWord(profile: appState.profile)
    }

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: LumynLayout.feedGap) {
                    TabScreenHeader(
                        title: "Today's Word",
                        subtitle: DailyWordService.greeting(),
                        trailing: AnyView(
                            Button {
                                showSettings = true
                            } label: {
                                Image(systemName: "gearshape")
                                    .foregroundStyle(Color.lumynInkSoft)
                            }
                        )
                    )

                    NavigationLink {
                        WordDetailView(word: dailyContext.word)
                    } label: {
                        DailyWordCard(context: dailyContext)
                    }
                    .buttonStyle(.plain)
                    .lumynScreenHorizontalPadding()

                    VStack(alignment: .leading, spacing: 12) {
                        Text("HOW ARE YOU FEELING?")
                            .font(LumynTypography.eyebrow)
                            .foregroundStyle(Color.lumynInkSoft)
                            .lumynScreenHorizontalPadding()

                        LazyVGrid(
                            columns: [GridItem(.flexible()), GridItem(.flexible())],
                            spacing: 12
                        ) {
                            ForEach(DataCatalog.shared.moods) { mood in
                                NavigationLink {
                                    MoodResultView(mood: .tile(mood))
                                } label: {
                                    MoodTile(mood: mood)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .lumynScreenHorizontalPadding()
                    }

                    if appState.streak > 0 {
                        Text("\(appState.streak)-day streak ✦")
                            .font(LumynTypography.bodySub)
                            .foregroundStyle(Color.lumynCoral)
                    }
                }
                .padding(.bottom, 24)
            }
            .background(LumynScreenBackground().ignoresSafeArea())
            .navigationDestination(isPresented: $showSettings) {
                SettingsView()
            }
        }
        .onAppear { appState.recordActivity() }
    }
}

#Preview {
    HomeView()
        .environment(AppState())
}
