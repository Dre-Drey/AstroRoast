import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { supabase } from "../lib/supabase";

export default function NewPasswordScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword.length < 10) {
      Alert.alert("Error", "The password must be at least 10 characters long.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success!", "Your password has been updated.");
      onComplete();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <TextInput
        placeholder="New password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button
        title={loading ? "Updating..." : "Save Password"}
        onPress={handleUpdatePassword}
        disabled={loading}
      />
    </View>
  );
}
