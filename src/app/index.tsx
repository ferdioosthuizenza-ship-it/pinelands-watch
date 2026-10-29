import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { BigButton } from "@/components/big-button";
import { colors, layout, type } from "@/constants/theme";

/**
 * Milestone 1: "Hello Pinelands".
 * The only job of this screen is to prove that a build published from the
 * cloud opens on Ferdi's iPhone in Expo Go and that a big button responds to a tap.
 */
export default function Index() {
  const [taps, setTaps] = useState(0);

  const appVersion = Constants.expoConfig?.version ?? "unknown";
  const updateInfo = Updates.isEmbeddedLaunch
    ? "Running the built-in copy (no update loaded yet)"
    : `Update loaded: ${Updates.updateId?.slice(0, 8) ?? "yes"}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} maxFontSizeMultiplier={1.4}>
        Hello Pinelands 👋
      </Text>
      <Text style={styles.body}>
        This is the very first test version of the neighbourhood watch app. If
        you can read this on your phone, the test path from the cloud to your
        iPhone works.
      </Text>

      <View style={styles.spacer} />

      <BigButton
        label={taps === 0 ? "Tap me to test" : `It works! Tapped ${taps} time${taps === 1 ? "" : "s"}`}
        onPress={() => setTaps((n) => n + 1)}
      />

      <View style={styles.spacer} />

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Version</Text>
        <Text style={styles.infoValue}>{appVersion} (demo)</Text>
        <Text style={styles.infoLabel}>Build status</Text>
        <Text style={styles.infoValue}>{updateInfo}</Text>
        <Text style={styles.infoLabel}>Update channel</Text>
        <Text style={styles.infoValue}>{Updates.channel || "none (local dev server)"}</Text>
      </View>

      <Text style={styles.footnote}>
        Nothing is tracked or shared yet. Location, map and alerts come in later
        test versions.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: layout.screenPadding,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: type.title,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
  },
  body: {
    fontSize: type.bodyLarge,
    lineHeight: 30,
    color: colors.text,
  },
  spacer: { height: 28 },
  infoCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: layout.radius,
    padding: 16,
    gap: 4,
  },
  infoLabel: {
    fontSize: type.body,
    color: colors.textMuted,
    marginTop: 8,
  },
  infoValue: {
    fontSize: type.body,
    fontWeight: "600",
    color: colors.text,
  },
  footnote: {
    marginTop: 28,
    fontSize: type.body,
    lineHeight: 26,
    color: colors.textMuted,
  },
});
