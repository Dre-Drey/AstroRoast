import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { COLORS } from "../constants/theme";
import { sharedLayout, sharedTypography } from "../styles/common";
import { supabase } from "../lib/supabase";
import { ProfileScreenProps } from "../types/navigation";
import { useAuth } from "../contexts/AuthContext";
import {
  clearMobilePushSubscription,
  syncMobilePushSubscription,
} from "../lib/notifications";
const isWeb =
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  "serviceWorker" in navigator;
import { log } from "../lib/log";
import { useProfileQuery } from "../hooks/useProfileQuery";
import { useQueryClient } from "@tanstack/react-query";
import { showAlert } from "../lib/alert";

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { session, signOut, loading } = useAuth();
  const [updatingNotifications, setUpdatingNotifications] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const queryClient = useQueryClient();
  const profileQuery = useProfileQuery();
  const profile = profileQuery.data;

  useEffect(() => {
    setNotificationsEnabled(!!profile?.notificationsEnabled);
  }, [profile?.notificationsEnabled]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      log.error("Erreur lors de la déconnexion:", error);
    }
  };

  const handleDeleteAccount = () => {
    showAlert(
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
                showAlert("Error", "User not authenticated.");
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
                showAlert(
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
                showAlert(
                  "Error",
                  "An error occurred while deleting your account. Please try again.",
                );
              }
            } catch (error) {
              log.error("Error deleting account:", error);
              showAlert(
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
      if (isWeb) {
        // Web (Pusher Beams) flow: register/unregister interests
        const { registerForWebPush, unsubscribeFromWebPush } =
          await import("../lib/notificationsWeb");

        if (value) {
          const res = await registerForWebPush(session.user.id);
          if (!res || res.success === false) {
            showAlert(
              "Error",
              "Failed to enable web notifications. Please allow notifications in your browser settings.",
            );
            setUpdatingNotifications(false);
            return;
          }
          setNotificationsEnabled(true);
        } else {
          await unsubscribeFromWebPush(session.user.id);
          setNotificationsEnabled(false);
        }
      } else {
        if (value) {
          const saved = await syncMobilePushSubscription(session.user.id);
          if (!saved) {
            showAlert(
              "Error",
              "An error occurred while updating your notification settings. Please try again.",
            );
            setNotificationsEnabled(false);
            return;
          }
          setNotificationsEnabled(true);
        }
        if (!value) {
          const cleared = await clearMobilePushSubscription(session.user.id);
          if (!cleared) {
            showAlert(
              "Error",
              "An error occurred while updating your notification settings. Please try again.",
            );
            setNotificationsEnabled(true);
            return;
          }
          setNotificationsEnabled(false);
        }
      }
      await queryClient.invalidateQueries({
        queryKey: ["profile", session.user.id],
      });
    } catch (error) {
      showAlert(
        "Error",
        "An error occurred while updating your notification settings. Please try again.",
      );
    } finally {
      setUpdatingNotifications(false);
    }
  };

  if (loading || profileQuery.isLoading) {
    return (
      <View style={sharedLayout.center}>
        <ActivityIndicator color={COLORS.primary} />
        <Text style={[sharedTypography.labelMd, { marginTop: 20 }]}>
          ASKING FOR INFORMATION...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={sharedLayout.container}
      contentContainerStyle={[sharedLayout.content, styles.scrollContent]}
      keyboardShouldPersistTaps="handled"
    >
      {profileQuery.isError ? (
        <View style={sharedLayout.center}>
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
        <View style={styles.sessionContent}>
          <View style={sharedLayout.header}>
            <Text style={sharedTypography.displayMd}>PROFIL</Text>
            <Text style={sharedTypography.labelMd}>[ID_ENTITY_CONFIRMED]</Text>
          </View>
          <View style={styles.centeredBlock}>
            <View style={styles.infoSection}>
              <View>
                <Text style={sharedTypography.labelSm}>EMAIL</Text>
                <Text style={styles.infoValue}>
                  {session?.user.email?.toUpperCase()}
                </Text>
              </View>

              <View>
                <Text style={sharedTypography.labelSm}>ASTRO SIGN</Text>
                <Text style={styles.infoValue}>
                  {profile?.astro_sign.toUpperCase()}
                </Text>
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingTextBlock}>
                  <Text style={styles.settingTitle}>ENABLE NOTIFICATIONS</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleToggleNotifications}
                  disabled={updatingNotifications}
                  trackColor={{
                    false: COLORS.surfaceLow,
                    true: COLORS.primary,
                  }}
                  thumbColor={
                    notificationsEnabled ? COLORS.void : COLORS.primary
                  }
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
                <Text style={styles.logoutText}>LOGOUT SESSION</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteAccount}
                accessibilityRole="button"
                accessibilityHint="Permanently removes your account."
              >
                <Text style={styles.deleteText}>DELETE ACCOUNT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={sharedLayout.center}>
          <Text style={styles.labelMd}>CONNECT TO ACCESS PROFILE</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
  },
  scrollContent: {
    flexGrow: 1,
  },
  sessionContent: {
    flex: 1,
    width: "100%",
  },
  centeredBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  header: { marginBottom: 60 },
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
  infoSection: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
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
