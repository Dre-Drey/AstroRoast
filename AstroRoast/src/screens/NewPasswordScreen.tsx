import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { supabase } from "../lib/supabase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS } from "../constants/theme";
import { sharedTypography, sharedLayout } from "../styles/common";
import { showAlert } from "../lib/alert";

export default function NewPasswordScreen({
  onComplete,
  tokenHash,
}: {
  onComplete: () => void;
  tokenHash: string | null;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword.length < 10) {
      showAlert("Error", "The password must be at least 10 characters long.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setLoading(false);

    if (error) {
      showAlert("Error", error.message);
    } else {
      showAlert("Success!", "Your password has been updated.");
      onComplete();
    }
  };

  useEffect(() => {
    if (tokenHash) {
      supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
    }
  }, [tokenHash]);

  return (
    <KeyboardAwareScrollView
      style={[sharedLayout.container, styles.container]}
      contentContainerStyle={[sharedLayout.content, styles.content]}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={30}
      enableOnAndroid={true}
    >
      <View style={[sharedLayout.center, styles.center]}>
        <Text style={styles.displayLg}>Enter new password</Text>
        <Text style={sharedTypography.labelMd}>
          Enter your new password below. Make sure it's at least 10 characters
          long for security.
        </Text>
        <View style={styles.inputGroup}>
          <Text style={styles.labelMd}>NEW_PASSWORD</Text>
          <View style={styles.passwordFieldRow}>
            <TextInput
              placeholder="password"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#a7a7a7"
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              style={[styles.input, styles.passwordInput]}
              accessibilityLabel="Password"
              accessibilityHint="Enter your account password."
            />
            <TouchableOpacity
              onPress={() => setShowPassword((value) => !value)}
              style={styles.passwordToggle}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
              accessibilityHint="Toggles password visibility."
            >
              {showPassword ? (
                <EyeOff size={20} color={COLORS.primary} />
              ) : (
                <Eye size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          </View>
          <View />
          <TouchableOpacity
            style={[
              sharedLayout.button,
              loading && { opacity: 0.7 },
              !newPassword && { opacity: 0.3 },
            ]}
            onPress={handleUpdatePassword}
            disabled={loading || !newPassword}
          >
            <Text style={sharedLayout.buttonText}>
              {loading ? "Updating..." : "Save password"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.void,
    padding: 20,
    paddingTop: 80,
  },
  content: { padding: 10, paddingTop: 40, marginBottom: 40 },
  center: {
    flex: 1,
    backgroundColor: COLORS.void,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  labelMd: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
  },
  displayLg: {
    color: COLORS.primary,
    fontSize: 60,
    lineHeight: 64,
    fontWeight: "900",
    letterSpacing: -2,
    marginBottom: 10,
  },
  inputGroup: { marginVertical: 25, width: "100%" },
  input: {
    color: COLORS.primary,
    fontSize: 18,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 24,
    borderRadius: 0, // Brutalism Rule
    alignItems: "center",
    marginBottom: 100,
  },
  buttonText: {
    color: COLORS.void,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
  },
  passwordInput: {
    flex: 1,
    borderBottomWidth: 0,
  },
  passwordToggle: {
    paddingLeft: 12,
    paddingVertical: 10,
  },
  passwordFieldRow: {
    borderWidth: 2,
    borderColor: COLORS.outline,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.outline,
    padding: 10,
    marginVertical: 10,
  },
});
