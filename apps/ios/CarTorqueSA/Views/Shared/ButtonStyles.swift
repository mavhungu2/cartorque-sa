import SwiftUI

struct PrimaryButtonStyle: ButtonStyle {
    var isLoading: Bool = false

    func makeBody(configuration: Configuration) -> some View {
        HStack(spacing: 8) {
            if isLoading {
                ProgressView()
                    .tint(Theme.ink)
                    .scaleEffect(0.8)
            }
            configuration.label
        }
        .font(.headline)
        .foregroundStyle(Theme.ink)
        .frame(maxWidth: .infinity, minHeight: 50)
        .background(Theme.accent)
        .cornerRadius(10)
        .opacity(configuration.isPressed ? 0.8 : 1.0)
    }
}

struct OutlineButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .foregroundStyle(Theme.ink)
            .frame(maxWidth: .infinity, minHeight: 50)
            .background(Color.clear)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Theme.border, lineWidth: 1.5)
            )
            .opacity(configuration.isPressed ? 0.7 : 1.0)
    }
}

struct ChipLabel: View {
    let text: String
    var background: Color = Theme.accent
    var foreground: Color = Theme.ink

    var body: some View {
        Text(text)
            .font(.caption2.bold())
            .foregroundStyle(foreground)
            .padding(.horizontal, 6)
            .padding(.vertical, 3)
            .background(background)
            .cornerRadius(4)
    }
}
