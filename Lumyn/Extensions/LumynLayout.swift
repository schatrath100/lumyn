import SwiftUI

enum LumynLayout {
    static let screenHorizontal: CGFloat = 22
    static let feedGap: CGFloat = 16
    static let rowListGap: CGFloat = 12
    static let contentTop: CGFloat = 8
    static let readableContentMaxWidth: CGFloat = 560
}

extension View {
    func lumynScreenHorizontalPadding() -> some View {
        padding(.horizontal, LumynLayout.screenHorizontal)
    }

    func lumynReadableContentWidth() -> some View {
        modifier(LumynReadableContentWidthModifier())
    }
}

private struct LumynReadableContentWidthModifier: ViewModifier {
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass

    func body(content: Content) -> some View {
        if horizontalSizeClass == .regular {
            content
                .frame(maxWidth: LumynLayout.readableContentMaxWidth)
                .frame(maxWidth: .infinity)
        } else {
            content
        }
    }
}
