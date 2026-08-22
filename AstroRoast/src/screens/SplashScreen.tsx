import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";
import { sharedLayout, sharedTypography } from "../styles/common";

export const SplashScreen: React.FC = () => {
  return (
    <View
      style={sharedLayout.center}
      accessible
      accessibilityLabel="Loading daily roast"
    >
      <ActivityIndicator color={COLORS.primary} />
      <Text style={[sharedTypography.labelMd, { marginTop: 20 }]}>
        CHECKING COSMIC ALIGNMENT...
      </Text>
    </View>
  );
};
