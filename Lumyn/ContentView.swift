import SwiftUI

struct ContentView: View {
    @Environment(AppState.self) private var appState
    @State private var splashDone = false

    var body: some View {
        ZStack {
            Color.lumynBackground.ignoresSafeArea()

            if !splashDone {
                SplashView {
                    withAnimation(.easeOut(duration: 0.55)) { splashDone = true }
                }
                .transition(.opacity)
                .zIndex(1)
            }

            if splashDone {
                Group {
                    if appState.isOnboardingComplete {
                        MainTabView()
                    } else {
                        OnboardingContainerView()
                    }
                }
                .transition(.opacity)
                .animation(.easeInOut(duration: 0.45), value: appState.isOnboardingComplete)
            }
        }
        .sheet(isPresented: Binding(
            get: { appState.showPaywall },
            set: { newValue in
                guard newValue == false,
                      appState.profile.isSubscribed || SubscriptionManager.shared.isEntitled else {
                    if newValue { appState.showPaywall = true }
                    return
                }
                appState.showPaywall = false
            }
        )) {
            NavigationStack {
                PaywallView()
                    .environment(appState)
                    .lumynReadableContentWidth()
            }
            .interactiveDismissDisabled(true)
            .presentationDetents([.large])
        }
        .task {
            await SubscriptionManager.shared.refreshEntitlements()
            syncSubscriptionState()
            NotificationManager.shared.sync(settings: appState.settings)
        }
        .onChange(of: SubscriptionManager.shared.isEntitled) { _, entitled in
            if entitled {
                syncSubscriptionState()
            } else if appState.isOnboardingComplete {
                appState.showPaywall = true
            }
        }
    }

    private func syncSubscriptionState() {
        let entitled = SubscriptionManager.shared.isEntitled
        appState.profile.isSubscribed = entitled
        if entitled {
            appState.showPaywall = false
            if appState.onboardingStep >= 7 && !appState.isOnboardingComplete {
                appState.completeOnboarding()
            }
        } else if appState.isOnboardingComplete {
            appState.showPaywall = true
        }
        appState.save()
    }
}

#Preview {
    ContentView()
        .environment(AppState())
}
