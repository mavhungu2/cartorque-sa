package za.co.cartorquesa.app.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Listing(
    val id: String = "",
    val ownerId: String = "",
    val ownerName: String = "",
    val ownerPhone: String? = null,
    val ownerWhatsapp: String? = null,
    val ownerEmail: String? = null,
    val title: String = "",
    val make: String = "",
    val model: String = "",
    val variant: String? = null,
    val year: Int = 0,
    val mileageKm: Int = 0,
    val transmission: String = "",
    val fuelType: String = "",
    val bodyType: String? = null,
    val color: String? = null,
    val priceZar: Double = 0.0,
    val monthlyZar: Double? = null,
    val condition: String? = null,
    val negotiable: Boolean = false,
    val location: String = "",
    val province: String = "",
    val description: String = "",
    val photos: List<String> = emptyList(),
    val status: String = "",
    val verified: String = "unverified",
    val videoReviewUrl: String? = null,
    val createdAt: String = "",
    val updatedAt: String = ""
)

@Serializable
data class ListingFacets(
    val makes: List<String> = emptyList(),
    val modelsByMake: Map<String, List<String>> = emptyMap(),
    val years: List<Int> = emptyList(),
    val maxMileage: Int = 200000,
    val provinces: List<String> = emptyList()
)

@Serializable
data class ListingsResponse(
    val listings: List<Listing> = emptyList(),
    val facets: ListingFacets = ListingFacets(),
    val total: Int = 0,
    val nextCursor: String? = null
)

@Serializable
data class ListingResponse(
    val listing: Listing
)

@Serializable
data class VideoChannel(
    val name: String = "",
    val handle: String = "",
    val url: String = "",
    val tagline: String = "",
    val about: String = ""
)

@Serializable
data class Video(
    val id: String = "",
    val title: String = "",
    val category: String = "",
    val description: String = ""
)

@Serializable
data class VideoCategory(
    val slug: String = "",
    val title: String = "",
    val blurb: String = ""
)

@Serializable
data class VideosResponse(
    val channel: VideoChannel = VideoChannel(),
    val videos: List<Video> = emptyList(),
    val categories: List<VideoCategory> = emptyList()
)

@Serializable
data class FinanceRequest(
    val fullName: String,
    val idNumber: String,
    val phone: String,
    val email: String,
    val hasDriversLicence: Boolean,
    val employmentStatus: String,
    val employer: String? = null,
    val occupation: String? = null,
    val yearsEmployed: Int? = null,
    val grossMonthlyIncome: Double,
    val netMonthlyIncome: Double,
    val monthlyExpenses: Double,
    val existingCreditCommitments: Double,
    val listingId: String? = null,
    val vehicleDescription: String? = null,
    val purchasePriceZar: Double? = null,
    val depositZar: Double,
    val preferredTermMonths: Int,
    val consentPopia: Boolean,
    val consentCreditCheck: Boolean
)

@Serializable
data class FinanceResponse(
    val id: String
)

@Serializable
data class ApiError(
    val code: String = "",
    val message: String = "",
    val field: String? = null
)

@Serializable
data class ApiErrorWrapper(
    val error: ApiError
)

data class FilterState(
    val make: String? = null,
    val model: String? = null,
    val yearFrom: Int? = null,
    val maxMileage: Int? = null,
    val minPrice: Double? = null,
    val maxPrice: Double? = null,
    val province: String? = null,
    val verifiedOnly: Boolean = false
) {
    fun matches(listing: Listing): Boolean {
        if (make != null && !listing.make.equals(make, ignoreCase = true)) return false
        if (model != null && !listing.model.equals(model, ignoreCase = true)) return false
        if (yearFrom != null && listing.year < yearFrom) return false
        if (maxMileage != null && listing.mileageKm > maxMileage) return false
        if (minPrice != null && listing.priceZar < minPrice) return false
        if (maxPrice != null && listing.priceZar > maxPrice) return false
        if (province != null && !listing.province.equals(province, ignoreCase = true)) return false
        if (verifiedOnly && listing.verified == "unverified") return false
        return true
    }

    val isEmpty: Boolean
        get() = make == null && model == null && yearFrom == null && maxMileage == null &&
                minPrice == null && maxPrice == null && province == null && !verifiedOnly
}
