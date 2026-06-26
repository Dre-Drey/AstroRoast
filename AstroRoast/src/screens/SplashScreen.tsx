import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

export const SplashScreen: React.FC = () => {
  return (
    <View
      style={styles.center}
      accessible
      accessibilityLabel="Loading daily roast"
    >
      <ActivityIndicator color={COLORS.primary} />
      <Text style={[styles.labelMd, { marginTop: 20 }]}>
        CHECKING COSMIC ALIGNMENT...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: COLORS.void,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  labelMd: {
    color: COLORS.primary,
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 8,
  },
});
