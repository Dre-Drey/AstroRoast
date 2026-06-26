import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/theme";
import { supabase } from "../lib/supabase";
import { ProfileScreenProps } from "../types/navigation";
import { useAuth } from "../contexts/AuthContext";
import { registerForPushNotificationsAsync } from "../lib/notifications";
import { log } from "../lib/log";
import { useProfileQuery } from "../hooks/useProfileQuery";
import { useQueryClient } from "@tanstack/react-query";

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { session, signOut, loading } = useAuth();
  const [updatingNotifications, setUpdatingNotifications] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const queryClient = useQueryClient();
  const profileQuery = useProfileQuery();
  const profile = profileQuery.data;

  useEffect(() => {
    setNotificationsEnabled(!!profile?.expo_push_token);
  }, [profile?.expo_push_token]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      log.error("Erreur lors de la déconnexion:", error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "SUPPRESSION",
      "Are you sure you want to delete your account? This action is irreversible.",
      [
        { text: "CANCEL", style: "cancel" },
        {
          text: "DELETE ACCOUNT",
          style: "destructive",
          onPress: async () => {
            try {
              if (!session?.user) {
                Alert.alert("Error", "User not authenticated.");
                return;
              }
              const response = await fetch(
                "https://sfczdfyolkrwgwsfdimz.supabase.co/functions/v1/delete-account",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                  },
                },
              );
              if (response.ok) {
                await supabase.auth.signOut();
                Alert.alert(
                  "Account Deleted",
                  "Your account has been successfully deleted.",
                );
              }
              if (!response.ok) {
                const errorData = await response.json();
                log.error(
                  "Response is not ok - error deleting account:",
                  errorData,
                );
                Alert.alert(
                  "Error",
                  "An error occurred while deleting your account. Please try again.",
                );
              }
            } catch (error) {
              log.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                "An error occurred while deleting your account. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (!session?.user) return;
    setUpdatingNotifications(true);

    try {
      if (value) {
        // Register for push notifications and get the token
        const token = await registerForPushNotificationsAsync();
        if (!token) {
          Alert.alert(
            "Error",
            "Failed to enable notification without your permission. Please allow notifications in your phone settings.",
          );
          setUpdatingNotifications(false);
          return;
        }

        const { error } = await supabase
          .from("profiles")
          .update({ expo_push_token: token })
          .eq("id", session.user.id);

        if (error) {
          log.error("Error enabling notifications:", error);
          throw new Error("Failed to enable notifications");
        }
        setNotificationsEnabled(true);
      }
      if (!value) {
        const { error } = await supabase
          .from("profiles")
          .update({ expo_push_token: null })
          .eq("id", session.user.id);

        if (error) {
          log.error("Error disabling notifications:", error);
          throw new Error("Failed to disable notifications");
        }
        setNotificationsEnabled(false);
      }
      await queryClient.invalidateQueries({
        queryKey: ["profile", session.user.id],
      });
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while updating your notification settings. Please try again.",
      );
    } finally {
      setUpdatingNotifications(false);
    }
  };

  if (loading || profileQuery.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} />
        <Text style={[styles.labelMd, { marginTop: 20 }]}>
          ASKING FOR INFORMATION...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profileQuery.isError ? (
        <View style={styles.center}>
          <Text style={styles.displayMd}>PROFILE OFFLINE</Text>
          <Text style={[styles.labelMd, styles.errorMessage]}>
            {(profileQuery.error as Error).message ||
              "We could not load your profile right now. Check your connection and tap Retry."}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              void profileQuery.refetch();
            }}
            accessibilityRole="button"
            accessibilityLabel="Retry loading profile"
            accessibilityHint="Attempts to reload your profile information."
          >
            <Text style={styles.retryButtonText}>RETRY</Text>
          </TouchableOpacity>
        </View>
      ) : session ? (
        <>
          <View style={styles.header}>
            <Text style={styles.displayMd}>PROFIL</Text>
            <Text style={styles.labelMd}>[ID_ENTITY_CONFIRMED]</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoBlock}>
              <Text style={styles.labelSm}>EMAIL_LOG</Text>
              <Text style={styles.infoValue}>
                {session?.user.email?.toUpperCase()}
              </Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.labelSm}>ASTRO_ASSIGNMENT</Text>
              <Text style={styles.infoValue}>
                {profile?.astro_sign.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.settingsSection}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextBlock}>
                <Text style={styles.settingTitle}>ENABLE_NOTIFICATIONS</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                disabled={updatingNotifications}
                trackColor={{ false: COLORS.surfaceLow, true: COLORS.primary }}
                thumbColor={notificationsEnabled ? COLORS.void : COLORS.primary}
                ios_backgroundColor={COLORS.surfaceLow}
                accessibilityLabel="Enable notifications"
                accessibilityRole="switch"
                accessibilityState={{ checked: notificationsEnabled }}
                accessibilityHint="Turns profile notifications on or off."
              />
            </View>
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleSignOut}
              accessibilityRole="button"
              accessibilityLabel="Log out"
              accessibilityHint="Signs you out of the app."
            >
              <Text style={styles.logoutText}>LOGOUT_SESSION</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
              accessibilityRole="button"
              accessibilityLabel="Delete account"
              accessibilityHint="Permanently removes your account."
            >
              <Text style={styles.deleteText}>DELETE_ACCOUNT</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.center}>
          <Text style={styles.labelMd}>CONNECT_TO_ACCESS_PROFILE</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.void,
    padding: 20,
    paddingTop: 80,
  },
  header: { marginBottom: 60 },
  center: {
    flex: 1,
    backgroundColor: COLORS.void,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  displayMd: {
    color: COLORS.primary,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -1,
  },
  labelMd: {
    color: COLORS.primary,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "700",
  },
  errorMessage: {
    textAlign: "center",
    lineHeight: 20,
    marginTop: 16,
  },
  labelSm: {
    color: COLORS.primary,
    fontSize: 10,
    opacity: 0.75,
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoSection: { marginBottom: 60 },
  infoBlock: {
    backgroundColor: COLORS.surfaceLow,
    marginBottom: 12,
  },
  settingsSection: {
    marginBottom: 60,
  },
  settingRow: {
    backgroundColor: COLORS.surfaceLow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  settingTextBlock: {
    flex: 1,
  },
  settingTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  infoValue: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  actionSection: { gap: 20 },
  logoutButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 18,
    alignItems: "center",
  },
  logoutText: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 1,
  },
  deleteButton: {
    padding: 10,
    alignItems: "center",
  },
  deleteText: {
    color: "#FF3B30",
    fontSize: 12,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  retryButton: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1,
  },
});
