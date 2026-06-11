// Brand tokens — mirrors the web's globals.css palette.
export const colors = {
  accent: "#FFD400",
  accent2: "#FFB700",
  ink: "#0A0A0B",
  black: "#000000",
  bg: "#FAFAFA",
  card: "#FFFFFF",
  fg: "#0A0A0B",
  muted: "#52525B",
  border: "#E4E4E7",
  danger: "#E10600",
  white: "#FFFFFF",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
} as const;

export const type = {
  h1: { fontSize: 28, fontWeight: "800" as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.3 },
  h3: { fontSize: 17, fontWeight: "700" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  small: { fontSize: 13, fontWeight: "400" as const },
  chip: { fontSize: 10, fontWeight: "800" as const, letterSpacing: 1.2 },
  price: { fontSize: 17, fontWeight: "900" as const },
} as const;
