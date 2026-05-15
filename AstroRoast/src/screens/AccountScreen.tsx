import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { AccountScreenProps } from "../types/navigation";
import { useAuth } from "../contexts/AuthContext";

export const AccountScreen: React.FC<AccountScreenProps> = () => {
  const { session, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <Text style={styles.subtitle}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Compte</Text>
      {session ? (
        <>
          <Text style={styles.email}>{session.user.email}</Text>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.subtitle}>
          Connecte-toi pour accéder à ton compte.
        </Text>
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
  email: {
    fontSize: 16,
    color: "#5e4b40",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    color: "#5e4b40",
  },
  signOutButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#8c4f2b",
    borderRadius: 8,
  },
  signOutButtonText: {
    color: "#fff8f1",
    fontSize: 16,
    fontWeight: "600",
  },
});
