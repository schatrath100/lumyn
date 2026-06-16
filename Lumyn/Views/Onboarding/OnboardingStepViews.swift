import SwiftUI

struct OnboardingSplashIntroView: View {
    let onContinue: () -> Void

    var body: some View {
        onboardingStep(
            title: "Welcome to Lumyn",
            body: "Ancient switch words meet modern ritual. Speak a word, shift your field.",
            button: "Begin"
        )
    }

    @ViewBuilder
    private func onboardingStep(title: String, body: String, button: String) -> some View {
        VStack(spacing: 24) {
            Spacer()
            Text(title)
                .font(LumynTypography.onboardingHeadline)
                .foregroundStyle(Color.lumynInk)
                .multilineTextAlignment(.center)
            Text(body)
                .font(LumynTypography.bodyUI)
                .foregroundStyle(Color.lumynInkSoft)
                .multilineTextAlignment(.center)
                .lineSpacing(5)
                .lumynScreenHorizontalPadding()
            Spacer()
            PrimaryButton(title: button, action: onContinue)
                .lumynScreenHorizontalPadding()
                .padding(.bottom, 32)
        }
    }
}

struct OnboardingIntroView: View {
    let onContinue: () -> Void

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            Text("How it works")
                .font(LumynTypography.onboardingHeadline)
                .foregroundStyle(Color.lumynInk)
            VStack(alignment: .leading, spacing: 16) {
                introRow("1", "Choose a switch word matched to your mood or intention.")
                introRow("2", "Repeat it with focus — 9 times, or until you feel the shift.")
                introRow("3", "Track synchronicities and build combos over time.")
            }
            .lumynScreenHorizontalPadding()
            Spacer()
            PrimaryButton(title: "Continue", action: onContinue)
                .lumynScreenHorizontalPadding()
                .padding(.bottom, 32)
        }
    }

    private func introRow(_ num: String, _ text: String) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Text(num)
                .font(LumynTypography.serif(size: 20, weight: .bold))
                .foregroundStyle(Color.lumynCoral)
            Text(text)
                .font(LumynTypography.bodyUI)
                .foregroundStyle(Color.lumynInkSoft)
        }
    }
}

struct OnboardingIntentionsView: View {
    @Environment(AppState.self) private var appState
    let onContinue: () -> Void

    private let intentions = DataCatalog.shared.intentions

    var body: some View {
        VStack(spacing: 16) {
            Text("What are you calling in?")
                .font(LumynTypography.onboardingHeadline)
                .foregroundStyle(Color.lumynInk)
                .padding(.top, 8)

            ScrollView {
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
                            .background(selected ? Color.lumynGold.opacity(0.35) : Color.lumynInk.opacity(0.05))
                            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                            .overlay(
                                RoundedRectangle(cornerRadius: 14, style: .continuous)
                                    .strokeBorder(selected ? Color.lumynCoral : .clear, lineWidth: 1.5)
                            )
                        }
                        .buttonStyle(.plain)
                    }
                }
                .lumynScreenHorizontalPadding()
            }

            PrimaryButton(title: "Continue", enabled: !appState.profile.selectedIntentions.isEmpty, action: onContinue)
                .lumynScreenHorizontalPadding()
                .padding(.bottom, 32)
        }
    }
}

struct OnboardingProfileView: View {
    @Environment(AppState.self) private var appState
    let onContinue: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Text("About you")
                .font(LumynTypography.onboardingHeadline)
                .foregroundStyle(Color.lumynInk)
                .padding(.top, 8)

            VStack(spacing: 12) {
                TextField("First name (optional)", text: bind(\.firstName))
                    .lumynField()
                TextField("Email (optional)", text: bind(\.email))
                    .textInputAutocapitalization(.never)
                    .keyboardType(.emailAddress)
                    .lumynField()
            }
            .lumynScreenHorizontalPadding()

            Spacer()

            PrimaryButton(title: "Continue", action: onContinue)
                .lumynScreenHorizontalPadding()
                .padding(.bottom, 32)
        }
    }

    private func bind(_ keyPath: WritableKeyPath<UserProfile, String>) -> Binding<String> {
        Binding(
            get: { appState.profile[keyPath: keyPath] },
            set: { appState.profile[keyPath: keyPath] = $0; appState.save() }
        )
    }
}

struct OnboardingNumberView: View {
    @Environment(AppState.self) private var appState
    let onContinue: () -> Void

    @State private var nameInput = ""
    @State private var birthDate = Date()

