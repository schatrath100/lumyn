import SwiftUI

enum AppTab: String, CaseIterable {
    case home, library, combo, mood, journal

    var label: String {
        switch self {
        case .home: return "Home"
        case .library: return "Library"
        case .combo: return "Combo"
        case .mood: return "Mood"
        case .journal: return "Journal"
        }
    }

    var icon: String {
        switch self {
        case .home: return "house"
        case .library: return "books.vertical"
        case .combo: return "square.stack.3d.up"
        case .mood: return "circle.hexagongrid"
        case .journal: return "book"
        }
    }

    var iconFilled: String {
        switch self {
        case .home: return "house.fill"
        case .library: return "books.vertical.fill"
        case .combo: return "square.stack.3d.up.fill"
        case .mood: return "circle.hexagongrid.fill"
        case .journal: return "book.fill"
        }
    }
}

struct MainTabView: View {
    @Environment(AppState.self) private var appState
    @State private var selectedTab: AppTab = .home

    var body: some View {
        Group {
            switch selectedTab {
            case .home: HomeView()
            case .library: LibraryView()
            case .combo: ComboBuilderView()
            case .mood: MoodCheckinView()
            case .journal: JournalView()
            }
        }
        .environment(appState)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .lumynReadableContentWidth()
        .safeAreaInset(edge: .bottom, spacing: 0) {
            TabBarDock(selected: $selectedTab)
        }
    }
}

private struct TabBarDock: View {
    @Binding var selected: AppTab

    var body: some View {
        VStack(spacing: 0) {
            LumynTabDockBackground()

            FloatingTabBar(selected: $selected)
                .padding(.top, 8)
                .padding(.bottom, 4)
                .background(Color.lumynBackground)
        }
    }
}

private struct FloatingTabBar: View {
    @Binding var selected: AppTab
    @Namespace private var dashNS

    var body: some View {
        HStack(spacing: 0) {
            ForEach(AppTab.allCases, id: \.rawValue) { tab in
                tabButton(tab)
            }
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 6)
        .background { LumynFloatingPillBackground() }
        .padding(.horizontal, 16)
        .padding(.bottom, 12)
    }

    private func tabButton(_ tab: AppTab) -> some View {
        Button {
            guard tab != selected else { return }
            HapticManager.shared.selection()
            withAnimation(.smooth(duration: 0.35)) { selected = tab }
        } label: {
            VStack(spacing: 6) {
                Image(systemName: selected == tab ? tab.iconFilled : tab.icon)
                    .font(.system(size: 18))
                    .foregroundStyle(Color.lumynInk.opacity(selected == tab ? 0.9 : 0.5))
                Text(tab.label)
                    .font(LumynTypography.tabLabel)
                    .foregroundStyle(Color.lumynInk.opacity(selected == tab ? 0.9 : 0.5))
                focusDash(isActive: selected == tab)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 6)
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private func focusDash(isActive: Bool) -> some View {
        ZStack {
            if isActive {
                Capsule()
                    .fill(Color.lumynCoral)
                    .frame(width: 16, height: 3)
                    .matchedGeometryEffect(id: "focusDash", in: dashNS)
            } else {
                Capsule().fill(.clear).frame(width: 16, height: 3)
            }
        }
    }
}

#Preview {
    MainTabView()
        .environment(AppState())
}
