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
  const isExtremeCompactContent = densityScore > 980;

  return (
    <View
      ref={viewRef}
      style={[
        styles.card,
        isCompactContent && styles.cardCompact,
        isUltraCompactContent && styles.cardUltraCompact,
        isExtremeCompactContent && styles.cardExtremeCompact,
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
              isExtremeCompactContent && styles.appTitleExtremeCompact,
            ]}
          >
            DAILY ROAST
          </Text>
          <Text
            style={[
              styles.dateText,
              isCompactContent && styles.dateTextCompact,
              isUltraCompactContent && styles.dateTextUltraCompact,
              isExtremeCompactContent && styles.dateTextExtremeCompact,
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
            isExtremeCompactContent && styles.mainContentExtremeCompact,
          ]}
        >
          <Text
            style={[
              styles.signTitle,
              isCompactContent && styles.signTitleCompact,
              isUltraCompactContent && styles.signTitleUltraCompact,
              isExtremeCompactContent && styles.signTitleExtremeCompact,
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
              isExtremeCompactContent && styles.hookTextExtremeCompact,
            ]}
          >
            {hook}
          </Text>
          <View
            style={[
              styles.divider,
              isCompactContent && styles.dividerCompact,
              isUltraCompactContent && styles.dividerUltraCompact,
              isExtremeCompactContent && styles.dividerExtremeCompact,
            ]}
          />
          <Text
            style={[
              styles.mainRoast,
              isCompactContent && styles.mainRoastCompact,
              isUltraCompactContent && styles.mainRoastUltraCompact,
              isExtremeCompactContent && styles.mainRoastExtremeCompact,
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
            isExtremeCompactContent && styles.adviceBoxExtremeCompact,
          ]}
        >
          <Text
            style={[
              styles.adviceLabel,
              isCompactContent && styles.adviceLabelCompact,
              isUltraCompactContent && styles.adviceLabelUltraCompact,
              isExtremeCompactContent && styles.adviceLabelExtremeCompact,
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
              isExtremeCompactContent && styles.adviceTextExtremeCompact,
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
              isExtremeCompactContent && styles.dateTextExtremeCompact,
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
              isExtremeCompactContent && styles.footerIconExtremeCompact,
            ]}
          />
          <Text
            style={[
              styles.footerBrand,
              isCompactContent && styles.footerBrandCompact,
              isUltraCompactContent && styles.footerBrandUltraCompact,
              isExtremeCompactContent && styles.footerBrandExtremeCompact,
            ]}
          >
            Astro Roast
          </Text>
          <Text
            style={[
              styles.dateText,
              isCompactContent && styles.dateTextCompact,
              isUltraCompactContent && styles.dateTextUltraCompact,
              isExtremeCompactContent && styles.dateTextExtremeCompact,
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
  cardExtremeCompact: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
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
  appTitleExtremeCompact: {
    fontSize: 10,
    letterSpacing: 1,
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
  signTitleExtremeCompact: {
    fontSize: 30,
    marginVertical: 1,
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
  dateTextExtremeCompact: {
    fontSize: 9,
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
  mainContentExtremeCompact: {
    marginTop: 1,
    marginBottom: 1,
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
    lineHeight: 17,
  },
  hookTextExtremeCompact: {
    fontSize: 13,
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
  dividerExtremeCompact: {
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
  mainRoastExtremeCompact: {
    fontSize: 11,
    lineHeight: 13,
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
  adviceBoxExtremeCompact: {
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
  adviceLabelExtremeCompact: {
    fontSize: 7,
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
  adviceTextExtremeCompact: {
    fontSize: 11,
    lineHeight: 14,
    marginVertical: 3,
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
  footerIconExtremeCompact: {
    width: 14,
    height: 14,
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
  footerBrandExtremeCompact: {
    fontSize: 10,
  },
});
