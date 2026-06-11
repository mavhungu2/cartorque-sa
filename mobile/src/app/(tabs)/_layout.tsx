import { Tabs } from "expo-router";
import { Text, type ColorValue } from "react-native";
import { colors } from "../../theme/tokens";

function TabIcon({ glyph, color }: { glyph: string; color: ColorValue }) {
  return <Text style={{ fontSize: 20, color }}>{glyph}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.ink },
        headerTintColor: colors.accent,
        headerTitleStyle: { fontWeight: "800" },
        tabBarStyle: { backgroundColor: colors.ink, borderTopColor: colors.ink },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: "#9A9AA3",
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Browse",
          headerTitle: "Car Torque SA",
          tabBarIcon: ({ color }) => <TabIcon glyph="🚗" color={color} />,
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: "Finance",
          tabBarIcon: ({ color }) => <TabIcon glyph="💳" color={color} />,
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: "Videos",
          tabBarIcon: ({ color }) => <TabIcon glyph="▶️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => <TabIcon glyph="⋯" color={color} />,
        }}
      />
    </Tabs>
  );
}
