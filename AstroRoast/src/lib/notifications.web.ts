import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { supabase } from "./supabase";

const BEAMS_INSTANCE_ID = process.env
  .EXPO_PUBLIC_PUSHER_BEAMS_INSTANCE_ID as string;

const beamsClient = new PusherPushNotifications.Client({
  instanceId: BEAMS_INSTANCE_ID,
});

export async function registerServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    // Service worker must live at the root: /service-worker.js
    const registration =
      await navigator.serviceWorker.register("/service-worker.js");
    return registration;
  } catch (err) {
    console.error("Service worker registration failed:", err);
    return null;
  }
}

export async function registerForWebPush(userId?: string) {
  if (typeof window === "undefined") return null;
  if (!BEAMS_INSTANCE_ID) {
    console.error(
      "Pusher Beams instance id not configured (REACT_APP_PUSHER_BEAMS_INSTANCE_ID)",
    );
    return null;
  }

  try {
    await registerServiceWorker();
    await beamsClient.start();
    const deviceId = await beamsClient.getDeviceId();
    console.log("Successfully registered with Beams. Device ID:", deviceId);

    if (!userId) {
      return { success: true };
    }

    const interest = `user-${userId}`;
    await beamsClient.addDeviceInterest(interest);

    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        user_id: userId,
        provider: "pusher_beams",
        platform: "web",
        interest,
        endpoint: null,
        keys: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider,platform" },
    );

    if (error) throw error;

    return { success: true, interest };
  } catch (err) {
    console.error("registerForWebPush error:", err);
    return { success: false, error: err };
  }
}

export async function unsubscribeFromWebPush(userId?: string) {
  if (!beamsClient) return null;
  try {
    await beamsClient.start();
    if (userId) {
      const interest = `user-${userId}`;
      await beamsClient.removeDeviceInterest(interest);

      await supabase
        .from("push_subscriptions")
        .delete()
        .eq("user_id", userId)
        .eq("provider", "pusher_beams")
        .eq("platform", "web");

      return { success: true, interest };
    }
    return { success: true };
  } catch (err) {
    console.error("unsubscribeFromWebPush error:", err);
    return { success: false, error: err };
  }
}

export async function cleanUpWebPushSubscriptions() {
  if (!beamsClient) return null;
  await beamsClient.start();
  beamsClient.clearAllState();
}

export function getBeamsClient() {
  return beamsClient;
}
