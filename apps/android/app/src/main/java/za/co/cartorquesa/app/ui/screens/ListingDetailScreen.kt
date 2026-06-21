package za.co.cartorquesa.app.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import za.co.cartorquesa.app.data.Listing
import za.co.cartorquesa.app.data.formatMileage
import za.co.cartorquesa.app.data.formatZar
import za.co.cartorquesa.app.data.whatsappUrl
import za.co.cartorquesa.app.ui.theme.Accent
import za.co.cartorquesa.app.ui.theme.Border
import za.co.cartorquesa.app.ui.theme.CardColor
import za.co.cartorquesa.app.ui.theme.Danger
import za.co.cartorquesa.app.ui.theme.Ink
import za.co.cartorquesa.app.ui.theme.Muted

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ListingDetailScreen(
    listingId: String,
    onBack: () -> Unit,
    onApplyForFinance: (String, String, Double) -> Unit,
    viewModel: ListingDetailViewModel = viewModel()
) {
    LaunchedEffect(listingId) {
        viewModel.loadListing(listingId)
    }

    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(
            title = { Text("Listing", color = Accent, fontWeight = FontWeight.Bold) },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Accent)
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = Ink)
        )

        when (val state = uiState) {
            is DetailUiState.Loading -> {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Accent)
                }
            }

            is DetailUiState.Error -> {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(state.message, color = Muted)
                        TextButton(onClick = { viewModel.loadListing(listingId) }) {
                            Text("Retry", color = Accent, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            is DetailUiState.Success -> {
                ListingDetailContent(
                    listing = state.listing,
                    onWhatsApp = { wa ->
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(whatsappUrl(wa, state.listing.title)))
                        context.startActivity(intent)
                    },
                    onCall = { phone ->
                        val digits = phone.filter { it.isDigit() }
                        context.startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:$digits")))
                    },
                    onEmail = { email ->
                        val intent = Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:$email"))
                        context.startActivity(intent)
                    },
                    onApplyForFinance = {
                        onApplyForFinance(state.listing.id, state.listing.title, state.listing.priceZar)
                    },
                    onOpenYouTube = { videoId ->
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.youtube.com/watch?v=$videoId"))
                        context.startActivity(intent)
                    }
                )
            }
        }
    }
}

