import SwiftUI

struct OnboardingContainerView: View {
    @Environment(AppState.self) private var appState

    private let totalSteps = 8

    var body: some View {
        ZStack {
            LumynScreenBackground().ignoresSafeArea()

            VStack(spacing: 0) {
                if appState.onboardingStep < 7 {
                    ProgressDots(total: totalSteps - 1, current: appState.onboardingStep)
                        .padding(.top, 16)
                        .padding(.bottom, 8)
                }

                Group {
                    switch appState.onboardingStep {
                    case 0:
                        OnboardingSplashIntroView { advance() }
                    case 1:
                        OnboardingIntroView { advance() }
                    case 2:
                        OnboardingIntentionsView { advance() }
                    case 3:
                        OnboardingProfileView { advance() }
                    case 4:
                        OnboardingNumberView { advance() }
                    case 5:
                        OnboardingRemindersView { advance() }
                    case 6:
                        OnboardingWelcomeView { finishWelcome() }
                    case 7:
                        Color.clear.onAppear {
                            if !appState.showPaywall { appState.showPaywall = true }
                        }
                    default:
                        EmptyView()
                    }
                }
                .transition(.asymmetric(
                    insertion: .move(edge: .trailing).combined(with: .opacity),
                    removal: .move(edge: .leading).combined(with: .opacity)
                ))
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
            .lumynReadableContentWidth()
        }
        .animation(.easeOut(duration: 0.4), value: appState.onboardingStep)
    }

    private func advance() {
        HapticManager.shared.selection()
        appState.onboardingStep += 1
        appState.save()
    }

    private func finishWelcome() {
        HapticManager.shared.success()
        appState.onboardingStep = 7
        appState.showPaywall = true
        appState.save()
    }
}

#Preview {
    OnboardingContainerView()
        .environment(AppState())
}
