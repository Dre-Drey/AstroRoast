import React, { useEffect, useState } from "react";
import {
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

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
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
        const { data } = await supabase
          .from("profiles")
          .select("astro_sign")
          .eq("id", user.id)
          .single();
        if (data) setSign(data.astro_sign);
      }
    }
    getProfile();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Error", error.message);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.displayMd}>PROFIL</Text>
        <Text style={styles.labelMd}>[ ID_ENTITY_CONFIRMED ]</Text>
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
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: COLORS.surfaceLow, true: COLORS.primary }}
            thumbColor={notificationsEnabled ? COLORS.void : COLORS.primary}
            ios_backgroundColor={COLORS.surfaceLow}
          />
        </View>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutText}>LOGOUT_SESSION</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteText}>DELETE_ACCOUNT</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
    marginBottom: 2,
  },
  settingsSection: {
    marginBottom: 60,
  },
  settingRow: {
    backgroundColor: COLORS.surfaceLow,
    padding: 20,
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
