import SwiftUI

// TODO: Bundle Playfair Display + DM Sans font files and register in Info.plist UIAppFonts.
enum LumynTypography {
    static func serif(size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .system(size: size, weight: weight, design: .serif)
    }

    static func sans(size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .system(size: size, weight: weight, design: .rounded)
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
