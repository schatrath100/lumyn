import SwiftUI

// MARK: - Primary button

struct PrimaryButton: View {
    let title: String
    var enabled: Bool = true
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(LumynTypography.ctaLabel)
                .foregroundStyle(Color.lumynInk)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [Color.lumynGold, Color.lumynCoral.opacity(0.85)],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .opacity(enabled ? 1 : 0.45)
        }
        .buttonStyle(.plain)
        .disabled(!enabled)
    }
}

// MARK: - Progress dots

struct ProgressDots: View {
    let total: Int
    let current: Int

    var body: some View {
        HStack(spacing: 8) {
            ForEach(0..<total, id: \.self) { index in
                Capsule()
                    .fill(index <= current ? Color.lumynCoral : Color.lumynInk.opacity(0.15))
                    .frame(width: index == current ? 22 : 8, height: 8)
                    .animation(.easeInOut(duration: 0.25), value: current)
            }
        }
    }
}

// MARK: - Screen header

struct TabScreenHeader: View {
    let title: String
    var subtitle: String? = nil
    var onDark: Bool = false
    var trailing: AnyView? = nil

    private var titleColor: Color { onDark ? .white : .lumynInk }
    private var subtitleColor: Color { onDark ? .white.opacity(0.72) : .lumynInkSoft }

    var body: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(LumynTypography.screenTitle)
                    .foregroundStyle(titleColor)
                if let subtitle {
                    Text(subtitle)
                        .font(LumynTypography.bodySub)
                        .foregroundStyle(subtitleColor)
                }
            }
            Spacer()
            trailing
        }
        .lumynScreenHorizontalPadding()
        .padding(.top, 8)
        .padding(.bottom, 4)
    }
}

// MARK: - Daily word card

struct DailyWordCard: View {
    let context: DailyWordContext
    var onTap: (() -> Void)? = nil

    var body: some View {
        Button {
            onTap?()
        } label: {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Text("TODAY'S WORD")
                        .font(LumynTypography.eyebrow)
                        .foregroundStyle(Color.lumynGold.opacity(0.9))
                    Spacer()
                    Text("\(context.moonEmoji) \(context.moonLabel)")
                        .font(LumynTypography.bodySub)
                        .foregroundStyle(.white.opacity(0.7))
                }
                Text(context.word.word)
                    .font(LumynTypography.dailyWord)
                    .foregroundStyle(.white)
                Text(context.ritualPrompt)
                    .font(LumynTypography.bodySub)
                    .foregroundStyle(.white.opacity(0.75))
                    .lineSpacing(4)
                    .multilineTextAlignment(.leading)
            }
            .padding(20)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(
                LinearGradient(
                    colors: [Color.lumynCardDark, Color.lumynCoral.opacity(0.55)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Mood tile

struct MoodTile: View {
    let mood: Mood

    var body: some View {
        VStack(spacing: 8) {
            Text(mood.sym)
                .font(.system(size: 22))
                .foregroundStyle(Color(hex: mood.color))
            Text(mood.label)
                .font(LumynTypography.bodySub)
                .foregroundStyle(Color.lumynInk)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(Color(hex: mood.color).opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}

// MARK: - Screen backgrounds

struct LumynScreenBackground: View {
    var body: some View {
        LinearGradient(
            colors: [Color.lumynBackground, Color.lumynGold.opacity(0.08)],
            startPoint: .top,
            endPoint: .bottom
        )
    }
}

struct LumynDarkScreenBackground: View {
    var body: some View {
        LinearGradient(
            colors: [Color.lumynMoodDark, Color.lumynCardDark],
            startPoint: .top,
            endPoint: .bottom
        )
    }
}

// MARK: - Floating tab dock styling

struct LumynTabDockBackground: View {
    var body: some View {
        VStack(spacing: 0) {
            LinearGradient(
                colors: [Color.lumynBackground.opacity(0), Color.lumynBackground],
                startPoint: .top,
                endPoint: .bottom
            )
            .frame(height: 22)
            .allowsHitTesting(false)

            Rectangle()
                .fill(Color.lumynCoral.opacity(0.15))
                .frame(height: 0.5)
        }
    }
}

struct LumynFloatingPillBackground: View {
    var body: some View {
        RoundedRectangle(cornerRadius: 28, style: .continuous)
            .fill(.ultraThinMaterial)
            .overlay(
                RoundedRectangle(cornerRadius: 28, style: .continuous)
                    .strokeBorder(Color.lumynGold.opacity(0.28), lineWidth: 0.75)
            )
    }
}

struct LumynField: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(14)
            .background(Color.lumynInk.opacity(0.05))
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }
}

extension View {
    func lumynField() -> some View { modifier(LumynField()) }
}
