import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Text,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { supabase } from "../lib/supabase";
import { COLORS } from "../constants/theme";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async () => {
    setLoading(true);

    // Defining direct URL, good to know : ok with dev build, but not with Expo Go
    const redirectTo = "monapphoroscope://reset-password";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Check your emails",
        "A password reset link has been sent to your email.",
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={30}
      enableOnAndroid={true}
    >
      <View style={styles.center}>
        <Text style={styles.displayLg}>Forgot your password ?</Text>
        <Text style={styles.labelMd}>
          Enter your email address and, if there is an account associated with
          it, we'll send you a link to reset your password.
        </Text>
        <View style={styles.inputGroup}>
          <Text style={styles.labelMd}>EMAIL_ADDRESS</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
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

        <TouchableOpacity
          style={[
            styles.button,
            loading && { opacity: 0.7 },
            !email && { opacity: 0.3 },
          ]}
          onPress={handleResetRequest}
          disabled={loading || !email}
        >
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Receive reset link"}
          </Text>
        </TouchableOpacity>
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
    borderWidth: 2,
    borderColor: COLORS.outline,
    color: COLORS.primary,
    fontSize: 18,
    padding: 10,
    marginVertical: 10,
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
});
