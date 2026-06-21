package za.co.cartorquesa.app.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import za.co.cartorquesa.app.data.ApiClient
import za.co.cartorquesa.app.data.FilterState
import za.co.cartorquesa.app.data.Listing
import za.co.cartorquesa.app.data.ListingFacets

sealed class BrowseUiState {
    object Loading : BrowseUiState()
    data class Success(
        val listings: List<Listing>,
        val facets: ListingFacets,
        val filter: FilterState,
        val filteredListings: List<Listing>
    ) : BrowseUiState()
    data class Error(val message: String) : BrowseUiState()
}

class BrowseViewModel : ViewModel() {

    private val _uiState = MutableStateFlow<BrowseUiState>(BrowseUiState.Loading)
    val uiState: StateFlow<BrowseUiState> = _uiState.asStateFlow()

    init {
        loadListings()
    }

    fun loadListings() {
        _uiState.value = BrowseUiState.Loading
        viewModelScope.launch(Dispatchers.IO) {
            when (val result = ApiClient.fetchListings()) {
                is ApiClient.Result.Success -> {
                    val data = result.data
                    _uiState.value = BrowseUiState.Success(
                        listings = data.listings,
                        facets = data.facets,
                        filter = FilterState(),
                        filteredListings = data.listings
                    )
                }
                is ApiClient.Result.Error -> {
                    _uiState.value = BrowseUiState.Error(result.message)
                }
            }
        }
    }

    fun applyFilter(filter: FilterState) {
        val current = _uiState.value as? BrowseUiState.Success ?: return
        _uiState.value = current.copy(
            filter = filter,
            filteredListings = current.listings.filter { filter.matches(it) }
        )
    }

    fun clearFilter() {
        val current = _uiState.value as? BrowseUiState.Success ?: return
        _uiState.value = current.copy(
            filter = FilterState(),
            filteredListings = current.listings
        )
    }
}
