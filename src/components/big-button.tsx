import { Pressable, StyleSheet, Text, type PressableProps } from "react-native";
import { colors, layout, type } from "@/constants/theme";

type Props = PressableProps & {
  label: string;
  /** "emergency" is red and must only be used for emergency / incident actions. */
  variant?: "primary" | "emergency";
};

/**
 * Full-width, 64pt-tall button with large text.
 * Every main action in the app should use this so the whole app feels the same.
 */
export function BigButton({ label, variant = "primary", style, ...rest }: Props) {
  const isEmergency = variant === "emergency";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        isEmergency ? styles.emergency : styles.primary,
        pressed && styles.pressed,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...rest}
    >
      <Text
        style={[styles.label, isEmergency ? styles.emergencyLabel : styles.primaryLabel]}
        maxFontSizeMultiplier={1.6}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: layout.buttonHeight,
    width: "100%",
    borderRadius: layout.radius,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  primary: { backgroundColor: colors.primary },
  emergency: { backgroundColor: colors.emergency },
  pressed: { opacity: 0.85 },
  label: { fontSize: type.button, fontWeight: "700", textAlign: "center" },
  primaryLabel: { color: colors.primaryText },
  emergencyLabel: { color: colors.emergencyText },
});
