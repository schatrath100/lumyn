import SwiftUI

struct FeedbackView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var message = ""
    @State private var isSending = false
    @State private var errorMessage: String?
    @State private var didSend = false

    private var configured: Bool { SecretsProvider.supabase != nil }
    private var charCount: Int { message.count }
    private var canSend: Bool {
        configured && !isSending && !message.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && charCount <= 140
    }

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 16) {
                Text("Share a thought, bug report, or feature idea. We read every note.")
                    .font(LumynTypography.bodySub)
                    .foregroundStyle(Color.lumynInkSoft)
                    .lineSpacing(4)

                if !configured {
                    Text("Add SupabaseURL and SupabaseAnonKey to Lumyn/Config/Secrets.plist to enable cloud feedback.")
                        .font(LumynTypography.caption)
                        .foregroundStyle(Color.lumynCoral)
                        .padding(12)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.lumynCoral.opacity(0.1))
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                }

                ZStack(alignment: .topLeading) {
                    TextEditor(text: $message)
                        .font(LumynTypography.bodyUI)
                        .frame(minHeight: 120)
                        .padding(10)
                        .scrollContentBackground(.hidden)
                        .background(Color.lumynFieldFill)
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                        .disabled(isSending || didSend)

                    if message.isEmpty {
                        Text("What would make Lumyn better for you?")
                            .font(LumynTypography.bodyUI)
                            .foregroundStyle(Color.lumynInkSoft)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 18)
                            .allowsHitTesting(false)
                    }
                }

                HStack {
                    Spacer()
                    Text("\(charCount)/140")
                        .font(LumynTypography.caption)
                        .foregroundStyle(charCount > 140 ? Color.lumynCoral : Color.lumynInkSoft)
                }

                if let errorMessage {
                    Text(errorMessage)
                        .font(LumynTypography.bodySub)
                        .foregroundStyle(Color.lumynCoral)
                }

                if didSend {
                    Text("Thank you — your feedback was sent.")
                        .font(LumynTypography.bodySub)
                        .foregroundStyle(Color.lumynCoral)
                }

                PrimaryButton(title: isSending ? "Sending…" : "Send Feedback", enabled: canSend && !didSend) {
                    send()
                }

                Spacer()
            }
            .lumynScreenHorizontalPadding()
            .padding(.top, 16)
            .background(LumynScreenBackground().ignoresSafeArea())
            .navigationTitle("Feedback")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private func send() {
        isSending = true
        errorMessage = nil
        Task {
            do {
                try await FeedbackService.shared.submit(message: message)
                didSend = true
                HapticManager.shared.success()
            } catch {
                errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
            }
            isSending = false
        }
    }
}

#Preview {
    FeedbackView()
}
