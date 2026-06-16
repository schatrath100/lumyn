import SwiftUI

struct DiscoverView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 16) {
                Text("Browse rituals shared by the Lumyn community. Upvote what resonates — save any combo to yours.")
                    .font(LumynTypography.bodyUI)
                    .foregroundStyle(Color.lumynInkSoft)
                    .lineSpacing(4)

                ForEach(DataCatalog.shared.communityCombos) { combo in
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(combo.name)
                                    .font(LumynTypography.bodyUI.weight(.semibold))
                                Text("by \(combo.author) · \(combo.tag)")
                                    .font(LumynTypography.caption)
                                    .foregroundStyle(Color.lumynInkSoft)
                            }
                            Spacer()
                            Button {
                                toggleUpvote(combo.id)
                            } label: {
                                Text("▲ \(displayUpvotes(combo))")
                                    .font(LumynTypography.caption)
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 4)
                                    .background(upvoted(combo.id) ? Color.lumynCoral.opacity(0.12) : Color.lumynSurface)
                                    .foregroundStyle(upvoted(combo.id) ? Color.lumynCoral : Color.lumynInkSoft)
                                    .clipShape(Capsule())
                            }
                            .buttonStyle(.plain)
                        }

                        FlowWordTags(words: combo.words)

                        Button("Save to My Combos") {
                            importCombo(combo)
                        }
                        .font(LumynTypography.bodySub.weight(.semibold))
                        .foregroundStyle(Color.lumynCoral)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.lumynSurface)
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                    }
                    .padding(16)
                    .background(Color.lumynSurface)
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                }
            }
            .lumynScreenHorizontalPadding()
            .padding(.vertical, 16)
        }
        .background(LumynScreenBackground().ignoresSafeArea())
        .navigationTitle("Combo Exchange")
        .navigationBarTitleDisplayMode(.large)
    }

    private func upvoted(_ id: String) -> Bool {
        appState.communityUpvotes.contains(id)
    }

    private func displayUpvotes(_ combo: CommunityCombo) -> Int {
        combo.upvotes + (upvoted(combo.id) ? 1 : 0)
    }

    private func toggleUpvote(_ id: String) {
        if let idx = appState.communityUpvotes.firstIndex(of: id) {
            appState.communityUpvotes.remove(at: idx)
        } else {
            appState.communityUpvotes.append(id)
        }
        appState.save()
        HapticManager.shared.selection()
    }

    private func importCombo(_ combo: CommunityCombo) {
        let saved = Combo(
            id: UUID().uuidString,
            name: combo.name,
            words: combo.words,
            date: LumynDate.formatDate(),
            communityPublishedId: nil
        )
        appState.savedCombos.insert(saved, at: 0)
        appState.save()
        HapticManager.shared.success()
    }
}

private struct FlowWordTags: View {
    let words: [String]

    var body: some View {
        FlowLayout(spacing: 6) {
            ForEach(words, id: \.self) { word in
                Text(word)
                    .font(LumynTypography.bodySub.italic())
                    .foregroundStyle(Color.lumynCoral)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color.lumynCoral.opacity(0.1))
                    .clipShape(Capsule())
            }
        }
    }
}

private struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = arrange(proposal: proposal, subviews: subviews)
        return result.size
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = arrange(proposal: proposal, subviews: subviews)
        for (index, frame) in result.frames.enumerated() {
            subviews[index].place(at: CGPoint(x: bounds.minX + frame.minX, y: bounds.minY + frame.minY), proposal: .unspecified)
        }
    }

    private func arrange(proposal: ProposedViewSize, subviews: Subviews) -> (size: CGSize, frames: [CGRect]) {
        let maxWidth = proposal.width ?? .infinity
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0
        var frames: [CGRect] = []

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > maxWidth, x > 0 {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            frames.append(CGRect(x: x, y: y, width: size.width, height: size.height))
            rowHeight = max(rowHeight, size.height)
            x += size.width + spacing
        }

        return (CGSize(width: maxWidth, height: y + rowHeight), frames)
    }
}
