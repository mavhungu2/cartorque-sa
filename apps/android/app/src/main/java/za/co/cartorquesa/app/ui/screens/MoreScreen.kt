package za.co.cartorquesa.app.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import za.co.cartorquesa.app.ui.theme.Accent
import za.co.cartorquesa.app.ui.theme.Border
import za.co.cartorquesa.app.ui.theme.Ink
import za.co.cartorquesa.app.ui.theme.Muted

private data class MoreItem(val label: String, val url: String)

private val MORE_ITEMS = listOf(
    MoreItem("Sell my car", "https://cartorque-sa--cartorque-sa.us-east4.hosted.app/sell"),
    MoreItem("Watch on YouTube", "https://www.youtube.com/@CarTorqueSA"),
    MoreItem("Instagram", "https://www.instagram.com/car_torque_za/"),
    MoreItem("Facebook", "https://www.facebook.com/profile.php?id=100076080243370"),
    MoreItem("Contact us", "mailto:hello@cartorque.co.za"),
    MoreItem("Privacy policy", "https://cartorque-sa--cartorque-sa.us-east4.hosted.app/privacy")
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MoreScreen() {
    val context = LocalContext.current

    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(
            title = { Text("More", fontWeight = FontWeight.Bold, color = Accent, fontSize = 20.sp) },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = Ink)
        )

        Column(modifier = Modifier.weight(1f)) {
            MORE_ITEMS.forEachIndexed { index, item ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(item.url))
                            context.startActivity(intent)
                        }
                        .padding(horizontal = 20.dp, vertical = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        item.label,
                        modifier = Modifier.weight(1f),
                        fontSize = 16.sp,
                        color = Ink
                    )
                    Icon(
                        Icons.AutoMirrored.Filled.ArrowForwardIos,
                        contentDescription = null,
                        tint = Muted,
                        modifier = Modifier.size(14.dp)
                    )
                }
                if (index < MORE_ITEMS.lastIndex) {
                    HorizontalDivider(color = Border, modifier = Modifier.padding(start = 20.dp))
                }
            }
        }

        Text(
            "Car Torque SA v1.0 — honest cars from SA.",
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            fontSize = 12.sp,
            color = Muted
        )
    }
}
