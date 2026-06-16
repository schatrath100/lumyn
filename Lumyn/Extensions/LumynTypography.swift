import SwiftUI

enum LumynTypography {
    private static let serifFamily = "Playfair Display"
    private static let sansFamily = "DM Sans"

    static func serif(size: CGFloat, weight: Font.Weight = .regular) -> Font {
        Font.custom(serifFamily, size: size).weight(weight)
    }

    static func sans(size: CGFloat, weight: Font.Weight = .regular) -> Font {
        Font.custom(sansFamily, size: size).weight(weight)
    }

    static var screenTitle: Font { serif(size: 28, weight: .regular) }
    static var onboardingHeadline: Font { serif(size: 32, weight: .semibold) }
    static var wordmark: Font { serif(size: 42, weight: .bold) }
    static var bodyUI: Font { sans(size: 15, weight: .regular) }
    static var bodySub: Font { sans(size: 14, weight: .regular) }
    static var caption: Font { sans(size: 12, weight: .regular) }
    static var ctaLabel: Font { sans(size: 15, weight: .semibold) }
    static var eyebrow: Font { sans(size: 11, weight: .bold) }
    static var dailyWord: Font { serif(size: 36, weight: .bold) }
    static var switchWord: Font { serif(size: 28, weight: .semibold) }
    static var tabLabel: Font { sans(size: 10, weight: .medium) }
}
