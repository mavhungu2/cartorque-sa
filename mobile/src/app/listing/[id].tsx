import { useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { api } from "../../lib/api";
import { formatMileage, formatPrice } from "../../lib/format";
import { colors, radius, spacing, type } from "../../theme/tokens";

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => api.listing(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.ink} />
      </View>
    );
  }
  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text style={type.h3}>Couldn&apos;t load this listing</Text>
        <Text style={[type.body, { color: colors.muted, marginTop: 8 }]} onPress={() => refetch()}>
          Tap to retry.
        </Text>
      </View>
    );
  }

  const l = data.listing;
  const waDigits = l.ownerWhatsapp?.replace(/\D/g, "");
  const waText = encodeURIComponent(
    `Hi, I saw your ${l.title} on Car Torque SA — is it still available?`,
  );

  const specs: Array<[string, string]> = [
    ["Condition", l.condition === "new" ? "New" : "Used"],
    ["Year", String(l.year)],
    ["Mileage", formatMileage(l)],
    ["Transmission", l.transmission],
    ["Fuel", l.fuelType],
    ...(l.bodyType ? ([["Body", l.bodyType]] as Array<[string, string]>) : []),
    ...(l.color ? ([["Colour", l.color]] as Array<[string, string]>) : []),
    ["Location", `${l.location}, ${l.province}`],
  ];

  return (
    <>
      <Stack.Screen options={{ title: l.make }} />
      <ScrollView contentContainerStyle={styles.container}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {l.photos.map((p) => (
            <Image key={p} source={{ uri: p }} style={styles.photo} contentFit="cover" />
          ))}
        </ScrollView>

        <View style={styles.body}>
          <Text style={styles.title}>{l.title}</Text>
          <Text style={styles.price}>{formatPrice(l.priceZar)}</Text>
          {l.monthlyZar ? (
            <Text style={styles.monthly}>± {formatPrice(l.monthlyZar)} per month</Text>
          ) : null}

          <View style={styles.ctaRow}>
            {waDigits ? (
              <Cta
                label="WhatsApp seller"
                primary
                onPress={() => Linking.openURL(`https://wa.me/${waDigits}?text=${waText}`)}
              />
            ) : null}
            {l.ownerPhone ? (
              <Cta label="Call" onPress={() => Linking.openURL(`tel:${l.ownerPhone}`)} />
            ) : null}
            {!waDigits && !l.ownerPhone && l.ownerEmail ? (
              <Cta label="Email seller" onPress={() => Linking.openURL(`mailto:${l.ownerEmail}`)} />
            ) : null}
          </View>

          <View style={styles.specs}>
            {specs.map(([k, v]) => (
              <View key={k} style={styles.specRow}>
                <Text style={styles.specKey}>{k}</Text>
                <Text style={styles.specVal}>{v}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>About this car</Text>
          <Text style={styles.description}>{l.description}</Text>
        </View>
      </ScrollView>
    </>
  );
}

function Cta({
  label,
  primary,
  onPress,
}: {
  label: string;
  primary?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cta,
        primary ? styles.ctaPrimary : styles.ctaOutline,
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={primary ? styles.ctaPrimaryText : styles.ctaOutlineText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  photo: { width: 390, aspectRatio: 16 / 10 },
  body: { padding: spacing.lg, gap: spacing.sm },
  title: { ...type.h1, color: colors.fg },
  price: { fontSize: 26, fontWeight: "900", color: colors.ink },
  monthly: { ...type.body, color: colors.muted, fontWeight: "600" },
  ctaRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  cta: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: "center",
  },
  ctaPrimary: { backgroundColor: colors.ink },
  ctaPrimaryText: { color: colors.accent, fontWeight: "800" },
  ctaOutline: { borderWidth: 1.5, borderColor: colors.ink },
  ctaOutlineText: { color: colors.ink, fontWeight: "800" },
  specs: {
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  specRow: { flexDirection: "row", justifyContent: "space-between" },
  specKey: { ...type.small, color: colors.muted, textTransform: "uppercase", fontWeight: "700" },
  specVal: { ...type.body, color: colors.fg, textTransform: "capitalize" },
  sectionTitle: { ...type.h2, color: colors.fg, marginTop: spacing.lg },
  description: { ...type.body, color: colors.fg, lineHeight: 22 },
});
