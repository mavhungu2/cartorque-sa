import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { colors, radius, spacing, type } from "../../theme/tokens";

const WEB = "https://cartorque-sa--cartorque-sa.us-east4.hosted.app";

const LINKS = [
  { label: "Sell my car", url: `${WEB}/sell` },
  { label: "Watch on YouTube", url: "https://www.youtube.com/@CarTorqueSA" },
  { label: "Instagram", url: "https://www.instagram.com/car_torque_za/" },
  { label: "Facebook", url: "https://www.facebook.com/profile.php?id=100076080243370" },
  { label: "Contact us", url: "mailto:hello@cartorque.co.za" },
  { label: "Privacy policy", url: `${WEB}/privacy` },
];

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      {LINKS.map((l) => (
        <Pressable
          key={l.label}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
          onPress={() => Linking.openURL(l.url)}
        >
          <Text style={styles.rowText}>{l.label}</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>
      ))}
      <Text style={styles.version}>
        Car Torque SA v{Constants.expoConfig?.version ?? "dev"} — honest cars from SA.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.sm },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  rowText: { ...type.h3, color: colors.fg },
  arrow: { color: colors.accent, fontSize: 18, fontWeight: "900" },
  version: { ...type.small, color: colors.muted, textAlign: "center", marginTop: spacing.xl },
});
