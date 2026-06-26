export type AstroSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export interface Profile {
  id: string;
  email: string;
  astro_sign: AstroSign;
  updated_at?: string;
}

export type ProfileSettings = {
  astro_sign: AstroSign;
  expo_push_token: string | null;
};

export type DailyRoast = {
  id: string;
  sign: AstroSign;
  date: string; // ISO format date (YYYY-MM-DD)
  hook: string;
  content: string;
  advice: string;
  event_id: number;
};

export type CosmicEvent = {
  id?: string | number;
  date: string;
  type: string;
  evenement: string;
};

export type RoastReport = {
  id?: string;
  user_id: string;
  roast_id: string;
  message: string;
  created_at?: string;
};
