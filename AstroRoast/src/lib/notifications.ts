import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { supabase } from "./supabase";

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  // Learn more about projectId:
  // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
  // EAS projectId is used here.
  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error("Project ID not found");
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
  } catch (e) {
    console.log(e);
    token = null;
  }

  return token;
}

export const syncPushToken = async (userId: string) => {
  try {
    const token = await registerForPushNotificationsAsync();
    if (!token) return;

    // Met à jour la table profiles (ou ta table dédiée si tu as choisi l'option multi-appareils)
    const { error } = await supabase
      .from("profiles")
      .update({ expo_push_token: token })
      .eq("id", userId);

    if (error) {
      console.error("Erreur lors de la synchronisation du token push:", error);
    }
  } catch (err) {
    console.error("Échec de l'enregistrement des notifications:", err);
  }
};
