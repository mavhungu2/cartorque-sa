package za.co.cartorquesa.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import za.co.cartorquesa.app.ui.theme.Accent
import za.co.cartorquesa.app.ui.theme.Ink
import za.co.cartorquesa.app.ui.theme.Muted

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BrowseScreen(
    onListingClick: (String) -> Unit,
    browseViewModel: BrowseViewModel = viewModel()
) {
    val uiState by browseViewModel.uiState.collectAsState()
    var showFilterSheet by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(
            title = {
                Text(
                    "Car Torque SA",
                    fontWeight = FontWeight.Bold,
                    color = Accent,
                    fontSize = 20.sp
                )
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = Ink),
            actions = {
                IconButton(onClick = { showFilterSheet = true }) {
                    Icon(Icons.Default.FilterList, contentDescription = "Filter", tint = Accent)
                }
            }
        )

        when (val state = uiState) {
            is BrowseUiState.Loading -> {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Accent)
                }
            }

            is BrowseUiState.Error -> {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(state.message, color = Muted)
                        TextButton(onClick = { browseViewModel.loadListings() }) {
                            Text("Retry", color = Accent, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            is BrowseUiState.Success -> {
                val isRefreshing = false

                if (showFilterSheet) {
                    FilterSheet(
                        facets = state.facets,
                        currentFilter = state.filter,
                        onApply = { filter -> browseViewModel.applyFilter(filter) },
                        onDismiss = { showFilterSheet = false }
                    )
                }

                PullToRefreshBox(
                    isRefreshing = isRefreshing,
                    onRefresh = { browseViewModel.loadListings() },
                    modifier = Modifier.fillMaxSize()
                ) {
                    Column {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                "${state.filteredListings.size} result${if (state.filteredListings.size != 1) "s" else ""}",
                                color = Muted,
                                fontSize = 13.sp
                            )
                            if (!state.filter.isEmpty) {
                                TextButton(onClick = { browseViewModel.clearFilter() }) {
                                    Text("Clear filters", color = Accent, fontSize = 13.sp)
                                }
                            }
                        }

                        if (state.filteredListings.isEmpty()) {
                            Box(
                                Modifier
                                    .fillMaxSize()
                                    .padding(32.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("No listings match your filters.", color = Muted)
                            }
                        } else {
                            LazyVerticalGrid(
                                columns = GridCells.Fixed(2),
                                contentPadding = PaddingValues(12.dp),
                                horizontalArrangement = Arrangement.spacedBy(10.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                items(state.filteredListings) { listing ->
                                    ListingCard(
                                        listing = listing,
                                        onClick = { onListingClick(listing.id) }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
