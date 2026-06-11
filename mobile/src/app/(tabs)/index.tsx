import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { api } from "../../lib/api";
import ListingCard from "../../components/ListingCard";
import { colors, spacing, type } from "../../theme/tokens";

export default function BrowseScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["listings"],
    queryFn: api.listings,
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
        <Text style={styles.errorTitle}>Couldn&apos;t load cars</Text>
        <Text style={styles.errorBody} onPress={() => refetch()}>
          Check your connection and tap to retry.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data.listings}
      keyExtractor={(l) => l.id}
      numColumns={2}
      columnWrapperStyle={{ gap: spacing.md }}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.ink} />
      }
      ListHeaderComponent={
        <Text style={styles.count}>
          {data.total} car{data.total === 1 ? "" : "s"} for sale
        </Text>
      }
      renderItem={({ item }) => <ListingCard listing={item} />}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  count: { ...type.small, color: colors.muted, marginBottom: spacing.md, fontWeight: "600" },
  errorTitle: { ...type.h3, color: colors.fg },
  errorBody: { ...type.body, color: colors.muted, marginTop: spacing.sm, textAlign: "center" },
});
