package za.co.cartorquesa.app.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import za.co.cartorquesa.app.data.ApiClient
import za.co.cartorquesa.app.data.FinanceRequest

sealed class FinanceUiState {
    object Idle : FinanceUiState()
    object Submitting : FinanceUiState()
    data class Success(val referenceId: String) : FinanceUiState()
    data class Error(val message: String, val code: String? = null, val field: String? = null) : FinanceUiState()
}

class FinanceViewModel : ViewModel() {

    private val _uiState = MutableStateFlow<FinanceUiState>(FinanceUiState.Idle)
    val uiState: StateFlow<FinanceUiState> = _uiState.asStateFlow()

    fun submit(request: FinanceRequest) {
        _uiState.value = FinanceUiState.Submitting
        viewModelScope.launch(Dispatchers.IO) {
            when (val result = ApiClient.submitFinance(request)) {
                is ApiClient.Result.Success -> _uiState.value = FinanceUiState.Success(result.data.id)
                is ApiClient.Result.Error -> _uiState.value = FinanceUiState.Error(result.message, result.code, result.field)
            }
        }
    }

    fun resetState() {
        _uiState.value = FinanceUiState.Idle
    }
}
