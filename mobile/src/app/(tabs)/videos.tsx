import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { api } from "../../lib/api";
import { colors, radius, spacing, type } from "../../theme/tokens";

export default function VideosScreen() {
  const { data, isLoading } = useQuery({ queryKey: ["videos"], queryFn: api.videos });

  if (isLoading || !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.ink} />
      </View>
    );
  }

  return (
    <FlatList
      data={data.videos}
      keyExtractor={(v) => v.id}
      contentContainerStyle={{ padding: spacing.lg }}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
          onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${item.id}`)}
        >
          <Image
            source={{ uri: `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg` }}
            style={styles.thumb}
            contentFit="cover"
          />
          <View style={styles.cardBody}>
            <Text style={styles.chip}>{item.category.toUpperCase()}</Text>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  thumb: { width: "100%", aspectRatio: 16 / 9 },
  cardBody: { padding: spacing.md, gap: 4 },
  chip: { ...type.chip, color: colors.ink, backgroundColor: colors.accent, alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 3, borderRadius: radius.sm, overflow: "hidden" },
  title: { ...type.h3, color: colors.fg },
  desc: { ...type.small, color: colors.muted },
});
