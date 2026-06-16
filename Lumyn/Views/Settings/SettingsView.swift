import SwiftUI

struct SettingsView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.dismiss) private var dismiss
    @Environment(\.openURL) private var openURL

    @State private var showDeleteConfirm = false
    @State private var reminderDate = Date()

    var body: some View {
        List {
            Section("Appearance") {
                Toggle("Dark Mode", isOn: Binding(
                    get: { appState.settings.darkMode },
                    set: { _ in appState.toggleDarkMode() }
                ))
            }

            Section("Reminders") {
                Picker("Frequency", selection: Binding(
                    get: { appState.settings.reminderFrequency },
                    set: { newValue in
                        appState.updateSettings { $0.reminderFrequency = newValue }
                        if newValue != .off {
                            Task { _ = await NotificationManager.shared.requestAuthorization() }
                        }
                    }
                )) {
                    ForEach(ReminderFrequency.allCases, id: \.self) { f in
                        Text(f.label).tag(f)
                    }
                }

                if appState.settings.reminderFrequency != .off {
                    DatePicker("Time", selection: $reminderDate, displayedComponents: .hourAndMinute)
                        .onChange(of: reminderDate) { _, newValue in
                            let comps = Calendar.current.dateComponents([.hour, .minute], from: newValue)
                            appState.updateSettings {
                                $0.reminderTime = ReminderTimeParser.string(
                                    hour: comps.hour ?? 8,
                                    minute: comps.minute ?? 0
                                )
                            }
                        }
                }
            }

            Section("Profile") {
                HStack {
                    Text(appState.profile.avatarEmoji)
                        .font(.system(size: 32))
                    VStack(alignment: .leading) {
                        Text(appState.profile.displayName)
                        if !appState.profile.email.isEmpty {
                            Text(appState.profile.email)
                                .font(LumynTypography.bodySub)
                                .foregroundStyle(Color.lumynInkSoft)
                        }
                    }
                }
            }

            Section("Subscription") {
                if appState.profile.isSubscribed {
                    Button("Manage Subscription") {
                        openURL(URL(string: "https://apps.apple.com/account/subscriptions")!)
                    }
                }
            }

            Section("Legal") {
                Button("Terms of Use (Apple EULA)") {
                    openURL(URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!)
                }
                Button("Privacy Policy") {
                    openURL(URL(string: "https://lumyn.app/privacy")!)
                }
            }

            Section {
                Button("Delete All Data", role: .destructive) {
                    showDeleteConfirm = true
                }
            }
        }
        .navigationTitle("Settings")
        .navigationBarTitleDisplayMode(.inline)
        .confirmationDialog(
            "Delete all local data?",
            isPresented: $showDeleteConfirm,
            titleVisibility: .visible
        ) {
            Button("Delete Everything", role: .destructive) {
                appState.deleteAllData()
                dismiss()
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("This removes all combos, journal entries, and settings from this device.")
        }
    }
}

#Preview {
    NavigationStack {
        SettingsView()
    }
    .environment(AppState())
}
