import SwiftUI

struct LibraryView: View {
    @Environment(AppState.self) private var appState
    @State private var search = ""
    @State private var selectedCategory = "All"

    private var categories: [String] {
        DataCatalog.shared.categories
    }

    private var filteredWords: [SwitchWord] {
        DataCatalog.shared.switchWords.filter { word in
            let matchesCategory = selectedCategory == "All" || word.category == selectedCategory
            let query = search.trimmingCharacters(in: .whitespacesAndNewlines)
            let matchesSearch = query.isEmpty
                || word.word.localizedCaseInsensitiveContains(query)
                || word.intention.localizedCaseInsensitiveContains(query)
            return matchesCategory && matchesSearch
        }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                TabScreenHeader(title: "Library", subtitle: "\(DataCatalog.shared.switchWords.count) switch words")

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(categories, id: \.self) { category in
                            categoryChip(category)
                        }
                    }
                    .padding(.horizontal, LumynLayout.screenHorizontal)
                    .padding(.bottom, 8)
                }

                List(filteredWords) { word in
                    NavigationLink {
                        WordDetailView(word: word)
                    } label: {
                        HStack {
                            Text(word.word)
                                .font(LumynTypography.switchWord)
                                .foregroundStyle(Color(hex: word.color))
                            Spacer()
                            Text(word.category)
                                .font(LumynTypography.bodySub)
                                .foregroundStyle(Color.lumynInkSoft)
                        }
                    }
                    .listRowBackground(Color.lumynBackground)
                }
                .listStyle(.plain)
                .searchable(text: $search, prompt: "Search words")
            }
            .background(LumynScreenBackground().ignoresSafeArea())
        }
    }

    private func categoryChip(_ category: String) -> some View {
        Button {
            HapticManager.shared.selection()
            selectedCategory = category
        } label: {
            Text(category)
                .font(LumynTypography.bodySub)
                .foregroundStyle(selectedCategory == category ? Color.lumynInk : Color.lumynInkSoft)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(selectedCategory == category ? Color.lumynGold.opacity(0.35) : Color.lumynSurface)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    LibraryView()
        .environment(AppState())
}
