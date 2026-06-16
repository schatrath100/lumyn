import UserNotifications
import Foundation

final class NotificationManager {
    static let shared = NotificationManager()
    private init() {}

    private let reminderID = "lumyn.reminder.practice"

    func requestAuthorization() async -> Bool {
        let center = UNUserNotificationCenter.current()
        let status = await center.notificationSettings().authorizationStatus
        switch status {
        case .authorized, .provisional, .ephemeral:
            return true
        case .notDetermined:
            return (try? await center.requestAuthorization(options: [.alert, .sound])) ?? false
        default:
            return false
        }
    }

    func isDenied() async -> Bool {
        await UNUserNotificationCenter.current().notificationSettings().authorizationStatus == .denied
    }

    func sync(settings: AppSettings) {
        Task {
            let center = UNUserNotificationCenter.current()
            center.removePendingNotificationRequests(withIdentifiers: [reminderID])
            guard settings.reminderFrequency != .off else { return }

            let status = await center.notificationSettings().authorizationStatus
            guard status == .authorized || status == .provisional || status == .ephemeral else {
                return
            }

            let time = ReminderTimeParser.components(from: settings.reminderTime)
            var components = DateComponents()
            components.hour = time.hour
            components.minute = time.minute
            if settings.reminderFrequency == .weekly {
                components.weekday = settings.reminderWeekday
            }

            let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: true)
            let request = UNNotificationRequest(identifier: reminderID, content: makeContent(), trigger: trigger)
            try? await center.add(request)
        }
    }

    func cancel() {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [reminderID])
    }

    private func makeContent() -> UNMutableNotificationContent {
        let content = UNMutableNotificationContent()
        content.title = "LUMYN"
        content.body = [
            "Your daily word is ready when you are.",
            "Return to your practice — even a quiet minute counts.",
            "A gentle moment to speak your switch word.",
            "Your ritual awaits — step into the field.",
        ].randomElement() ?? "Your daily word is ready when you are."
        content.sound = .default
        return content
    }
}
