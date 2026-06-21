package za.co.cartorquesa.app.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import za.co.cartorquesa.app.data.ApiClient
import za.co.cartorquesa.app.data.Listing

sealed class DetailUiState {
    object Loading : DetailUiState()
    data class Success(val listing: Listing) : DetailUiState()
    data class Error(val message: String) : DetailUiState()
}

class ListingDetailViewModel : ViewModel() {

    private val _uiState = MutableStateFlow<DetailUiState>(DetailUiState.Loading)
    val uiState: StateFlow<DetailUiState> = _uiState.asStateFlow()

    fun loadListing(id: String) {
        _uiState.value = DetailUiState.Loading
        viewModelScope.launch(Dispatchers.IO) {
            when (val result = ApiClient.fetchListing(id)) {
                is ApiClient.Result.Success -> _uiState.value = DetailUiState.Success(result.data)
                is ApiClient.Result.Error -> _uiState.value = DetailUiState.Error(result.message)
            }
        }
    }
}
