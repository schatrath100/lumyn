import SwiftUI

struct SplashView: View {
    var onComplete: () -> Void

    @State private var glowOpacity: Double = 0
    @State private var wordmarkOpacity: Double = 0
    @State private var taglineOpacity: Double = 0
    @State private var showNext = false

    var body: some View {
        ZStack {
            LumynScreenBackground().ignoresSafeArea()

            RadialGradient(
                colors: [
                    Color.lumynCoral.opacity(0.35 * glowOpacity),
                    Color.lumynGold.opacity(0.2 * glowOpacity),
                    Color.clear,
                ],
                center: .init(x: 0.5, y: 0.35),
                startRadius: 0,
                endRadius: 280
            )
            .ignoresSafeArea()

            VStack(spacing: 12) {
                Text("LUMYN")
                    .font(LumynTypography.wordmark)
                    .foregroundStyle(Color.lumynCoral)
                    .opacity(wordmarkOpacity)

                Text("Words that shift your world")
                    .font(LumynTypography.serif(size: 18, weight: .regular))
                    .foregroundStyle(Color.lumynInkSoft)
                    .opacity(taglineOpacity)
            }

            if showNext {
                Button {
                    HapticManager.shared.light()
                    onComplete()
                } label: {
                    Text("Continue")
                        .font(LumynTypography.ctaLabel)
                        .foregroundStyle(Color.lumynCoral)
                        .padding(.horizontal, 18)
                        .padding(.vertical, 10)
                        .background(Capsule().fill(Color.lumynCoral.opacity(0.12)))
                }
                .buttonStyle(.plain)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomTrailing)
                .padding(.trailing, 24)
                .padding(.bottom, 36)
                .transition(.opacity.combined(with: .move(edge: .bottom)))
            }
        }
        .onAppear { animate() }
    }

    private func animate() {
        withAnimation(.easeOut(duration: 0.9)) { glowOpacity = 1 }
        withAnimation(.easeOut(duration: 0.75).delay(0.15)) { wordmarkOpacity = 1 }
        withAnimation(.easeOut(duration: 0.7).delay(0.45)) { taglineOpacity = 1 }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
            withAnimation(.easeOut(duration: 0.45)) { showNext = true }
        }
    }
}

#Preview {
    SplashView(onComplete: {})
}
