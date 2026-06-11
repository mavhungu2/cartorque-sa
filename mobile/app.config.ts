import type { ExpoConfig } from "expo/config";

// API base: preview/production builds bake this in; local dev overrides via
// EXPO_PUBLIC_API_BASE_URL (e.g. http://<mac-ip>:3000/api/v1 for Expo Go on LAN).
// Flip to https://cartorquesa.co.za/api/v1 via EAS Update after domain cutover.
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  "https://cartorque-sa--cartorque-sa.us-east4.hosted.app/api/v1";

const config: ExpoConfig = {
  name: "Car Torque SA",
  slug: "cartorque-sa",
  version: "0.9.0",
  scheme: "cartorquesa",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  ios: {
    bundleIdentifier: "za.co.cartorquesa.app",
    supportsTablet: false,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "za.co.cartorquesa.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFD400",
    },
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#FFD400",
      },
    ],
    "expo-updates",
  ],
  extra: {
    apiBaseUrl: API_BASE_URL,
    // eas.projectId is added automatically by `eas init`
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  runtimeVersion: {
    policy: "fingerprint",
  },
};

export default config;
