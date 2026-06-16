import SwiftUI

@main
struct LumynApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @State private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            LumynRootView()
                .environment(appState)
        }
    }
}

private struct LumynRootView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        ContentView()
            .preferredColorScheme(appState.settings.darkMode ? .dark : .light)
    }
}
