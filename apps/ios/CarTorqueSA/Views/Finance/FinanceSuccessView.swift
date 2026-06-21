import SwiftUI

struct FinanceSuccessView: View {
    let referenceId: String
    let onDone: () -> Void

    var body: some View {
        VStack(spacing: 24) {
            Spacer()

            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 72))
                .foregroundStyle(Theme.accent)

            VStack(spacing: 8) {
                Text("Application Submitted!")
                    .font(.title2.bold())
                    .foregroundStyle(Theme.ink)

                Text("Your finance pre-approval application has been received. A consultant will be in touch.")
                    .font(.subheadline)
                    .foregroundStyle(Theme.muted)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            VStack(spacing: 4) {
                Text("Reference Number")
                    .font(.caption)
                    .foregroundStyle(Theme.muted)
                Text(referenceId)
                    .font(.headline.monospaced())
                    .foregroundStyle(Theme.ink)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Theme.border.opacity(0.6))
                    .cornerRadius(8)
            }

            Spacer()

            Button("Done", action: onDone)
                .buttonStyle(PrimaryButtonStyle())
                .padding(.horizontal, 32)
        }
        .padding(24)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.bg)
    }
}
