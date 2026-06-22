import { supabase } from "../lib/supabase";

export const handleDeepLink = async (url: string) => {
  const urlObj = new URL(url);
  const token_hash = urlObj.searchParams.get("token_hash") as string;
  const type = urlObj.searchParams.get("type") as string;

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });
    if (error) {
      console.error("Error verifying OTP:", error);
    }
  }
};
