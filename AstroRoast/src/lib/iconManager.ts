import { NativeModules } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AstroSign } from "../types/database";
import { log } from "./log";

// Retrieve native module or provide a fallback
const IconManagerModule = NativeModules.IconManager || {
  setIcon: async () => {
    log.log("IconManager module not available");
  },
  getCurrentIcon: async () => "default",
};

// Mapping zodiac signs to icon names
const ZODIAC_ICON_NAMES: Record<AstroSign, string> = {
  aries: "aries",
  taurus: "taurus",
  gemini: "gemini",
  cancer: "cancer",
  leo: "leo",
  virgo: "virgo",
  libra: "libra",
  scorpio: "scorpio",
  sagittarius: "sagittarius",
  capricorn: "capricorn",
  aquarius: "aquarius",
  pisces: "pisces",
};

const STORAGE_KEY = "app_icon_sign";
const DEFAULT_ICON_NAME = "default";

/**
 * Define app icon based on the user's zodiac sign
 * @param sign - The selected zodiac sign
 */
export async function setAppIcon(sign: AstroSign | null): Promise<void> {
  if (!sign) {
    // Reset to the default icon
    const updated = await _updateAppIcon(null);
    if (updated) {
      await AsyncStorage.setItem(STORAGE_KEY, DEFAULT_ICON_NAME);
    }
    return;
  }

  const iconName = ZODIAC_ICON_NAMES[sign];
  if (!iconName) {
    log.log(`No icon found for sign: ${sign}`);
    return;
  }

  try {
    const updated = await _updateAppIcon(iconName);
    if (updated) {
      await AsyncStorage.setItem(STORAGE_KEY, iconName);
      log.log(`✓ Icon set to: ${iconName}`);
    }
  } catch (error) {
    log.error("Error occurred while updating the app icon:", error);
    // Do not display an alert to avoid interrupting the UX
  }
}

/**
 * Retrieve the current app icon from storage or native module
 */
export async function getCurrentIcon(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }

    if (IconManagerModule.getCurrentIcon) {
      return await IconManagerModule.getCurrentIcon();
    }

    return DEFAULT_ICON_NAME;
  } catch (error) {
    log.error("Error occurred while retrieving the app icon:", error);
    return DEFAULT_ICON_NAME;
  }
}

/**
 * Call the native module to update the app icon, with error handling
 */
async function _updateAppIcon(iconName: string | null): Promise<boolean> {
  try {
    if (!IconManagerModule.setIcon) {
      log.log("Module IconManager not available - icons ignored");
      return false;
    }

    await IconManagerModule.setIcon(iconName);
    return true;
  } catch (error) {
    log.error("Error occurred while calling the native module:", error);
    return false;
  }
}

/**
 * Initialise the icon manager at app startup
 */
export async function initializeIconManager(): Promise<void> {
  try {
    const currentIcon = await getCurrentIcon();
    if (currentIcon && currentIcon !== DEFAULT_ICON_NAME) {
      // Restore the icon at startup
      await _updateAppIcon(currentIcon);
    }
  } catch (error) {
    log.error("Error occurred while initializing the icon manager:", error);
  }
}
