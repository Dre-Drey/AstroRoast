import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { supabase } from "../lib/supabase";
import { COLORS, SIGN_COLORS } from "../constants/theme";
import { AstroSign } from "../types/database";
import { setAppIcon } from "../lib/iconManager";
import { registerForPushNotificationsAsync } from "../lib/notifications";

export const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [selectedSign, setSelectedSign] = useState<AstroSign | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const validate = (): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email address.";
    if (password.length < 10)
      return "The password must be at least 10 characters long.";
    if (password !== confirmPassword) return "The passwords do not match.";
    if (!selectedSign) return "Choose a sign, don't be afraid.";
    return null;
  };

  async function handleAuth() {
    setLoading(true);
    try {
      if (isSignUp) {
        const errorMsg = validate();
        if (errorMsg) {
          setErrorMessage(errorMsg);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { astro_sign: selectedSign },
          },
        });

        if (error) {
          Alert.alert("Creation Error", error.message);
          return;
        }

        await setAppIcon(selectedSign);

        if (notificationsEnabled && data.user?.id) {
          const token = await registerForPushNotificationsAsync();
          if (!token) {
            Alert.alert(
              "Error",
              "Failed to enable notification without your permission. Please allow notifications in your phone settings.",
            );
          } else {
            const { error: pushTokenError } = await supabase
              .from("profiles")
              .update({ expo_push_token: token })
              .eq("id", data.user.id);

            if (pushTokenError) {
              console.error("Error enabling notifications:", pushTokenError);
              Alert.alert(
                "Error",
                "An error occurred while updating your notification settings. Please try again.",
              );
            }
          }
        }

        Alert.alert("Success", "Check your emails to confirm your account!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          Alert.alert("Login Error", error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.title}>
        <Text style={styles.displayMd}>ASTRO ROAST</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.displayLg}>
          STARS DON’T GUIDE YOU.
          {"\n"}THEY JUDGE YOU.
        </Text>
        <Text style={styles.labelLg}>
          [ Stop looking for guidance. Start looking for the truth.{"\n"}
          Join thousands of souls burned by the stars everyday. ]
        </Text>
      </View>

      <View>
        <View style={{ marginBottom: 20 }}>
          <Text
            style={[
              styles.labelLg,
              { color: COLORS.primary, marginBottom: 10 },
            ]}
          >
            {isSignUp ? "SIGNUP" : "LOGIN"}
          </Text>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.inputLabel}>
              {isSignUp
                ? "Already cursed ? Login here"
                : "No sign assigned ? Signup here"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>EMAIL_ADDRESS</Text>
          <TextInput
            onChangeText={setEmail}
            value={email}
            placeholder="email@address.com"
            placeholderTextColor="#666"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#666"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        {isSignUp && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CONFIRM_PASSWORD</Text>
            <TextInput
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              secureTextEntry
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        )}
      </View>

      {isSignUp && (
        <>
          <Text style={[styles.inputLabel, { marginBottom: 20 }]}>
            SELECT_YOUR_SIGN
          </Text>

          <View style={styles.grid}>
            {Object.keys(SIGN_COLORS).map((sign) => {
              const isSelected = selectedSign === sign;
              return (
                <TouchableOpacity
                  key={sign}
                  onPress={() => setSelectedSign(sign as AstroSign)}
                  style={[
                    styles.chip,
                    isSelected && { backgroundColor: SIGN_COLORS[sign] },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && { color: COLORS.void, fontWeight: "bold" },
                    ]}
                  >
                    {sign.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.notificationRow}>
            <View style={styles.notificationTextBlock}>
              <Text style={styles.inputLabel}>ENABLE_NOTIFICATIONS</Text>
              <Text style={styles.notificationDescription}>
                Receive your daily roast when the stars are ready.
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.surfaceLow, true: COLORS.primary }}
              thumbColor={notificationsEnabled ? COLORS.void : COLORS.primary}
              ios_backgroundColor={COLORS.surfaceLow}
            />
          </View>
        </>
      )}
      {errorMessage && (
        <Text style={{ color: "red", marginTop: 8 }}>{errorMessage}</Text>
      )}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleAuth}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "PREPARING THE SALT..." : "GET ROASTED"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.void },
  content: { padding: 20, paddingTop: 40 },
  title: {
    marginBottom: 40,
    marginTop: 40,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primary,
    width: "75%",
  },
  header: { marginBottom: 60 },
  displayMd: {
    color: COLORS.primary,
    fontSize: 38,
    lineHeight: 38,
    fontWeight: "700",
    letterSpacing: -1,
  },
  displayLg: {
    color: COLORS.primary,
    fontSize: 62,
    lineHeight: 64,
    fontWeight: "900",
    letterSpacing: -2,
    marginBottom: 10,
  },
  labelLg: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 8,
  },
  labelMd: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
  },
  inputGroup: { marginBottom: 25 },
  inputLabel: {
    color: COLORS.primary,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 8,
    fontFamily: "SpaceGrotesk_700Bold", // Si chargée
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.outline,
    color: COLORS.primary,
    fontSize: 18,
    paddingVertical: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 40,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 40,
  },
  notificationTextBlock: {
    flex: 1,
  },
  notificationDescription: {
    color: "#666",
    fontSize: 12,
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  chip: {
    backgroundColor: COLORS.surfaceHigh,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 0, // Brutalism Rule
  },
  chipText: { color: COLORS.primary, fontSize: 11, letterSpacing: 1 },
  button: {
    backgroundColor: COLORS.primary,
    padding: 24,
    borderRadius: 0, // Brutalism Rule
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.void,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
