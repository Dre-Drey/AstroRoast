import { supabase } from "./lib/supabase";
import { DailyRoast } from "./types/database";
import { log } from "./lib/log"

export const fetchDailyRoast = async (): Promise<DailyRoast> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  const { data: profile } = await supabase
    .from("profiles")
    .select("astro_sign")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("daily_roasts")
    .select("id, sign, hook, advice, content")
    .eq("sign", profile.astro_sign)
    .eq("date", today);

  if (error || !data || data.length === 0)
    throw new Error("Oups, an error occured. The cosmos is silent today...");
  return data[0] as DailyRoast;
};

export const fetchCosmicEvent = async () => {
  const { data, error } = await supabase
    .from("cosmic_events")
    .select("*")
    .eq("date", new Date().toISOString().split("T")[0])
    .single();

  if (error) {
    log.error("Error fetching cosmic event:", error);
    return null;
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
