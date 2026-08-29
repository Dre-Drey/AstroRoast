import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { supabase } from "./supabase";
import { log } from "./log";

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
    log.log(e);
    token = null;
  }

  return token;
}

export const syncMobilePushSubscription = async (
  userId: string,
): Promise<boolean> => {
  try {
    const token = await registerForPushNotificationsAsync();
    if (!token) return false;

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          user_id: userId,
          provider: "expo",
          platform: "mobile",
          endpoints: null,
          keys: null,
          interests: token,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,provider,platform" },
      );

    if (error) {
      log.error("Error syncing push token:", error);
        return false;
    }

      return true;
  } catch (err) {
    log.error("Error occurred while registering for push notifications:", err);
      return false;
  }
};

  export const clearMobilePushSubscription = async (
    userId: string,
  ): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("user_id", userId)
      .eq("provider", "expo")
      .eq("platform", "mobile");

    if (error) {
      log.error("Error clearing push token:", error);
      return false;
    }

    return true;
  } catch (err) {
    log.error("Error occurred while clearing push notifications:", err);
    return false;
  }
};