package za.co.cartorquesa.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import za.co.cartorquesa.app.data.Listing
import za.co.cartorquesa.app.data.formatMileage
import za.co.cartorquesa.app.data.formatZar
import za.co.cartorquesa.app.ui.theme.Accent
import za.co.cartorquesa.app.ui.theme.CardColor
import za.co.cartorquesa.app.ui.theme.Ink
import za.co.cartorquesa.app.ui.theme.Muted

@Composable
fun ListingCard(listing: Listing, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = CardColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(8.dp)
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(4f / 3f)
            ) {
                val photoUrl = listing.photos.firstOrNull()
                if (photoUrl != null) {
                    AsyncImage(
                        model = photoUrl,
                        contentDescription = listing.title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .fillMaxWidth()
                            .aspectRatio(4f / 3f)
                            .clip(RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp))
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .aspectRatio(4f / 3f)
                            .background(Color(0xFFE4E4E7)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("No photo", color = Muted, fontSize = 12.sp)
                    }
                }

                Row(
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(6.dp),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    if (listing.condition == "new") {
                        StatusChip(text = "NEW", bgColor = Ink, textColor = Accent)
                    }
                    if (listing.verified != "unverified") {
                        val label = if (listing.verified == "fully_verified") "✓ REVIEWED" else "VIN VERIFIED"
                        StatusChip(text = label, bgColor = Accent, textColor = Ink)
                    }
                }
            }

            Column(modifier = Modifier.padding(10.dp)) {
                Text(
                    text = listing.title,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 13.sp,
                    color = Ink
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    text = formatZar(listing.priceZar),
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = Ink
                )
                listing.monthlyZar?.let { monthly ->
                    Text(
                        text = "± ${formatZar(monthly)}/pm",
                        fontSize = 11.sp,
                        color = Muted
                    )
                }
                Spacer(Modifier.height(4.dp))
                Text(
                    text = "${listing.year} • ${formatMileage(listing.mileageKm, listing.condition)} • ${listing.location}",
                    fontSize = 11.sp,
                    color = Muted,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}

@Composable
fun StatusChip(text: String, bgColor: Color, textColor: Color) {
    Box(
        modifier = Modifier
            .background(bgColor, shape = RoundedCornerShape(4.dp))
            .padding(horizontal = 6.dp, vertical = 2.dp)
    ) {
        Text(
            text = text,
            color = textColor,
            fontSize = 9.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.5.sp
        )
    }
}
