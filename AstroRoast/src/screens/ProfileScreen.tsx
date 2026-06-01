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

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { session, signOut, loading } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [updatingNotifications, setUpdatingNotifications] = useState(false);

  const [email, setEmail] = useState<string | undefined>("");
  const [sign, setSign] = useState<string>("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    async function getProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email);
        const { data, error } = await supabase
          .from("profiles")
          .select("astro_sign, expo_push_token")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          Alert.alert(
            "Error",
            "An error occurred while fetching your profile information.",
          );
          setDataLoading(false);
          return;
        }

        if (data) {
          setSign(data.astro_sign);
          setNotificationsEnabled(!!data.expo_push_token);
          setDataLoading(false);
        }
      }
    }
    getProfile();
  }, [session]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
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
          onPress: () =>
            Alert.alert(
              "Note",
              "Account deletion requires an Edge Function to clean up auth.users. To be implemented in phase 2.",
            ),
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
          console.error("Error enabling notifications:", error);
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
          console.error("Error disabling notifications:", error);
          throw new Error("Failed to disable notifications");
        }
        setNotificationsEnabled(false);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while updating your notification settings. Please try again.",
      );
    } finally {
      setUpdatingNotifications(false);
    }
  };

  if (loading || dataLoading) {
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
      {session ? (
        <>
          <View style={styles.header}>
            <Text style={styles.displayMd}>PROFIL</Text>
            <Text style={styles.labelMd}>[ID_ENTITY_CONFIRMED]</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoBlock}>
              <Text style={styles.labelSm}>EMAIL_LOG</Text>
              <Text style={styles.infoValue}>{email?.toUpperCase()}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.labelSm}>ASTRO_ASSIGNMENT</Text>
              <Text style={styles.infoValue}>{sign.toUpperCase()}</Text>
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
              />
            </View>
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleSignOut}
            >
              <Text style={styles.logoutText}>LOGOUT_SESSION</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
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
  labelSm: {
    color: COLORS.primary,
    fontSize: 10,
    opacity: 0.5,
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
});
