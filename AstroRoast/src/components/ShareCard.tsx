import type { RefObject } from "react";

import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Flame } from "lucide-react-native";
import { COLORS } from "../constants/theme";
import { renderInlineMarkdown } from "../lib/renderInlineMarkdown";
const { width } = Dimensions.get("window");
import { Image } from "expo-image";

type ShareCardProps = {
  sign: string;
  hook: string;
  roast: string;
  advice: string;
  signColor: string;
  date: Date;
  viewRef: RefObject<View> | RefObject<null>;
};

export default function ShareCard({
  sign,
  hook,
  roast,
  signColor,
  date,
  advice,
  viewRef,
}: ShareCardProps) {
  return (
    <View ref={viewRef} style={[styles.card, { backgroundColor: signColor }]}>
      <Flame
        size={380}
        fill="#1a1c1c"
        stroke={signColor}
        opacity={0.3}
        style={styles.flameBackground}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.header}>
          <Text style={styles.appTitle}>DAILY ROAST</Text>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
          <Text style={styles.signTitle}>{sign.toUpperCase()}</Text>
        </View>
        <View style={styles.mainContent}>
          <Text style={styles.hookText}>{hook}</Text>

          <View style={styles.divider} />

          <Text style={styles.mainRoast}>{renderInlineMarkdown(roast)}</Text>
        </View>
        <View style={styles.adviceBox}>
          <Text style={{ color: signColor }}>COSMIC_ADVICE</Text>
          <Text style={styles.adviceText}>{advice}</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          <Text style={styles.dateText}>Made by </Text>
          <Image
            source={require("../../assets/icon.png")}
            style={{ width: 20, height: 20, marginHorizontal: 2 }}
          />
          <Text style={{ fontWeight: "600" }}>Astro Roast </Text>
          <Text style={styles.dateText}>with love</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    aspectRatio: 9 / 16,
    padding: 28,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  flameBackground: {
    position: "absolute",
    right: -60,
    top: 10,
    zIndex: 0,
  },
  header: {
    alignItems: "flex-start",
    // marginBottom: 20,
    zIndex: 1,
  },
  appTitle: {
    color: COLORS.void,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    opacity: 0.9,
  },
  signTitle: {
    color: COLORS.void,
    fontSize: 48,
    fontWeight: "400",
    marginTop: 5,
  },
  dateText: {
    color: COLORS.void,
    fontSize: 12,
    fontWeight: "400",
    // marginTop: 4,
    opacity: 0.7,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 1,
  },
  hookText: {
    color: COLORS.void,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "left",
    fontStyle: "italic",
    lineHeight: 28,
  },
  divider: {
    width: "40%",
    height: 2,
    backgroundColor: COLORS.void,
    marginVertical: 16,
    borderRadius: 1,
  },
  mainRoast: {
    color: COLORS.void,
    fontSize: 14,
    lineHeight: 24,
    textAlign: "left",
    fontWeight: "500",
  },
  adviceBox: {
    padding: 12,
    backgroundColor: COLORS.void,
    width: "100%",
    zIndex: 1,
  },
  adviceTitle: {
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 1.5,
  },
  adviceText: {
    color: COLORS.primary,
    fontSize: 14,
    textAlign: "left",
    fontWeight: "600",
    marginVertical: 8,
  },
});
