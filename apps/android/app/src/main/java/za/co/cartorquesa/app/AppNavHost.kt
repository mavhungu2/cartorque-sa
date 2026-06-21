package za.co.cartorquesa.app

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DirectionsCar
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.RequestPage
import androidx.compose.material.icons.filled.VideoLibrary
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import za.co.cartorquesa.app.ui.screens.BrowseScreen
import za.co.cartorquesa.app.ui.screens.BrowseViewModel
import za.co.cartorquesa.app.ui.screens.FinanceFormScreen
import za.co.cartorquesa.app.ui.screens.FinanceViewModel
import za.co.cartorquesa.app.ui.screens.ListingDetailScreen
import za.co.cartorquesa.app.ui.screens.MoreScreen
import za.co.cartorquesa.app.ui.screens.VideosScreen
import za.co.cartorquesa.app.ui.screens.VideosViewModel
import za.co.cartorquesa.app.ui.theme.Accent
import za.co.cartorquesa.app.ui.theme.Ink
import za.co.cartorquesa.app.ui.theme.TabUnselected

private sealed class Screen(val route: String, val label: String, val icon: ImageVector) {
    object Browse : Screen("browse", "Browse", Icons.Default.DirectionsCar)
    object Finance : Screen("finance", "Finance", Icons.Default.RequestPage)
    object Videos : Screen("videos", "Videos", Icons.Default.VideoLibrary)
    object More : Screen("more", "More", Icons.Default.MoreHoriz)
}

private val TAB_SCREENS = listOf(Screen.Browse, Screen.Finance, Screen.Videos, Screen.More)

@Composable
fun AppNavHost() {
    val rootNavController = rememberNavController()
    val navBackStackEntry by rootNavController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    val showBottomBar = TAB_SCREENS.any { screen ->
        currentDestination?.hierarchy?.any { it.route == screen.route } == true
    }

    val browseViewModel: BrowseViewModel = viewModel()
    val videosViewModel: VideosViewModel = viewModel()

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                NavigationBar(containerColor = Ink) {
                    TAB_SCREENS.forEach { screen ->
                        val selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true
                        NavigationBarItem(
                            icon = { Icon(screen.icon, contentDescription = screen.label) },
                            label = { Text(screen.label, fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal) },
                            selected = selected,
                            onClick = {
                                rootNavController.navigate(screen.route) {
                                    popUpTo(rootNavController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = Accent,
                                selectedTextColor = Accent,
                                unselectedIconColor = TabUnselected,
                                unselectedTextColor = TabUnselected,
                                indicatorColor = Ink
                            )
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = rootNavController,
            startDestination = Screen.Browse.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Browse.route) {
                BrowseScreen(
                    onListingClick = { listingId ->
                        rootNavController.navigate("listing/$listingId")
                    },
                    browseViewModel = browseViewModel
                )
            }

            composable("listing/{listingId}") { backStackEntry ->
                val listingId = backStackEntry.arguments?.getString("listingId") ?: return@composable
                val financeViewModel: FinanceViewModel = viewModel(backStackEntry)
                ListingDetailScreen(
                    listingId = listingId,
                    onBack = { rootNavController.popBackStack() },
                    onApplyForFinance = { id, title, price ->
                        rootNavController.navigate("finance_form?listingId=$id&title=${encode(title)}&price=$price")
                    }
                )
            }

            composable(Screen.Finance.route) {
                val financeViewModel: FinanceViewModel = viewModel()
                FinanceFormScreen(
                    onBack = { rootNavController.popBackStack() },
                    viewModel = financeViewModel
                )
            }

            composable("finance_form?listingId={listingId}&title={title}&price={price}") { backStackEntry ->
                val args = backStackEntry.arguments
                val listingId = args?.getString("listingId")
                val title = args?.getString("title")?.let { decode(it) }
                val price = args?.getString("price")?.toDoubleOrNull()
                val financeViewModel: FinanceViewModel = viewModel()
                FinanceFormScreen(
                    prefillListingId = listingId,
                    prefillTitle = title,
                    prefillPrice = price,
                    onBack = { rootNavController.popBackStack() },
                    viewModel = financeViewModel
                )
            }

            composable(Screen.Videos.route) {
                VideosScreen(videosViewModel = videosViewModel)
            }

            composable(Screen.More.route) {
                MoreScreen()
            }
        }
    }
}

private fun encode(s: String): String = java.net.URLEncoder.encode(s, "UTF-8")
private fun decode(s: String): String = java.net.URLDecoder.decode(s, "UTF-8")
