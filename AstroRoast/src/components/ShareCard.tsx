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
  const densityScore =
    hook.length * 1.1 + roast.length * 1.6 + advice.length * 1.2;
  const isCompactContent = densityScore > 520;
  const isUltraCompactContent = densityScore > 760;

  return (
    <View
      ref={viewRef}
      style={[
        styles.card,
        isCompactContent && styles.cardCompact,
        isUltraCompactContent && styles.cardUltraCompact,
        { backgroundColor: signColor },
      ]}
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
      <View
        style={[
          styles.contentContainer,
          isCompactContent && styles.contentContainerCompact,
        ]}
      >
        <View style={[styles.header, isCompactContent && styles.headerCompact]}>
          <Text
            style={[
              styles.appTitle,
              isCompactContent && styles.appTitleCompact,
              isUltraCompactContent && styles.appTitleUltraCompact,
            ]}
          >
            DAILY ROAST
          </Text>
          <Text
            style={[
              styles.dateText,
              isCompactContent && styles.dateTextCompact,
              isUltraCompactContent && styles.dateTextUltraCompact,
            ]}
          >
            {date.toLocaleDateString()}
          </Text>
        </View>
        <View
          style={[
            styles.mainContent,
            isCompactContent && styles.mainContentCompact,
            isUltraCompactContent && styles.mainContentUltraCompact,
          ]}
        >
          <Text
            style={[
              styles.signTitle,
              isCompactContent && styles.signTitleCompact,
              isUltraCompactContent && styles.signTitleUltraCompact,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {sign.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.hookText,
              isCompactContent && styles.hookTextCompact,
              isUltraCompactContent && styles.hookTextUltraCompact,
            ]}
          >
            {hook}
          </Text>
          <View
            style={[
              styles.divider,
              isCompactContent && styles.dividerCompact,
              isUltraCompactContent && styles.dividerUltraCompact,
            ]}
          />
          <Text
            style={[
              styles.mainRoast,
              isCompactContent && styles.mainRoastCompact,
              isUltraCompactContent && styles.mainRoastUltraCompact,
            ]}
          >
            {renderInlineMarkdown(roast)}
          </Text>
        </View>
        <View
          style={[
            styles.adviceBox,
            isCompactContent && styles.adviceBoxCompact,
            isUltraCompactContent && styles.adviceBoxUltraCompact,
          ]}
        >
          <Text
            style={[
              styles.adviceLabel,
              isCompactContent && styles.adviceLabelCompact,
              isUltraCompactContent && styles.adviceLabelUltraCompact,
              { color: signColor },
            ]}
          >
            COSMIC_ADVICE
          </Text>
          <Text
            style={[
              styles.adviceText,
              isCompactContent && styles.adviceTextCompact,
              isUltraCompactContent && styles.adviceTextUltraCompact,
            ]}
          >
            {advice}
          </Text>
        </View>
        <View style={[styles.footer, isCompactContent && styles.footerCompact]}>
          <Text
            style={[
              styles.dateText,
              isCompactContent && styles.dateTextCompact,
              isUltraCompactContent && styles.dateTextUltraCompact,
            ]}
          >
            Made by
          </Text>
          <Image
            source={require("../../assets/icons/icon.png")}
            style={[
              styles.footerIcon,
              isCompactContent && styles.footerIconCompact,
              isUltraCompactContent && styles.footerIconUltraCompact,
            ]}
          />
          <Text
            style={[
              styles.footerBrand,
              isCompactContent && styles.footerBrandCompact,
              isUltraCompactContent && styles.footerBrandUltraCompact,
            ]}
          >
            Astro Roast
          </Text>
          <Text
            style={[
              styles.dateText,
              isCompactContent && styles.dateTextCompact,
              isUltraCompactContent && styles.dateTextUltraCompact,
            ]}
          >
            with love
          </Text>
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
  cardCompact: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 14,
  },
  cardUltraCompact: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
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
  contentContainerCompact: {
    gap: 6,
  },
  header: {
    alignItems: "flex-start",
    zIndex: 1,
  },
  headerCompact: {
    marginBottom: 4,
  },
  appTitle: {
    color: COLORS.void,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    opacity: 0.9,
  },
  appTitleCompact: {
    fontSize: 12,
    letterSpacing: 1.4,
  },
  appTitleUltraCompact: {
    fontSize: 11,
    letterSpacing: 1.2,
  },
  signTitle: {
    color: COLORS.void,
    fontSize: 48,
    fontWeight: "400",
    marginVertical: 5,
  },
  signTitleCompact: {
    fontSize: 42,
    marginVertical: 3,
  },
  signTitleUltraCompact: {
    fontSize: 36,
    marginVertical: 2,
  },
  dateText: {
    color: COLORS.void,
    fontSize: 12,
    fontWeight: "400",
    opacity: 0.7,
  },
  dateTextCompact: {
    fontSize: 11,
  },
  dateTextUltraCompact: {
    fontSize: 10,
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
  mainContentCompact: {
    marginTop: 4,
    marginBottom: 4,
  },
  mainContentUltraCompact: {
    marginTop: 2,
    marginBottom: 2,
  },
  hookText: {
    color: COLORS.void,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "left",
    fontStyle: "italic",
    lineHeight: 20,
  },
  hookTextCompact: {
    fontSize: 15,
    lineHeight: 18,
  },
  hookTextUltraCompact: {
    fontSize: 14,
    lineHeight: 16,
  },
  divider: {
    width: "40%",
    height: 2,
    backgroundColor: COLORS.void,
    marginVertical: 16,
    borderRadius: 1,
  },
  dividerCompact: {
    marginVertical: 12,
  },
  dividerUltraCompact: {
    marginVertical: 8,
  },
  mainRoast: {
    color: COLORS.void,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "left",
    fontWeight: "500",
  },
  mainRoastCompact: {
    fontSize: 13,
    lineHeight: 19,
  },
  mainRoastUltraCompact: {
    fontSize: 12,
    lineHeight: 16,
  },
  adviceBox: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.void,
    width: "100%",
    zIndex: 1,
  },
  adviceBoxCompact: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  adviceBoxUltraCompact: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  adviceLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  adviceLabelCompact: {
    fontSize: 9,
  },
  adviceLabelUltraCompact: {
    fontSize: 8,
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
  adviceTextCompact: {
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 6,
  },
  adviceTextUltraCompact: {
    fontSize: 12,
    lineHeight: 15,
    marginVertical: 4,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 2,
  },
  footerCompact: {
    marginTop: 8,
  },
  footerIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
  },
  footerIconCompact: {
    width: 18,
    height: 18,
  },
  footerIconUltraCompact: {
    width: 16,
    height: 16,
  },
  footerBrand: {
    fontWeight: "600",
  },
  footerBrandCompact: {
    fontSize: 12,
  },
  footerBrandUltraCompact: {
    fontSize: 11,
  },
});
