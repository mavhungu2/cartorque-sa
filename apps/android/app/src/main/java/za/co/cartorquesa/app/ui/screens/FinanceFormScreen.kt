package za.co.cartorquesa.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MenuAnchorType
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import za.co.cartorquesa.app.data.FinanceRequest
import za.co.cartorquesa.app.data.calculateMonthlyInstalment
import za.co.cartorquesa.app.data.formatZar
import za.co.cartorquesa.app.data.validateSaId
import za.co.cartorquesa.app.ui.theme.Accent
import za.co.cartorquesa.app.ui.theme.Border
import za.co.cartorquesa.app.ui.theme.CardColor
import za.co.cartorquesa.app.ui.theme.Danger
import za.co.cartorquesa.app.ui.theme.Ink
import za.co.cartorquesa.app.ui.theme.Muted

private val TERM_OPTIONS = listOf(24, 36, 48, 60, 72, 96)
private val EMPLOYMENT_OPTIONS = listOf(
    "permanent" to "Permanent employed",
    "contract" to "Contract",
    "self_employed" to "Self-employed",
    "pensioner" to "Pensioner",
    "other" to "Other"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FinanceFormScreen(
    prefillListingId: String? = null,
    prefillTitle: String? = null,
    prefillPrice: Double? = null,
    onBack: () -> Unit,
    viewModel: FinanceViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    var vehicleDescription by remember { mutableStateOf(prefillTitle ?: "") }
    var purchasePriceText by remember { mutableStateOf(prefillPrice?.toInt()?.toString() ?: "") }
    var depositText by remember { mutableStateOf("") }
    var selectedTerm by remember { mutableIntStateOf(72) }

    var fullName by remember { mutableStateOf("") }
    var idNumber by remember { mutableStateOf("") }
    var idError by remember { mutableStateOf<String?>(null) }
    var phone by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var hasLicence by remember { mutableStateOf(true) }

    var employmentStatus by remember { mutableStateOf("permanent") }
    var employer by remember { mutableStateOf("") }
    var occupation by remember { mutableStateOf("") }
    var yearsEmployedText by remember { mutableStateOf("") }
    var grossIncomeText by remember { mutableStateOf("") }
    var netIncomeText by remember { mutableStateOf("") }
    var monthlyExpensesText by remember { mutableStateOf("") }
    var creditCommitmentsText by remember { mutableStateOf("") }

    var consentPopia by remember { mutableStateOf(false) }
    var consentCredit by remember { mutableStateOf(false) }
    var consentError by remember { mutableStateOf<String?>(null) }

    val purchasePrice = purchasePriceText.toDoubleOrNull() ?: 0.0
    val deposit = depositText.toDoubleOrNull() ?: 0.0
    val instalment = calculateMonthlyInstalment(purchasePrice, deposit, selectedTerm)

    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(
            title = { Text("Finance Pre-Approval", color = Accent, fontWeight = FontWeight.Bold) },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Accent)
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = Ink)
        )

        when (val state = uiState) {
            is FinanceUiState.Submitting -> {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Accent)
                }
            }

            is FinanceUiState.Success -> {
                Box(Modifier.fillMaxSize().padding(32.dp), contentAlignment = Alignment.Center) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = CardColor),
                        elevation = CardDefaults.cardElevation(4.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text("Application Submitted!", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = Ink)
                            Spacer(Modifier.height(8.dp))
                            Text("Reference: ${state.referenceId}", color = Muted, fontSize = 14.sp)
                            Spacer(Modifier.height(16.dp))
                            Text(
                                "Your finance pre-approval application has been submitted. A credit provider will be in touch.",
                                color = Ink,
                                fontSize = 14.sp
                            )
                            Spacer(Modifier.height(16.dp))
                            Button(
                                onClick = onBack,
                                colors = ButtonDefaults.buttonColors(containerColor = Ink, contentColor = Accent)
                            ) {
                                Text("Back to listings")
                            }
                        }
                    }
                }
            }

            else -> {
                val apiError = state as? FinanceUiState.Error

                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .padding(16.dp)
                ) {
                    SectionHeader("The car")
                    Spacer(Modifier.height(8.dp))

                    if (prefillListingId == null) {
                        FormField(
                            value = vehicleDescription,
                            onValueChange = { vehicleDescription = it },
                            label = "Vehicle description"
                        )
                        Spacer(Modifier.height(8.dp))
                        FormField(
                            value = purchasePriceText,
                            onValueChange = { purchasePriceText = it.filter { c -> c.isDigit() } },
                            label = "Purchase price (R)"
                        )
                        Spacer(Modifier.height(8.dp))
                    } else {
                        Text(vehicleDescription, fontWeight = FontWeight.SemiBold, color = Ink)
                        Text(if (purchasePrice > 0) formatZar(purchasePrice) else "", color = Muted)
                        Spacer(Modifier.height(8.dp))
                    }

                    FormField(
                        value = depositText,
                        onValueChange = { depositText = it.filter { c -> c.isDigit() } },
                        label = "Deposit (R)"
                    )
                    Spacer(Modifier.height(8.dp))

                    TermPicker(selected = selectedTerm, onSelect = { selectedTerm = it })
                    Spacer(Modifier.height(12.dp))

                    if (instalment > 0) {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF9C4)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("Illustrative instalment", fontSize = 13.sp, color = Muted)
                                Text(
                                    "${formatZar(instalment)}/pm",
                                    fontWeight = FontWeight.Bold,
                                    color = Ink
                                )
                            }
                        }
                        Text(
                            "Illustrative only. Rate: 13.5% p.a. Actual rate set by credit provider.",
                            fontSize = 11.sp,
                            color = Muted,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }

                    Spacer(Modifier.height(20.dp))
                    HorizontalDivider(color = Border)
                    Spacer(Modifier.height(16.dp))

                    SectionHeader("About you")
                    Spacer(Modifier.height(8.dp))

                    FormField(value = fullName, onValueChange = { fullName = it }, label = "Full name")
                    Spacer(Modifier.height(8.dp))

                    OutlinedTextField(
                        value = idNumber,
                        onValueChange = {
                            idNumber = it.filter { c -> c.isDigit() }.take(13)
                            idError = null
                        },
                        label = { Text("SA ID number (13 digits)") },
                        isError = idError != null || (apiError?.field == "idNumber"),
                        supportingText = {
                            val errText = idError ?: (if (apiError?.field == "idNumber") apiError.message else null)
                            if (errText != null) Text(errText, color = Danger)
                        },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    Spacer(Modifier.height(8.dp))

                    FormField(value = phone, onValueChange = { phone = it }, label = "Cellphone")
                    Spacer(Modifier.height(8.dp))
                    FormField(value = email, onValueChange = { email = it }, label = "Email address")
                    Spacer(Modifier.height(12.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Has valid driver's licence", modifier = Modifier.weight(1f), color = Ink)
                        Switch(
                            checked = hasLicence,
                            onCheckedChange = { hasLicence = it },
                            colors = SwitchDefaults.colors(checkedThumbColor = Ink, checkedTrackColor = Accent)
                        )
                    }

                    Spacer(Modifier.height(20.dp))
                    HorizontalDivider(color = Border)
                    Spacer(Modifier.height(16.dp))

                    SectionHeader("Employment & affordability")
                    Spacer(Modifier.height(8.dp))

                    EmploymentDropdown(selected = employmentStatus, onSelect = { employmentStatus = it })
                    Spacer(Modifier.height(8.dp))

                    FormField(value = employer, onValueChange = { employer = it }, label = "Employer (optional)")
                    Spacer(Modifier.height(8.dp))
                    FormField(value = occupation, onValueChange = { occupation = it }, label = "Occupation (optional)")
                    Spacer(Modifier.height(8.dp))
                    FormField(
                        value = yearsEmployedText,
                        onValueChange = { yearsEmployedText = it.filter { c -> c.isDigit() } },
                        label = "Years employed (optional)"
                    )
                    Spacer(Modifier.height(8.dp))
                    FormField(
                        value = grossIncomeText,
                        onValueChange = { grossIncomeText = it.filter { c -> c.isDigit() } },
                        label = "Gross monthly income (R)"
                    )
                    Spacer(Modifier.height(8.dp))
                    FormField(
                        value = netIncomeText,
                        onValueChange = { netIncomeText = it.filter { c -> c.isDigit() } },
                        label = "Net monthly income (R)"
                    )
                    Spacer(Modifier.height(8.dp))
                    FormField(
                        value = monthlyExpensesText,
                        onValueChange = { monthlyExpensesText = it.filter { c -> c.isDigit() } },
                        label = "Monthly expenses (R)"
                    )
                    Spacer(Modifier.height(8.dp))
                    FormField(
                        value = creditCommitmentsText,
                        onValueChange = { creditCommitmentsText = it.filter { c -> c.isDigit() } },
                        label = "Existing credit commitments (R)"
                    )

                    Spacer(Modifier.height(20.dp))
                    HorizontalDivider(color = Border)
                    Spacer(Modifier.height(16.dp))

                    Text(
                        "Car Torque SA is not a credit provider and does not make credit decisions. Applications are forwarded to credit providers registered with the National Credit Regulator (NCR). Approval, rates and terms are determined solely by the credit provider. Submitting this form does not guarantee finance.",
                        fontSize = 12.sp,
                        color = Muted,
                        lineHeight = 18.sp
                    )
                    Spacer(Modifier.height(16.dp))

                    ConsentRow(
                        checked = consentPopia,
                        onCheckedChange = { consentPopia = it; consentError = null },
                        label = "I consent to Car Torque SA processing and sharing my personal information with registered credit providers for the purpose of this application (POPIA)."
                    )
                    Spacer(Modifier.height(8.dp))
                    ConsentRow(
                        checked = consentCredit,
                        onCheckedChange = { consentCredit = it; consentError = null },
                        label = "I consent to credit bureau checks being conducted on my behalf."
                    )

                    consentError?.let {
                        Spacer(Modifier.height(4.dp))
                        Text(it, color = Danger, fontSize = 12.sp)
                    }

                    apiError?.let { err ->
                        if (err.field == null || err.field == "consent") {
                            Spacer(Modifier.height(8.dp))
                            Text(err.message, color = Danger, fontSize = 12.sp)
                        }
                        if (err.code == "rate_limited") {
                            Spacer(Modifier.height(8.dp))
                            Text(err.message, color = Danger, fontSize = 12.sp)
                        }
                    }

                    Spacer(Modifier.height(24.dp))

                    Button(
                        onClick = {
                            val idValid = validateSaId(idNumber)
                            if (!idValid) {
                                idError = "Please enter a valid 13-digit SA ID number."
                                return@Button
                            }
                            if (!consentPopia || !consentCredit) {
                                consentError = "Both consent checkboxes are required to proceed."
                                return@Button
                            }
                            viewModel.submit(
                                FinanceRequest(
                                    fullName = fullName,
                                    idNumber = idNumber,
                                    phone = phone,
                                    email = email,
                                    hasDriversLicence = hasLicence,
                                    employmentStatus = employmentStatus,
                                    employer = employer.ifBlank { null },
                                    occupation = occupation.ifBlank { null },
                                    yearsEmployed = yearsEmployedText.toIntOrNull(),
                                    grossMonthlyIncome = grossIncomeText.toDoubleOrNull() ?: 0.0,
                                    netMonthlyIncome = netIncomeText.toDoubleOrNull() ?: 0.0,
                                    monthlyExpenses = monthlyExpensesText.toDoubleOrNull() ?: 0.0,
                                    existingCreditCommitments = creditCommitmentsText.toDoubleOrNull() ?: 0.0,
                                    listingId = prefillListingId,
                                    vehicleDescription = vehicleDescription.ifBlank { null },
                                    purchasePriceZar = purchasePrice.takeIf { it > 0 },
                                    depositZar = deposit,
                                    preferredTermMonths = selectedTerm,
                                    consentPopia = consentPopia,
                                    consentCreditCheck = consentCredit
                                )
                            )
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Ink, contentColor = Accent)
                    ) {
                        Text("Submit application", fontWeight = FontWeight.Bold)
                    }
                    Spacer(Modifier.height(32.dp))
                }
            }
        }
    }
}

