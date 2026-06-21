package za.co.cartorquesa.app.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import za.co.cartorquesa.app.data.Video
import za.co.cartorquesa.app.ui.theme.Accent
import za.co.cartorquesa.app.ui.theme.CardColor
import za.co.cartorquesa.app.ui.theme.Ink
import za.co.cartorquesa.app.ui.theme.Muted

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VideosScreen(videosViewModel: VideosViewModel = viewModel()) {
    val uiState by videosViewModel.uiState.collectAsState()
    val context = LocalContext.current

    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(
            title = { Text("Videos", fontWeight = FontWeight.Bold, color = Accent, fontSize = 20.sp) },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = Ink)
        )

        when (val state = uiState) {
            is VideosUiState.Loading -> {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Accent)
                }
            }

            is VideosUiState.Error -> {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(state.message, color = Muted)
                        TextButton(onClick = { videosViewModel.loadVideos() }) {
                            Text("Retry", color = Accent, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            is VideosUiState.Success -> {
                if (state.videos.isEmpty()) {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("No videos available.", color = Muted)
                    }
                } else {
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.padding(12.dp)
                    ) {
                        items(state.videos) { video ->
                            VideoCard(video = video, onClick = {
                                val intent = Intent(
                                    Intent.ACTION_VIEW,
                                    Uri.parse("https://www.youtube.com/watch?v=${video.id}")
                                )
                                context.startActivity(intent)
                            })
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun VideoCard(video: Video, onClick: () -> Unit) {
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
                model = "https://i.ytimg.com/vi/${video.id}/hqdefault.jpg",
                contentDescription = video.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(16f / 9f)
                    .clip(RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp))
            )
            Column(modifier = Modifier.padding(12.dp)) {
                if (video.category.isNotBlank()) {
                    StatusChip(
                        text = video.category.uppercase(),
                        bgColor = Accent,
                        textColor = Ink
                    )
                    Spacer(Modifier.height(6.dp))
                }
                Text(
                    video.title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    color = Ink
                )
                if (video.description.isNotBlank()) {
                    Spacer(Modifier.height(4.dp))
                    Text(
                        video.description,
                        fontSize = 12.sp,
                        color = Muted,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}
