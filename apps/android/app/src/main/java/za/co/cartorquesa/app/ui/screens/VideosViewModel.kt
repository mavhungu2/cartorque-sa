package za.co.cartorquesa.app.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import za.co.cartorquesa.app.data.ApiClient
import za.co.cartorquesa.app.data.Video
import za.co.cartorquesa.app.data.VideoChannel

sealed class VideosUiState {
    object Loading : VideosUiState()
    data class Success(val channel: VideoChannel, val videos: List<Video>) : VideosUiState()
    data class Error(val message: String) : VideosUiState()
}

class VideosViewModel : ViewModel() {

    private val _uiState = MutableStateFlow<VideosUiState>(VideosUiState.Loading)
    val uiState: StateFlow<VideosUiState> = _uiState.asStateFlow()

    init {
        loadVideos()
    }

    fun loadVideos() {
        _uiState.value = VideosUiState.Loading
        viewModelScope.launch(Dispatchers.IO) {
            when (val result = ApiClient.fetchVideos()) {
                is ApiClient.Result.Success -> {
                    _uiState.value = VideosUiState.Success(result.data.channel, result.data.videos)
                }
                is ApiClient.Result.Error -> {
                    _uiState.value = VideosUiState.Error(result.message)
                }
            }
        }
    }
}
