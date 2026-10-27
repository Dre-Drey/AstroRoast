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
  const combinedLength = hook.length + roast.length + advice.length;
  const isDenseContent = combinedLength > 520;
  const isVeryDenseContent = combinedLength > 760;

  const hookNumberOfLines = isVeryDenseContent ? 2 : isDenseContent ? 3 : 4;
  const roastNumberOfLines = isVeryDenseContent ? 7 : isDenseContent ? 9 : 11;
  const adviceNumberOfLines = isVeryDenseContent ? 2 : isDenseContent ? 3 : 4;

  return (
    <View
      ref={viewRef}
      style={[styles.card, { backgroundColor: signColor }]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Flame
        size={400}
        fill="#1a1c1c"
        stroke={signColor}
        opacity={0.3}
        style={styles.flameBackground}
      />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>DAILY ROAST</Text>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </View>
        <View style={styles.mainContent}>
          <Text
            style={styles.signTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {sign.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.hookText,
              isDenseContent && styles.hookTextDense,
              isVeryDenseContent && styles.hookTextVeryDense,
            ]}
            numberOfLines={hookNumberOfLines}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {hook}
          </Text>
          <View
            style={[
              styles.divider,
              isDenseContent && styles.dividerDense,
              isVeryDenseContent && styles.dividerVeryDense,
            ]}
          />
          <Text
            style={[
              styles.mainRoast,
              isDenseContent && styles.mainRoastDense,
              isVeryDenseContent && styles.mainRoastVeryDense,
            ]}
            numberOfLines={roastNumberOfLines}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.72}
          >
            {renderInlineMarkdown(roast)}
          </Text>
        </View>
        <View
          style={[
            styles.adviceBox,
            isVeryDenseContent && styles.adviceBoxVeryDense,
          ]}
        >
          <Text style={{ color: signColor }}>COSMIC_ADVICE</Text>
          <Text
            style={[
              styles.adviceText,
              isDenseContent && styles.adviceTextDense,
              isVeryDenseContent && styles.adviceTextVeryDense,
            ]}
            numberOfLines={adviceNumberOfLines}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.82}
          >
            {advice}
          </Text>
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
            source={require("../../assets/icons/icon.png")}
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
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 18,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  flameBackground: {
    position: "absolute",
    right: -60,
    top: 10,
    zIndex: 0,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
  },
  header: {
    alignItems: "flex-start",
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
    marginVertical: 5,
  },
  dateText: {
    color: COLORS.void,
    fontSize: 12,
    fontWeight: "400",
    opacity: 0.7,
  },
  mainContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    zIndex: 1,
    marginTop: 8,
    marginBottom: 8,
    flexShrink: 1,
  },
  hookText: {
    color: COLORS.void,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "left",
    fontStyle: "italic",
    lineHeight: 20,
  },
  hookTextDense: {
    fontSize: 15,
    lineHeight: 18,
  },
  hookTextVeryDense: {
    fontSize: 14,
    lineHeight: 17,
  },
  divider: {
    width: "40%",
    height: 2,
    backgroundColor: COLORS.void,
    marginVertical: 16,
    borderRadius: 1,
  },
  dividerDense: {
    marginVertical: 12,
  },
  dividerVeryDense: {
    marginVertical: 10,
  },
  mainRoast: {
    color: COLORS.void,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "left",
    fontWeight: "500",
  },
  mainRoastDense: {
    fontSize: 13,
    lineHeight: 19,
  },
  mainRoastVeryDense: {
    fontSize: 12,
    lineHeight: 17,
  },
  adviceBox: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.void,
    width: "100%",
    zIndex: 1,
  },
  adviceBoxVeryDense: {
    paddingVertical: 8,
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
  adviceTextDense: {
    fontSize: 13,
    marginVertical: 6,
  },
  adviceTextVeryDense: {
    fontSize: 12,
    lineHeight: 16,
    marginVertical: 4,
  },
});