    var body: some View {
        VStack(spacing: 16) {
            Text("Your resonance number")
                .font(LumynTypography.onboardingHeadline)
                .foregroundStyle(Color.lumynInk)
                .padding(.top, 8)

            Text("Optional — personalizes your daily word.")
                .font(LumynTypography.bodySub)
                .foregroundStyle(Color.lumynInkSoft)

            VStack(spacing: 12) {
                TextField("Full name for numerology", text: $nameInput)
                    .lumynField()
                    .onChange(of: nameInput) { _, newValue in
                        appState.profile.userName = newValue
                        appState.profile.personalNumber = newValue.isEmpty
                            ? nil
                            : NumerologyService.personalNumber(name: newValue, system: appState.profile.numerologySystem)
                        appState.save()
                    }

                DatePicker("Birth date", selection: $birthDate, displayedComponents: .date)
                    .datePickerStyle(.compact)
                    .onChange(of: birthDate) { _, newValue in
                        let formatter = DateFormatter()
                        formatter.dateFormat = "yyyy-MM-dd"
                        appState.profile.birthDate = formatter.string(from: newValue)
                        appState.profile.lifePathNumber = NumerologyService.lifePathNumber(birthDate: appState.profile.birthDate)
                        appState.save()
                    }

                if let number = NumerologyService.resonanceNumber(
                    personalNumber: appState.profile.personalNumber,
                    lifePathNumber: appState.profile.lifePathNumber
                ), let profile = DataCatalog.shared.personalProfile(for: number) {
                    VStack(spacing: 6) {
                        Text("\(number) · \(profile.title)")
                            .font(LumynTypography.serif(size: 22, weight: .semibold))
                            .foregroundStyle(Color.lumynCoral)
                        Text(profile.description)
                            .font(LumynTypography.bodySub)
                            .foregroundStyle(Color.lumynInkSoft)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top, 8)
                }
            }
            .lumynScreenHorizontalPadding()

            Spacer()

            PrimaryButton(title: "Continue", action: onContinue)
                .lumynScreenHorizontalPadding()
                .padding(.bottom, 32)
        }
        .onAppear {
            nameInput = appState.profile.userName
        }
    }
}

struct OnboardingRemindersView: View {
    @Environment(AppState.self) private var appState
    let onContinue: () -> Void

    @State private var reminderDate = Date()

    var body: some View {
        VStack(spacing: 16) {
            Text("Daily reminders")
                .font(LumynTypography.onboardingHeadline)
                .foregroundStyle(Color.lumynInk)
                .padding(.top, 8)

            Picker("Frequency", selection: bindSettings(\.reminderFrequency)) {
                ForEach(ReminderFrequency.allCases, id: \.self) { freq in
                    Text(freq.label).tag(freq)
                }
            }
            .pickerStyle(.segmented)
            .lumynScreenHorizontalPadding()

            if appState.settings.reminderFrequency != .off {
                DatePicker("Time", selection: $reminderDate, displayedComponents: .hourAndMinute)
                    .datePickerStyle(.compact)
                    .lumynScreenHorizontalPadding()
                    .onChange(of: reminderDate) { _, newValue in
                        let comps = Calendar.current.dateComponents([.hour, .minute], from: newValue)
                        appState.settings.reminderTime = ReminderTimeParser.string(
                            hour: comps.hour ?? 8,
                            minute: comps.minute ?? 0
                        )
                        appState.save()
                        NotificationManager.shared.sync(settings: appState.settings)
                    }
            }

            Spacer()

            PrimaryButton(title: "Continue", action: {
                if appState.settings.reminderFrequency != .off {
                    Task { _ = await NotificationManager.shared.requestAuthorization() }
                }
                onContinue()
            })
            .lumynScreenHorizontalPadding()
            .padding(.bottom, 32)
        }
    }

    private func bindSettings<T>(_ keyPath: WritableKeyPath<AppSettings, T>) -> Binding<T> {
        Binding(
            get: { appState.settings[keyPath: keyPath] },
            set: {
                appState.settings[keyPath: keyPath] = $0
                appState.save()
                NotificationManager.shared.sync(settings: appState.settings)
            }
        )
    }
}

struct OnboardingWelcomeView: View {
    @Environment(AppState.self) private var appState
    let onContinue: () -> Void

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            Text("✦")
                .font(.system(size: 48))
            Text("You're ready, \(appState.profile.displayName)")
                .font(LumynTypography.onboardingHeadline)
                .foregroundStyle(Color.lumynInk)
                .multilineTextAlignment(.center)
            Text("Start your 3-day free trial to unlock the full library, mood matching, combos, and journal.")
                .font(LumynTypography.bodyUI)
                .foregroundStyle(Color.lumynInkSoft)
                .multilineTextAlignment(.center)
                .lineSpacing(5)
                .lumynScreenHorizontalPadding()
            Spacer()
            PrimaryButton(title: "Start Free Trial", action: onContinue)
                .lumynScreenHorizontalPadding()
                .padding(.bottom, 32)
        }
    }
}
