package za.co.cartorquesa.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import za.co.cartorquesa.app.data.FilterState
import za.co.cartorquesa.app.data.ListingFacets
import za.co.cartorquesa.app.ui.theme.Accent
import za.co.cartorquesa.app.ui.theme.Ink
import za.co.cartorquesa.app.ui.theme.Muted

private val MILEAGE_BRACKETS = listOf(10_000, 25_000, 50_000, 75_000, 100_000, 150_000, 200_000)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FilterSheet(
    facets: ListingFacets,
    currentFilter: FilterState,
    onApply: (FilterState) -> Unit,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    var selectedMake by remember { mutableStateOf(currentFilter.make) }
    var selectedModel by remember { mutableStateOf(currentFilter.model) }
    var selectedYearFrom by remember { mutableStateOf(currentFilter.yearFrom) }
    var selectedMaxMileage by remember { mutableStateOf(currentFilter.maxMileage) }
    var minPriceText by remember { mutableStateOf(currentFilter.minPrice?.toInt()?.toString() ?: "") }
    var maxPriceText by remember { mutableStateOf(currentFilter.maxPrice?.toInt()?.toString() ?: "") }
    var selectedProvince by remember { mutableStateOf(currentFilter.province) }
    var verifiedOnly by remember { mutableStateOf(currentFilter.verifiedOnly) }

    val availableModels = if (selectedMake != null) {
        facets.modelsByMake[selectedMake] ?: emptyList()
    } else {
        facets.modelsByMake.values.flatten().distinct().sorted()
    }

    val applicableMileageBrackets = MILEAGE_BRACKETS.filter { it <= facets.maxMileage + 1 }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            Text("Filter Listings", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Ink)
            Spacer(Modifier.height(16.dp))

            FilterDropdown(
                label = "Make",
                options = facets.makes,
                selected = selectedMake,
                onSelect = {
                    selectedMake = it
                    selectedModel = null
                }
            )
            Spacer(Modifier.height(12.dp))

            FilterDropdown(
                label = "Model",
                options = availableModels,
                selected = selectedModel,
                onSelect = { selectedModel = it }
            )
            Spacer(Modifier.height(12.dp))

            FilterDropdown(
                label = "Year from",
                options = facets.years.map { it.toString() },
                selected = selectedYearFrom?.toString(),
                onSelect = { selectedYearFrom = it?.toIntOrNull() }
            )
            Spacer(Modifier.height(12.dp))

            FilterDropdown(
                label = "Max mileage",
                options = applicableMileageBrackets.map { "${it / 1000}k km" },
                selected = selectedMaxMileage?.let { m ->
                    applicableMileageBrackets.firstOrNull { it == m }?.let { "${it / 1000}k km" }
                },
                onSelect = { label ->
                    selectedMaxMileage = label?.let {
                        applicableMileageBrackets.getOrNull(
                            applicableMileageBrackets.indexOfFirst { b -> "${b / 1000}k km" == label }
                        )
                    }
                }
            )
            Spacer(Modifier.height(12.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = minPriceText,
                    onValueChange = { minPriceText = it.filter { c -> c.isDigit() } },
                    label = { Text("Min price (R)") },
                    modifier = Modifier.weight(1f),
                    singleLine = true
                )
                OutlinedTextField(
                    value = maxPriceText,
                    onValueChange = { maxPriceText = it.filter { c -> c.isDigit() } },
                    label = { Text("Max price (R)") },
                    modifier = Modifier.weight(1f),
                    singleLine = true
                )
            }
            Spacer(Modifier.height(12.dp))

            FilterDropdown(
                label = "Province",
                options = facets.provinces,
                selected = selectedProvince,
                onSelect = { selectedProvince = it }
            )
            Spacer(Modifier.height(12.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Verified only", modifier = Modifier.weight(1f), color = Ink)
                Switch(
                    checked = verifiedOnly,
                    onCheckedChange = { verifiedOnly = it },
                    colors = SwitchDefaults.colors(checkedThumbColor = Ink, checkedTrackColor = Accent)
                )
            }

            Spacer(Modifier.height(24.dp))
            HorizontalDivider()
            Spacer(Modifier.height(16.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                OutlinedButton(
                    onClick = {
                        onApply(FilterState())
                        onDismiss()
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Clear")
                }
                Button(
                    onClick = {
                        onApply(
                            FilterState(
                                make = selectedMake,
                                model = selectedModel,
                                yearFrom = selectedYearFrom,
                                maxMileage = selectedMaxMileage,
                                minPrice = minPriceText.toDoubleOrNull(),
                                maxPrice = maxPriceText.toDoubleOrNull(),
                                province = selectedProvince,
                                verifiedOnly = verifiedOnly
                            )
                        )
                        onDismiss()
                    },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = Ink, contentColor = Accent)
                ) {
                    Text("Apply", fontWeight = FontWeight.Bold)
                }
            }
            Spacer(Modifier.height(32.dp))
        }
    }
}

@Composable
private fun FilterDropdown(
    label: String,
    options: List<String>,
    selected: String?,
    onSelect: (String?) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Box {
        OutlinedTextField(
            value = selected ?: "",
            onValueChange = {},
            readOnly = true,
            label = { Text(label) },
            trailingIcon = {
                Icon(Icons.Default.ArrowDropDown, contentDescription = null)
            },
            modifier = Modifier
                .fillMaxWidth()
                .clickable { expanded = true },
            enabled = false
        )
        Box(
            modifier = Modifier
                .matchParentSize()
                .clickable { expanded = true }
        )
        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            DropdownMenuItem(
                text = { Text("Any", color = Muted) },
                onClick = {
                    onSelect(null)
                    expanded = false
                }
            )
            options.forEach { option ->
                DropdownMenuItem(
                    text = { Text(option) },
                    onClick = {
                        onSelect(option)
                        expanded = false
                    }
                )
            }
        }
    }
}
