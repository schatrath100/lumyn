import UIKit

final class HapticManager {
    static let shared = HapticManager()
    private init() {}

    private let selectionFeedback = UISelectionFeedbackGenerator()
    private let impactLight = UIImpactFeedbackGenerator(style: .light)
    private let notificationFeedback = UINotificationFeedbackGenerator()

    func selection() { selectionFeedback.selectionChanged() }
    func light() { impactLight.impactOccurred() }
    func success() { notificationFeedback.notificationOccurred(.success) }
}
