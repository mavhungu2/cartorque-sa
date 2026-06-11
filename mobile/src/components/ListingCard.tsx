import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import type { Listing } from "../lib/contracts/listing";
import { formatMileage, formatPrice } from "../lib/format";
import { colors, radius, spacing, type } from "../theme/tokens";

export default function ListingCard({ listing }: { listing: Listing }) {
  const isNew = listing.condition === "new";
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
      onPress={() => router.push(`/listing/${listing.id}`)}
    >
      <View style={styles.photoWrap}>
        {listing.photos[0] ? (
          <Image
            source={{ uri: listing.photos[0] }}
            style={styles.photo}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View style={[styles.photo, styles.noPhoto]}>
            <Text style={{ color: colors.muted }}>No photo</Text>
          </View>
        )}
        <View style={styles.chips}>
          {isNew && (
            <View style={[styles.chip, { backgroundColor: colors.ink }]}>
              <Text style={[styles.chipText, { color: colors.accent }]}>NEW</Text>
            </View>
          )}
          {listing.verified !== "unverified" && (
            <View style={[styles.chip, { backgroundColor: colors.accent }]}>
              <Text style={[styles.chipText, { color: colors.ink }]}>
                {listing.verified === "fully_verified" ? "✓ REVIEWED" : "VIN VERIFIED"}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>
        <Text style={styles.price}>{formatPrice(listing.priceZar)}</Text>
        {listing.monthlyZar ? (
          <Text style={styles.monthly}>± {formatPrice(listing.monthlyZar)}/pm</Text>
        ) : null}
        <Text style={styles.meta} numberOfLines={1}>
          {listing.year} • {formatMileage(listing)} • {listing.location}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  photoWrap: { aspectRatio: 4 / 3, backgroundColor: "#EEE" },
  photo: { width: "100%", height: "100%" },
  noPhoto: { alignItems: "center", justifyContent: "center" },
  chips: { position: "absolute", top: spacing.sm, left: spacing.sm, flexDirection: "row", gap: 4 },
  chip: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  chipText: { ...type.chip },
  body: { padding: spacing.md, gap: 2 },
  title: { ...type.h3, color: colors.fg, minHeight: 40 },
  price: { ...type.price, color: colors.ink },
  monthly: { ...type.small, color: colors.muted, fontWeight: "600" },
  meta: { ...type.small, color: colors.muted, marginTop: 2 },
});
