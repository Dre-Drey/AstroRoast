import { supabase } from "./lib/supabase";
import { CosmicEvent, DailyRoast, ProfileSettings } from "./types/database";
import { log } from "./lib/log";

const NETWORK_ERROR_MESSAGE =
  "We could not load this content right now. Check your connection and tap Retry.";
const ROAST_NOT_AVAILABLE_MESSAGE =
  "No Daily Roast is available for your sign today.";
const SIGN_IN_REQUIRED_MESSAGE =
  "Please sign in again to load your Daily Roast.";

export const fetchProfile = async (
  userId: string,
): Promise<ProfileSettings> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("astro_sign, expo_push_token")
    .eq("id", userId)
    .single();

  if (error) {
    log.error("Error fetching profile:", error);
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!data) {
    throw new Error(SIGN_IN_REQUIRED_MESSAGE);
  }

  return data as ProfileSettings;
};

export const fetchDailyRoast = async (
  astroSign: DailyRoast["sign"],
): Promise<DailyRoast> => {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("daily_roasts")
    .select("id, sign, hook, advice, content")
    .eq("sign", astroSign)
    .eq("date", today);

  if (error) {
    log.error("Error fetching daily roast:", error);
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!data || data.length === 0) {
    throw new Error(ROAST_NOT_AVAILABLE_MESSAGE);
  }

  return data[0] as DailyRoast;
};

export const fetchCosmicEvent = async (): Promise<CosmicEvent | null> => {
  const { data, error } = await supabase
    .from("cosmic_events")
    .select("*")
    .eq("date", new Date().toISOString().split("T")[0])
    .maybeSingle();

  if (error) {
    log.error("Error fetching cosmic event:", error);
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  return data;
};

type RoastReportInput = {
  roast: DailyRoast;
  message: string;
};

export const submitRoastReport = async ({
  roast,
  message,
}: RoastReportInput): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { error } = await supabase.from("roast_reports").insert({
    user_id: user.id,
    roast_id: roast.id,
    message: message.trim(),
  });

  if (error) {
    throw error;
  }
};
