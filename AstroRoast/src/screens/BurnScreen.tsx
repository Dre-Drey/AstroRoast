import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { File, Paths } from "expo-file-system";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Flame } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fetchDailyRoast, fetchCosmicEvent } from "../actions";
import { COLORS, SIGN_COLORS } from "../constants/theme";
import { BurnScreenProps } from "../types/navigation";
import ShareCard from "../components/ShareCard";
import { useAuth } from "../contexts/AuthContext";
import { renderInlineMarkdown } from "../lib/renderInlineMarkdown";
import DisclaimerForm from "../components/DisclaimerForm";

export const BurnScreen: React.FC<BurnScreenProps> = ({ navigation }) => {
  const { session, loading } = useAuth();
  const cardRef = useRef(null);
  const notificationEnabled = false; // Placeholder for notification toggle state
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dailyRoast"],
    queryFn: () => fetchDailyRoast(),
    retry: 1,
  });

  const {
    data: cosmicEventData,
    isLoading: isCosmicEventLoading,
    isError: isCosmicEventError,
    error: cosmicEventError,
  } = useQuery({
    queryKey: ["cosmicEvent"],
    queryFn: () => fetchCosmicEvent(),
    retry: 1,
  });

  const todayDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (isLoading || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} />
        <Text style={[styles.labelMd, { marginTop: 20 }]}>
          READING_STARS...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.displayMd}>ERROR</Text>
        <Text style={styles.errorText}>
          [ {(error as Error).message.toUpperCase()} ]
        </Text>
      </View>
    );
  }

  const signColor = data?.sign ? SIGN_COLORS[data.sign] : COLORS.primary;

  const handleShare = async () => {
    try {
      // 1. Capture the card as an image (generate temporary URI)
      const tempUri = await captureRef(cardRef, {
        format: "png",
        quality: 1,
      });

      // 2. Create a File instance pointing to the temporary location
      const sourceFile = new File(tempUri);

      // 3. Create a destination File in the documents directory
      const fileName = `astro_daily_roast_${Date.now()}.png`;
      const destinationFile = new File(Paths.document, fileName);

      // 4. Copy the file from temp to permanent location
      sourceFile.copy(destinationFile);

      // 5. Check if sharing is available
      if (!(await Sharing.isAvailableAsync())) {
        alert("Le partage n'est pas disponible sur votre appareil");
        return;
      }

      // 6. Share the image using the system's share dialog
      await Sharing.shareAsync(destinationFile.uri, {
        mimeType: "image/png",
        dialogTitle: "Share your Daily Roast",
        UTI: "public.png", // for iOS
      });
    } catch (error) {
      console.error("Error sharing the card:", error);
      alert("Oups, something wrong happened :( Try again later.");
    }
  };

  return session ? (
    <>
      <View style={styles.void}>
        <LinearGradient
          colors={[signColor + "90", "rgba(0,0,0,0)"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
          }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
        <Flame
          size={450}
          fill={COLORS.surfaceLow}
          stroke={COLORS.surfaceLow}
          style={styles.flameBackground}
        />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          bounces={true}
        >
          <View style={styles.header}>
            <Text style={[styles.displayLg, { color: signColor }]}>
              {data?.sign?.toUpperCase()}
            </Text>
            <Text style={styles.displayMd}>
              {todayDate.toLocaleDateString(undefined, options)}
            </Text>
          </View>

          <View style={styles.dataGrid}>
            <Text style={styles.date}>Cosmic event of the day </Text>
            <View style={styles.dataBlock}>
              {isCosmicEventLoading ||
                (isCosmicEventError && (
                  <Text style={styles.dataValue}>No cosmic event today</Text>
                ))}
              <Text style={[styles.dataValue]}>
                <Text style={{ textTransform: "capitalize" }}>
                  {cosmicEventData?.type}:
                </Text>{" "}
                {cosmicEventData?.evenement}
              </Text>
            </View>
          </View>

          <View style={styles.roastIncipit}>
            <Text style={styles.roastText}>{data?.hook}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.roastIncipit}>
            <Text style={styles.roastTextSecondary}>
              {renderInlineMarkdown(data?.content)}
            </Text>
          </View>
          <View style={styles.adviceContainer}>
            <Text style={[styles.labelMd, { color: signColor }]}>
              COSMIC ADVICE
            </Text>
            <Text style={styles.adviceText}>{data?.advice}</Text>
          </View>
          <View style={styles.ctaContainer}>
            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: signColor }]}
              onPress={handleShare}
            >
              <Text style={styles.secondaryButtonText}>SHARE THIS ROAST</Text>
            </TouchableOpacity>
            {/* Redirect to profile screen */}
            {!notificationEnabled && (
              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() => navigation.navigate("Profile")}
              >
                <Text
                  style={[
                    styles.labelSm,
                    {
                      textAlign: "center",
                      color: COLORS.primary,
                      textDecorationLine: "underline",
                    },
                  ]}
                >
                  ENABLE NOTIFICATIONS
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <DisclaimerForm data={data} />
        </ScrollView>
      </View>
      {/* Share Card is rendered in the DOM but is hidden, it will be captured
      when the user click on share and then deleted after sharing */}
      <View style={{ position: "absolute", left: -5000 }}>
        {data && (
          <ShareCard
            sign={data?.sign}
            hook={data?.hook}
            roast={data?.content}
            signColor={signColor}
            date={todayDate}
            advice={data?.advice}
            viewRef={cardRef}
          />
        )}
      </View>
    </>
  ) : (
    <View style={styles.center}>
      <Text style={styles.displayMd}>NO SESSION</Text>
      <Text style={styles.errorText}>
        Connecte-toi pour voir ton Daily Roast
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  void: { flex: 1, backgroundColor: COLORS.void },
  center: {
    flex: 1,
    backgroundColor: COLORS.void,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: COLORS.primary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 120 },
  title: {
    marginBottom: 40,
    marginTop: 30,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primary,
    width: "75%",
  },
  flameBackground: {
    position: "absolute",
    left: 50,
    top: 20,
    zIndex: 0,
  },
  displayMd: {
    color: COLORS.primary,
    fontSize: 38,
    lineHeight: 38,
    fontWeight: "700",
    letterSpacing: -1,
  },
  header: { marginBottom: 40, marginTop: 40 },
  labelMd: {
    color: COLORS.primary,
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 8,
  },
  labelSm: {
    color: COLORS.primary,
    fontSize: 10,
    opacity: 0.6,
    letterSpacing: 1,
  },
  displayLg: { fontSize: 64, fontWeight: "900", letterSpacing: -2 },
  dataGrid: {
    flexDirection: "column",
    backgroundColor: COLORS.surfaceLow,
    marginBottom: 40,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: 15,
  },
  date: { color: "#666", fontSize: 12 },
  dataBlock: { flex: 1 },
  dataValue: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "400",
  },
  roastIncipit: {
    marginBottom: 20,
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#FFFFFF",
    width: "60%",
    alignSelf: "center",
    marginBottom: 40,
  },
  roastText: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    textAlign: "left",
    color: COLORS.primary,
  },
  roastTextSecondary: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    textAlign: "left",
    color: COLORS.primary,
  },
  adviceContainer: {
    backgroundColor: COLORS.surfaceLow,
    padding: 15,
    marginBottom: 40,
  },
  adviceText: {
    color: COLORS.primary,
    fontSize: 16,
    lineHeight: 24,
  },
  ctaContainer: { marginBottom: 40 },
  secondaryButton: {
    paddingVertical: 15,
  },
  secondaryButtonText: {
    textAlign: "center",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 1,
  },
});
