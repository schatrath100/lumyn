import Foundation

struct SupabaseConfig {
    let url: URL
    let anonKey: String
}

enum SecretsProvider {
    static var supabase: SupabaseConfig? {
        guard let url = Bundle.main.url(forResource: "Secrets", withExtension: "plist"),
              let data = try? Data(contentsOf: url),
              let plist = try? PropertyListSerialization.propertyList(from: data, format: nil) as? [String: Any],
              let urlString = plist["SupabaseURL"] as? String,
              let anonKey = plist["SupabaseAnonKey"] as? String,
              !urlString.isEmpty,
              !anonKey.isEmpty,
              let supabaseURL = URL(string: urlString) else {
            return nil
        }
        return SupabaseConfig(url: supabaseURL, anonKey: anonKey)
    }
}