@Composable
private fun ListingDetailContent(
    listing: Listing,
    onWhatsApp: (String) -> Unit,
    onCall: (String) -> Unit,
    onEmail: (String) -> Unit,
    onApplyForFinance: () -> Unit,
    onOpenYouTube: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        PhotoPager(photos = listing.photos)

        Column(modifier = Modifier.padding(16.dp)) {
            Text(listing.title, fontWeight = FontWeight.Bold, fontSize = 20.sp, color = Ink)
            Spacer(Modifier.height(4.dp))
            Text(formatZar(listing.priceZar), fontWeight = FontWeight.Bold, fontSize = 24.sp, color = Ink)

            listing.monthlyZar?.let { monthly ->
                Text(
                    "± ${formatZar(monthly)}/pm (illustrative)",
                    fontSize = 13.sp,
                    color = Muted
                )
            }

            Spacer(Modifier.height(8.dp))

            val conditionLabel = when (listing.condition) {
                "new" -> "New"
                "used" -> "Used"
                else -> null
            }
            conditionLabel?.let {
                StatusChip(
                    text = it.uppercase(),
                    bgColor = if (listing.condition == "new") Ink else Color(0xFFE4E4E7),
                    textColor = if (listing.condition == "new") Accent else Muted
                )
            }

            Spacer(Modifier.height(16.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                listing.ownerWhatsapp?.let { wa ->
                    Button(
                        onClick = { onWhatsApp(wa) },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Ink, contentColor = Accent)
                    ) {
                        Text("WhatsApp seller", fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    }
                }
                listing.ownerPhone?.let { phone ->
                    OutlinedButton(
                        onClick = { onCall(phone) },
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.Phone, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("Call")
                    }
                }
                if (listing.ownerWhatsapp == null && listing.ownerPhone == null) {
                    listing.ownerEmail?.let { email ->
                        OutlinedButton(
                            onClick = { onEmail(email) },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.Email, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("Email seller")
                        }
                    }
                }
            }

            Spacer(Modifier.height(12.dp))

            Button(
                onClick = onApplyForFinance,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Accent, contentColor = Ink)
            ) {
                Text("Apply for finance pre-approval", fontWeight = FontWeight.Bold)
            }

            Spacer(Modifier.height(20.dp))
            HorizontalDivider(color = Border)
            Spacer(Modifier.height(16.dp))

            Text("Specifications", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Ink)
            Spacer(Modifier.height(8.dp))

            SpecsGrid(listing)

            Spacer(Modifier.height(20.dp))
            HorizontalDivider(color = Border)
            Spacer(Modifier.height(16.dp))

            Text("Description", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Ink)
            Spacer(Modifier.height(8.dp))
            Text(listing.description, color = Ink, fontSize = 14.sp, lineHeight = 22.sp)

            listing.videoReviewUrl?.let { videoId ->
                Spacer(Modifier.height(20.dp))
                HorizontalDivider(color = Border)
                Spacer(Modifier.height(16.dp))
                YouTubeReviewCard(videoId = videoId, onClick = { onOpenYouTube(videoId) })
            }

            Spacer(Modifier.height(20.dp))
            HorizontalDivider(color = Border)
            Spacer(Modifier.height(12.dp))

            Text(
                "Always meet in a safe public place. Never pay before seeing the car and original NaTIS papers.",
                fontSize = 12.sp,
                color = Muted,
                lineHeight = 18.sp
            )
            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun PhotoPager(photos: List<String>) {
    if (photos.isEmpty()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(16f / 9f)
                .background(Border),
            contentAlignment = Alignment.Center
        ) {
            Text("No photos", color = Muted)
        }
        return
    }

    val pagerState = rememberPagerState(pageCount = { photos.size })

    Box(modifier = Modifier.fillMaxWidth()) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.fillMaxWidth()
        ) { page ->
            AsyncImage(
                model = photos[page],
                contentDescription = "Photo ${page + 1}",
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(16f / 9f)
            )
        }

        if (photos.size > 1) {
            Row(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                repeat(photos.size) { index ->
                    Box(
                        modifier = Modifier
                            .size(if (index == pagerState.currentPage) 8.dp else 6.dp)
                            .clip(CircleShape)
                            .background(if (index == pagerState.currentPage) Accent else Color.White.copy(alpha = 0.6f))
                    )
                }
            }
        }
    }
}

@Composable
private fun SpecsGrid(listing: Listing) {
    val specs = buildList {
        add("Condition" to (when (listing.condition) { "new" -> "New"; "used" -> "Used"; else -> "N/A" }))
        add("Year" to listing.year.toString())
        add("Mileage" to formatMileage(listing.mileageKm, listing.condition))
        add("Transmission" to listing.transmission.replaceFirstChar { it.uppercase() })
        add("Fuel" to listing.fuelType.replaceFirstChar { it.uppercase() })
        listing.bodyType?.let { add("Body type" to it.replaceFirstChar { c -> c.uppercase() }) }
        listing.color?.let { add("Colour" to it.replaceFirstChar { c -> c.uppercase() }) }
        add("Location" to "${listing.location}, ${listing.province}")
    }

    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        specs.chunked(2).forEach { row ->
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                row.forEach { (label, value) ->
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFF4F4F5)),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Column(modifier = Modifier.padding(10.dp)) {
                            Text(label, fontSize = 11.sp, color = Muted)
                            Text(value, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = Ink)
                        }
                    }
                }
                if (row.size == 1) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
private fun YouTubeReviewCard(videoId: String, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = CardColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(8.dp)
    ) {
        Column {
            AsyncImage(
                model = "https://i.ytimg.com/vi/$videoId/hqdefault.jpg",
                contentDescription = "Car Torque review thumbnail",
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(16f / 9f)
                    .clip(RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp))
            )
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    "Watch the Car Torque review",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Ink
                )
                Text("Opens on YouTube", fontSize = 12.sp, color = Muted)
            }
        }
    }
}
