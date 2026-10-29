/**
 * Design tokens for Pinelands Watch.
 *
 * Rules from the brief:
 *  - body text at least 18pt, buttons at least 64pt tall
 *  - high contrast, calm colours
 *  - RED is reserved for emergency / incident actions only
 */
export const colors = {
  background: "#F6F8F5", // soft off-white
  surface: "#FFFFFF",
  text: "#14281D", // very dark green, high contrast on light background
  textMuted: "#4A5D52",
  primary: "#1F6F5F", // calm pine green for ordinary actions
  primaryText: "#FFFFFF",
  emergency: "#C62828", // ONLY for emergency / incident buttons
  emergencyText: "#FFFFFF",
  border: "#D5DDD8",
  success: "#2E7D32",
};

export const type = {
  body: 18,
  bodyLarge: 22,
  title: 32,
  button: 22,
};

export const layout = {
  buttonHeight: 64,
  screenPadding: 20,
  radius: 16,
};
