import SwiftUI

struct PaywallView: View {
    @Environment(AppState.self) private var appState

    @State private var selectedPlan: Plan = .quarterly
    @State private var isLoading = false
    @State private var isRestoring = false
    @State private var errorMessage: String?

    private var subscriptions: SubscriptionManager { SubscriptionManager.shared }
    private let features = DataCatalog.shared.paywallFeatures

    private var canStartTrial: Bool {
        subscriptions.hasProducts && !isLoading && !isRestoring
    }

    enum Plan: CaseIterable, Hashable {
        case quarterly, weekly

        var productID: SubscriptionProductID {
            switch self {
            case .quarterly: return .quarterly
            case .weekly: return .weekly
            }
        }

        var label: String {
            switch self {
            case .quarterly: return "Quarterly"
            case .weekly: return "Weekly"
            }
        }

        var fallbackPrice: String {
            switch self {
            case .quarterly: return "$24.99 / quarter"
            case .weekly: return "$5.99 / week"
            }
        }

        var billingNote: String {
            switch self {
            case .quarterly: return "3 days free, then billed quarterly"
            case .weekly: return "3 days free, then billed weekly"
            }
        }

        var isHero: Bool { self == .quarterly }
    }

    var body: some View {
        ZStack {
            LumynScreenBackground().ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: 20) {
                    Text("Begin your practice")
                        .font(LumynTypography.onboardingHeadline)
                        .foregroundStyle(Color.lumynInk)
                        .padding(.top, 16)

                    Text("3 days free, then choose your plan.\nCancel anytime.")
                        .font(LumynTypography.bodyUI)
                        .foregroundStyle(Color.lumynInkSoft)
                        .multilineTextAlignment(.center)

                    VStack(alignment: .leading, spacing: 12) {
                        ForEach(features, id: \.title) { feature in
                            HStack(alignment: .top, spacing: 12) {
                                Text(feature.icon)
                                    .font(.system(size: 18))
                                    .foregroundStyle(Color.lumynCoral)
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(feature.title)
                                        .font(LumynTypography.sans(size: 15, weight: .semibold))
                                        .foregroundStyle(Color.lumynInk)
                                    Text(feature.detail)
                                        .font(LumynTypography.bodySub)
                                        .foregroundStyle(Color.lumynInkSoft)
                                }
                            }
                        }
                    }
                    .lumynScreenHorizontalPadding()

                    VStack(spacing: 8) {
                        ForEach(Plan.allCases, id: \.self) { plan in
                            planTile(plan)
                        }
                    }
                    .lumynScreenHorizontalPadding()

                    PrimaryButton(
                        title: isLoading ? "Processing…" : "Start Free Trial",
                        enabled: canStartTrial && !isLoading
                    ) {
                        startTrial()
                    }
                    .lumynScreenHorizontalPadding()

                    if let errorMessage {
                        Text(errorMessage)
                            .font(LumynTypography.bodySub)
                            .foregroundStyle(Color.lumynCoral)
                            .multilineTextAlignment(.center)
                            .lumynScreenHorizontalPadding()
                    }

                    Button(isRestoring ? "Restoring…" : "Restore purchases") {
                        restore()
                    }
                    .font(LumynTypography.bodySub)
                    .foregroundStyle(Color.lumynInkSoft)
                    .disabled(isRestoring)

                    legalLinks

                    Text("Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period. Manage or cancel in Settings → Apple ID → Subscriptions.")
                        .font(LumynTypography.caption)
                        .foregroundStyle(Color.lumynInkSoft)
                        .multilineTextAlignment(.center)
                        .lumynScreenHorizontalPadding()
                        .padding(.bottom, 24)
                }
            }
        }
        .task { await subscriptions.loadProducts() }
    }

    private func planTile(_ plan: Plan) -> some View {
        Button {
            HapticManager.shared.light()
            selectedPlan = plan
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(plan.label)
                            .font(LumynTypography.sans(size: 16, weight: .semibold))
                        if plan.isHero {
                            Text("BEST VALUE")
                                .font(LumynTypography.eyebrow)
                                .foregroundStyle(Color.lumynGold)
                        }
                    }
                    Text(plan.billingNote)
                        .font(LumynTypography.bodySub)
                        .foregroundStyle(Color.lumynInkSoft)
                }
                Spacer()
                Text(subscriptions.displayPrice(for: plan.productID, fallback: plan.fallbackPrice))
                    .font(LumynTypography.sans(size: 15, weight: .semibold))
            }
            .foregroundStyle(Color.lumynInk)
            .padding(16)
            .background(selectedPlan == plan ? Color.lumynGold.opacity(0.25) : Color.lumynInk.opacity(0.05))
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .strokeBorder(selectedPlan == plan ? Color.lumynCoral : .clear, lineWidth: 1.5)
            )
        }
        .buttonStyle(.plain)
    }

    private var legalLinks: some View {
        HStack(spacing: 16) {
            Link("Terms of Use", destination: URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!)
            Link("Privacy Policy", destination: URL(string: "https://lumyn.app/privacy")!)
        }
        .font(LumynTypography.bodySub)
        .foregroundStyle(Color.lumynInkSoft)
    }

    private func startTrial() {
        isLoading = true
        errorMessage = nil
        Task {
            do {
                let success = try await subscriptions.purchase(selectedPlan.productID)
                if success {
                    let plan = await subscriptions.activePlanId() ?? selectedPlan.productID.planId
                    appState.grantSubscription(plan: plan)
                    appState.completeOnboarding()
                    HapticManager.shared.success()
                }
            } catch SubscriptionError.cancelled {
                // no-op
            } catch {
                errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
            }
            isLoading = false
        }
    }

    private func restore() {
        isRestoring = true
        errorMessage = nil
        Task {
            do {
                try await subscriptions.restore()
                let plan = await subscriptions.activePlanId() ?? .quarterly
                appState.grantSubscription(plan: plan)
                appState.completeOnboarding()
                HapticManager.shared.success()
            } catch {
                errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
            }
            isRestoring = false
        }
    }
}
