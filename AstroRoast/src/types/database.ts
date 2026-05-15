export type AstroSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export interface Profile {
  id: string;
  email: string;
  astro_sign: AstroSign;
  updated_at?: string;
}

export type DailyRoast = {
  sign: AstroSign;
  date: string; // ISO format date (YYYY-MM-DD)
  hook: string;
  content: string;
  advice: string;
  event_id: number;
};
