import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fetchDailyRoast, fetchCosmicEvent } from "../actions";
import { COLORS, SIGN_COLORS } from "../constants/theme";
import { BurnScreenProps } from "../types/navigation";

export const BurnScreen: React.FC<BurnScreenProps> = () => {
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

  if (isLoading) {
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

  return (
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        bounces={true}
      >
        <View style={styles.title}>
          <Text style={styles.displayMd}>ASTRO ROAST</Text>
        </View>

        <View style={styles.header}>
          <Text style={[styles.displayLg, { color: signColor }]}>
            {data?.sign?.toUpperCase()}
          </Text>
          <Text style={styles.displayMd}>Daily Burn</Text>
        </View>

        <View style={styles.dataGrid}>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("fr-FR")}
          </Text>
          <View style={styles.dataBlock}>
            {isCosmicEventLoading ||
              (isCosmicEventError && (
                <Text style={styles.dataValue}>No cosmic event today</Text>
              ))}
            <Text style={styles.dataValue}>
              {cosmicEventData?.evenement?.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.roastIncipit}>
          <Text style={styles.roastText}>{data?.hook}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.roastIncipit}>
          <Text style={styles.roastTextSecondary}>{data?.content}</Text>
        </View>
        <View style={styles.adviceContainer}>
          <Text style={[styles.labelMd, { color: signColor }]}>
            COSMIC_ADVICE
          </Text>
          <Text style={styles.adviceText}>{data?.advice}</Text>
        </View>

        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: signColor }]}
          >
            <Text style={styles.secondaryButtonText}>SHARE THIS ROAST</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                marginTop: 10,
                backgroundColor: COLORS.void,
                borderColor: signColor,
              },
            ]}
          >
            <Text style={[styles.secondaryButtonText, { color: signColor }]}>
              SEE HOW YOUR FRIENDS ARE SUFFERING
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  displayMd: {
    color: COLORS.primary,
    fontSize: 38,
    lineHeight: 38,
    fontWeight: "700",
    letterSpacing: -1,
  },
  header: { marginBottom: 40 },
  labelMd: {
    color: COLORS.primary,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "700",
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
    gap: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: 15,
  },
  date: { color: "#666", fontSize: 14 },
  dataBlock: { flex: 1 },
  dataValue: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
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
    padding: 25,
    marginBottom: 40,
  },
  adviceText: {
    color: COLORS.primary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
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
