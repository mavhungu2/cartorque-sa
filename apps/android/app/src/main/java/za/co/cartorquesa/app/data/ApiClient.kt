package za.co.cartorquesa.app.data

import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.logging.HttpLoggingInterceptor

object ApiClient {

    private val json = Json {
        ignoreUnknownKeys = true
        coerceInputValues = true
        isLenient = true
    }

    private val client: OkHttpClient by lazy {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BASIC
        }
        OkHttpClient.Builder()
            .addInterceptor(logging)
            .build()
    }

    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    sealed class Result<out T> {
        data class Success<T>(val data: T) : Result<T>()
        data class Error(val message: String, val code: String? = null, val field: String? = null) : Result<Nothing>()
    }

    fun fetchListings(): Result<ListingsResponse> {
        return try {
            val request = Request.Builder()
                .url("${Constants.BASE_URL}/listings")
                .build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: return Result.Error("Empty response")
                Result.Success(json.decodeFromString(body))
            } else {
                Result.Error("Server error: ${response.code}")
            }
        } catch (e: Exception) {
            Result.Error(e.message ?: "Network error")
        }
    }

    fun fetchListing(id: String): Result<Listing> {
        return try {
            val request = Request.Builder()
                .url("${Constants.BASE_URL}/listings/$id")
                .build()
            val response = client.newCall(request).execute()
            val body = response.body?.string() ?: return Result.Error("Empty response")
            if (response.isSuccessful) {
                val wrapper = json.decodeFromString<ListingResponse>(body)
                Result.Success(wrapper.listing)
            } else if (response.code == 404) {
                Result.Error("Listing not found")
            } else {
                Result.Error("Server error: ${response.code}")
            }
        } catch (e: Exception) {
            Result.Error(e.message ?: "Network error")
        }
    }

    fun fetchVideos(): Result<VideosResponse> {
        return try {
            val request = Request.Builder()
                .url("${Constants.BASE_URL}/videos")
                .build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: return Result.Error("Empty response")
                Result.Success(json.decodeFromString(body))
            } else {
                Result.Error("Server error: ${response.code}")
            }
        } catch (e: Exception) {
            Result.Error(e.message ?: "Network error")
        }
    }

    fun submitFinance(request: FinanceRequest): Result<FinanceResponse> {
        return try {
            val bodyJson = json.encodeToString(FinanceRequest.serializer(), request)
            val requestBody = bodyJson.toRequestBody(jsonMediaType)
            val httpRequest = Request.Builder()
                .url("${Constants.BASE_URL}/finance")
                .post(requestBody)
                .build()
            val response = client.newCall(httpRequest).execute()
            val body = response.body?.string() ?: return Result.Error("Empty response")
            when {
                response.code == 201 -> Result.Success(json.decodeFromString(body))
                response.code == 400 -> {
                    val err = json.decodeFromString<ApiErrorWrapper>(body)
                    Result.Error(err.error.message, err.error.code, err.error.field)
                }
                response.code == 429 -> {
                    val err = runCatching { json.decodeFromString<ApiErrorWrapper>(body).error }.getOrNull()
                    Result.Error(err?.message ?: "Too many requests. Please try again later.", "rate_limited", null)
                }
                else -> Result.Error("Server error: ${response.code}")
            }
        } catch (e: Exception) {
            Result.Error(e.message ?: "Network error")
        }
    }
}
