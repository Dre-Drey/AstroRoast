import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { HomeScreenProps } from "../types/navigation";
import { useAuth } from "../contexts/AuthContext";

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { session } = useAuth();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>AstroRoast</Text>
      <Text style={styles.subtitle}>
        Base Expo prête pour la navigation et Supabase.
      </Text>
      {session ? (
        <Text style={styles.email}>{session.user.email}</Text>
      ) : (
        <Text style={styles.subtitle}>Connecte-toi pour commencer.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f6efe8",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#25170f",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    color: "#5e4b40",
  },
  email: {
    marginTop: 16,
    fontSize: 14,
    color: "#8c4f2b",
    fontWeight: "600",
  },
});