@Composable
private fun SectionHeader(text: String) {
    Text(text, fontWeight = FontWeight.Bold, fontSize = 17.sp, color = Ink)
}

@Composable
private fun FormField(value: String, onValueChange: (String) -> Unit, label: String) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        modifier = Modifier.fillMaxWidth(),
        singleLine = true
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun TermPicker(selected: Int, onSelect: (Int) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = it }) {
        OutlinedTextField(
            value = "$selected months",
            onValueChange = {},
            readOnly = true,
            label = { Text("Preferred term") },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            modifier = Modifier
                .menuAnchor(MenuAnchorType.PrimaryNotEditable)
                .fillMaxWidth()
        )
        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            TERM_OPTIONS.forEach { term ->
                DropdownMenuItem(
                    text = { Text("$term months") },
                    onClick = {
                        onSelect(term)
                        expanded = false
                    }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun EmploymentDropdown(selected: String, onSelect: (String) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    val label = EMPLOYMENT_OPTIONS.firstOrNull { it.first == selected }?.second ?: selected
    ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = it }) {
        OutlinedTextField(
            value = label,
            onValueChange = {},
            readOnly = true,
            label = { Text("Employment status") },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            modifier = Modifier
                .menuAnchor(MenuAnchorType.PrimaryNotEditable)
                .fillMaxWidth()
        )
        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            EMPLOYMENT_OPTIONS.forEach { (value, display) ->
                DropdownMenuItem(
                    text = { Text(display) },
                    onClick = {
                        onSelect(value)
                        expanded = false
                    }
                )
            }
        }
    }
}

@Composable
private fun ConsentRow(checked: Boolean, onCheckedChange: (Boolean) -> Unit, label: String) {
    Row(
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(checkedThumbColor = Ink, checkedTrackColor = Accent)
        )
        Text(label, fontSize = 12.sp, color = Muted, lineHeight = 18.sp, modifier = Modifier.weight(1f))
    }
}
