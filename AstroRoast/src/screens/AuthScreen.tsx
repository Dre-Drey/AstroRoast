import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { supabase } from "../lib/supabase";
import { COLORS, SIGN_COLORS } from "../constants/theme";
import { AstroSign } from "../types/database";
import { setAppIcon } from "../lib/iconManager";
import { registerForPushNotificationsAsync } from "../lib/notifications";
import { log } from "../lib/log";

export const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [selectedSign, setSelectedSign] = useState<AstroSign | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
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
    if (!termsAccepted)
      return "Please accept the terms and conditions before signing up.";
    return null;
  };

  const openTerms = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Link unavailable", url);
      }
    } catch {
      Alert.alert("Link unavailable", url);
    }
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
          log.error("Error creating account:", error);
          Alert.alert(
            "Creation Error",
            "We could not create your account right now. Check your connection and try again.",
          );
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
              log.error("Error enabling notifications:", pushTokenError);
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
          log.error("Error logging in:", error);
          Alert.alert(
            "Login Error",
            "We could not log you in right now. Check your connection and try again.",
          );
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={30}
      enableOnAndroid={true}
    >
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
              {isSignUp ? (
                <Text style={styles.inputLabel}>
                  Already cursed ?{" "}
                  <Text
                    style={[
                      styles.inputLabel,
                      { textDecorationLine: "underline" },
                    ]}
                  >
                    Login here
                  </Text>
                </Text>
              ) : (
                <Text style={styles.inputLabel}>
                  No sign assigned ?{" "}
                  <Text
                    style={[
                      styles.inputLabel,
                      { textDecorationLine: "underline" },
                    ]}
                  >
                    Signup here
                  </Text>
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>EMAIL_ADDRESS</Text>
          <TextInput
            onChangeText={setEmail}
            value={email}
            placeholder="email@address.com"
            placeholderTextColor="#a7a7a7"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            style={styles.input}
            accessibilityLabel="Email address"
            accessibilityHint="Enter the email address for your account."
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#a7a7a7"
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            returnKeyType={isSignUp ? "next" : "done"}
            style={styles.input}
            accessibilityLabel="Password"
            accessibilityHint="Enter your account password."
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
              placeholderTextColor="#a7a7a7"
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              style={styles.input}
              accessibilityLabel="Confirm password"
              accessibilityHint="Re-enter the same password to confirm it."
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
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={sign.toUpperCase()}
                  accessibilityHint="Selects your astro sign for signup."
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
              accessibilityLabel="Enable notifications"
              accessibilityRole="switch"
              accessibilityState={{ checked: notificationsEnabled }}
              accessibilityHint="Turns daily roast notifications on or off."
            />
          </View>

          <TouchableOpacity
            onPress={() => setTermsAccepted((value) => !value)}
            style={styles.termsRow}
            activeOpacity={0.8}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: termsAccepted }}
            accessibilityLabel="Accept the general terms of use and privacy policy"
            accessibilityHint="Required before signing up. Double tap to toggle."
          >
            <View
              style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
            >
              {termsAccepted && <Text style={styles.checkboxMark}>✓</Text>}
            </View>
            <View style={styles.termsTextBlock}>
              <Text style={styles.inputLabel}>
                I accept the{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() =>
                    openTerms(
                      "https://app.notion.com/p/Conditions-g-n-rales-d-utilisation-375480e3f16c8047b2b7ca2cad6969b8",
                    )
                  }
                  accessibilityRole="link"
                  accessibilityLabel="Open general terms of use"
                  accessibilityHint="Opens the general terms of use in your browser."
                >
                  general terms of use
                </Text>{" "}
                and the{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() =>
                    openTerms(
                      "https://app.notion.com/p/Politique-de-confidentialit-375480e3f16c8067a3a6ddca2a2e5de0",
                    )
                  }
                  accessibilityRole="link"
                  accessibilityLabel="Open privacy policy"
                  accessibilityHint="Opens the privacy policy in your browser."
                >
                  privacy policy
                </Text>
                .
              </Text>
            </View>
          </TouchableOpacity>
        </>
      )}
      {errorMessage && (
        <Text
          style={{ color: "#ff6b6b", marginTop: 8 }}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {errorMessage}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleAuth}
        disabled={loading}
        accessibilityRole="button"
        accessibilityState={{ disabled: loading }}
        accessibilityLabel={loading ? "Preparing the salt" : "Get roasted"}
        accessibilityHint="Submits the login or signup form."
      >
        <Text style={styles.buttonText}>
          {loading ? "PREPARING THE SALT..." : "GET ROASTED"}
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
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
    fontSize: 12,
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
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 40,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkboxMark: {
    color: COLORS.void,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 16,
  },
  termsTextBlock: {
    flex: 1,
    color: COLORS.primary,
  },
  termsLink: {
    color: COLORS.primary,
    textDecorationLine: "underline",
    fontWeight: "700",
  },
  notificationDescription: {
    color: "#c8c8c8",
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
