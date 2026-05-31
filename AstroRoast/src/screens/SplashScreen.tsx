import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/theme";

export const SplashScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={["#0e0e0e", "#161616", "#24160f"]}
      style={styles.container}
    >
      <View style={styles.glow} />
      <View style={styles.content}>
        <Text style={styles.kicker}>ASTRO ROAST</Text>
        <Text style={styles.title}>Reading your stars</Text>
        <Text style={styles.subtitle}>Checking the cosmic alignment...</Text>
        <ActivityIndicator color={COLORS.primary} style={styles.spinner} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  glow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(140, 79, 43, 0.25)",
    top: 90,
    right: -90,
  },
  content: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 28,
    borderRadius: 28,
    backgroundColor: "rgba(255, 248, 241, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 248, 241, 0.12)",
  },
  kicker: {
    color: "#b99e8d",
    fontSize: 12,
    letterSpacing: 4,
    fontWeight: "700",
    marginBottom: 14,
  },
  title: {
    color: COLORS.primary,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 12,
    color: "#d7c6ba",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  spinner: {
    marginTop: 28,
  },
});
