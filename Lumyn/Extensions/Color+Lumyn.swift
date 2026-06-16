import SwiftUI
import UIKit

// MARK: - Lumyn Golden Dawn palette (adaptive light / dark)

extension Color {
    static let lumynBackground = Color(uiColor: .lumynBackground)
    static let lumynCoral      = Color(hex: "#E8784B")
    static let lumynGold       = Color(hex: "#F2C44A")
    static let lumynInk        = Color(uiColor: .lumynInk)
    static let lumynInkSoft    = Color(uiColor: .lumynInkSoft)
    static let lumynSurface    = Color(uiColor: .lumynSurface)
    static let lumynFieldFill  = Color(uiColor: .lumynFieldFill)
    /// Fixed dark ink for labels on gold/coral buttons (readable in both schemes).
    static let lumynButtonInk  = Color(hex: "#1E110A")
    static let lumynCardDark   = Color(hex: "#2A1810")
    static let lumynMoodDark   = Color(hex: "#1A0F0A")

    init(hex: String) {
        self.init(uiColor: UIColor(hex: hex))
    }

    init(hexString: String) {
        self.init(hex: hexString)
    }
}

extension Color {
    static func fromHex(_ hex: String) -> Color {
        Color(hex: hex)
    }
}

extension UIColor {
    static let lumynBackground = UIColor { trait in
        trait.userInterfaceStyle == .dark
            ? UIColor(hex: "#1A0F0A")
            : UIColor(hex: "#FFF8F2")
    }

    static let lumynInk = UIColor { trait in
        trait.userInterfaceStyle == .dark
            ? UIColor(hex: "#FFF8F2")
            : UIColor(hex: "#1E110A")
    }

    static let lumynInkSoft = UIColor { trait in
        trait.userInterfaceStyle == .dark
            ? UIColor(hex: "#FFF8F2").withAlphaComponent(0.72)
            : UIColor(hex: "#1E110A").withAlphaComponent(0.62)
    }

    static let lumynSurface = UIColor { trait in
        trait.userInterfaceStyle == .dark
            ? UIColor.white.withAlphaComponent(0.08)
            : UIColor(hex: "#1E110A").withAlphaComponent(0.06)
    }

    static let lumynFieldFill = UIColor { trait in
        trait.userInterfaceStyle == .dark
            ? UIColor.white.withAlphaComponent(0.06)
            : UIColor(hex: "#1E110A").withAlphaComponent(0.05)
    }

    convenience init(hex: String) {
        let cleaned = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var value: UInt64 = 0
        Scanner(string: cleaned).scanHexInt64(&value)
        let r = CGFloat((value >> 16) & 0xFF) / 255
        let g = CGFloat((value >> 8) & 0xFF) / 255
        let b = CGFloat(value & 0xFF) / 255
        self.init(red: r, green: g, blue: b, alpha: 1)
    }
}
