package za.co.cartorquesa.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val Accent = Color(0xFFFFD400)
val Accent2 = Color(0xFFFFB700)
val Ink = Color(0xFF0A0A0B)
val BgColor = Color(0xFFFAFAFA)
val CardColor = Color(0xFFFFFFFF)
val Muted = Color(0xFF52525B)
val Border = Color(0xFFE4E4E7)
val Danger = Color(0xFFE10600)
val TabUnselected = Color(0xFF9A9AA3)

private val ColorScheme = lightColorScheme(
    primary = Accent,
    onPrimary = Ink,
    secondary = Accent2,
    onSecondary = Ink,
    background = BgColor,
    surface = CardColor,
    onBackground = Ink,
    onSurface = Ink,
    error = Danger
)

@Composable
fun CarTorqueSATheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = ColorScheme,
        content = content
    )
}
