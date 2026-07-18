import { supabase } from "../lib/supabase";

export const isEmailConfirmationUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.searchParams.has("token_hash") && urlObj.searchParams.has("type")
    );
  } catch {
    return false;
  }
};

export const handleDeepLinkEmailConfirmation = async (url: string) => {
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

export const isPasswordResetUrl = (urlStr: string) => {
  const url = new URL(urlStr);
  const type = url.searchParams.get("type");
  return type === "recovery";
};

export const handlePasswordResetUrl = async (urlStr: string) => {
  const url = new URL(urlStr);
  const token_hash = url.searchParams.get("token_hash");
  if (!token_hash) return;

  if (token_hash) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: "recovery",
    });

    if (error) {
      console.error("Erreur lors de la validation du reset:", error.message);
    }
  }
};
