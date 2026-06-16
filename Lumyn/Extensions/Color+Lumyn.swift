import SwiftUI

// MARK: - Lumyn Golden Dawn palette

extension Color {
    static let lumynBackground = Color(hex: "#FFF8F2")
    static let lumynCoral      = Color(hex: "#E8784B")
    static let lumynGold       = Color(hex: "#F2C44A")
    static let lumynInk        = Color(hex: "#1E110A")
    static let lumynInkSoft    = Color(hex: "#1E110A").opacity(0.62)
    static let lumynSurface    = Color(hex: "#1E110A").opacity(0.06)
    static let lumynCardDark   = Color(hex: "#2A1810")
    static let lumynMoodDark   = Color(hex: "#1A0F0A")

    init(hex: String) {
        let cleaned = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var value: UInt64 = 0
        Scanner(string: cleaned).scanHexInt64(&value)
        let r = Double((value >> 16) & 0xFF) / 255
        let g = Double((value >> 8) & 0xFF) / 255
        let b = Double(value & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
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
