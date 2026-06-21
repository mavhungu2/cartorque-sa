package za.co.cartorquesa.app.data

import java.text.NumberFormat
import java.util.Locale
import kotlin.math.pow

fun formatZar(amount: Double): String {
    val formatter = NumberFormat.getNumberInstance(Locale("en", "ZA")).apply {
        maximumFractionDigits = 0
        minimumFractionDigits = 0
    }
    return "R ${formatter.format(amount.toLong())}"
}

fun formatMileage(km: Int, condition: String?): String {
    if (condition == "new" && km == 0) return "New"
    val formatter = NumberFormat.getNumberInstance(Locale("en", "ZA")).apply {
        maximumFractionDigits = 0
    }
    return "${formatter.format(km)} km"
}

fun calculateMonthlyInstalment(
    purchasePrice: Double,
    deposit: Double,
    termMonths: Int,
    annualRate: Double = Constants.ANNUAL_INTEREST_RATE
): Double {
    val principal = purchasePrice - deposit
    if (principal <= 0 || termMonths <= 0) return 0.0
    val r = annualRate / 12.0
    return if (r == 0.0) {
        principal / termMonths
    } else {
        principal * r / (1 - (1 + r).pow(-termMonths.toDouble()))
    }
}

fun validateSaId(id: String): Boolean {
    if (id.length != 13 || !id.all { it.isDigit() }) return false
    var sum = 0
    for (i in 0 until 13) {
        val digit = id[i].digitToInt()
        if (i % 2 == 0) {
            sum += digit
        } else {
            val doubled = digit * 2
            sum += if (doubled > 9) doubled - 9 else doubled
        }
    }
    return sum % 10 == 0
}

fun whatsappUrl(phone: String, title: String): String {
    val digits = phone.filter { it.isDigit() }
    val normalized = if (digits.startsWith("0")) "27${digits.drop(1)}" else digits
    val text = "Hi, I saw your $title on Car Torque SA — is it still available?"
    val encoded = java.net.URLEncoder.encode(text, "UTF-8")
    return "https://wa.me/$normalized?text=$encoded"
}
