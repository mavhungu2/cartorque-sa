import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, type } from "../../theme/tokens";

// Phase 2 builds the full NCA finance application form here.
export default function FinanceScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Finance pre-approval</Text>
      <Text style={styles.body}>
        Coming in the next update — apply from any car&apos;s page meanwhile.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  title: { ...type.h2, color: colors.fg },
  body: { ...type.body, color: colors.muted, marginTop: spacing.sm, textAlign: "center" },
});
