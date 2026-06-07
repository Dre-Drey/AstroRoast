import { supabase } from "./lib/supabase";
import { CosmicEvent, DailyRoast } from "./types/database";
import { log } from "./lib/log"

const NETWORK_ERROR_MESSAGE =
  "We could not load this content right now. Check your connection and tap Retry.";
const ROAST_NOT_AVAILABLE_MESSAGE =
  "No Daily Roast is available for your sign today.";
const SIGN_IN_REQUIRED_MESSAGE =
  "Please sign in again to load your Daily Roast.";

export const fetchDailyRoast = async (): Promise<DailyRoast> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error(SIGN_IN_REQUIRED_MESSAGE);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("astro_sign")
    .eq("id", user.id)
    .single();

  if (profileError) {
    log.error("Error fetching profile for daily roast:", profileError);
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!profile) {
    throw new Error(SIGN_IN_REQUIRED_MESSAGE);
  }

  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("daily_roasts")
    .select("id, sign, hook, advice, content")
    .eq("sign", profile.astro_sign)
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
