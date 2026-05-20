import { Platform, Alert, NativeModules } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AstroSign } from "../types/database";

// Obtenir le module natif IconManager
const IconManagerModule = NativeModules.IconManager || {
  setIcon: async () => {
    console.warn("IconManager module non disponible");
  },
  getCurrentIcon: async () => "default",
};

// Mapping des icônes par signe zodiacal
const ZODIAC_ICON_NAMES: Record<AstroSign, string> = {
  Aries: "aries",
  Taurus: "taurus",
  Gemini: "gemini",
  Cancer: "cancer",
  Leo: "leo",
  Virgo: "virgo",
  Libra: "libra",
  Scorpio: "scorpio",
  Sagittarius: "sagittarius",
  Capricorn: "capricorn",
  Aquarius: "aquarius",
  Pisces: "pisces",
};

const STORAGE_KEY = "app_icon_sign";
const DEFAULT_ICON_NAME = "default";

/**
 * Définit l'icône de l'application en fonction du signe zodiacal
 * @param sign - Le signe zodiacal sélectionné
 */
export async function setAppIcon(sign: AstroSign | null): Promise<void> {
  if (!sign) {
    // Réinitialiser à l'icône par défaut
    await _updateAppIcon(null);
    await AsyncStorage.setItem(STORAGE_KEY, DEFAULT_ICON_NAME);
    return;
  }

  const iconName = ZODIAC_ICON_NAMES[sign];
  if (!iconName) {
    console.warn(`Aucune icône trouvée pour le signe: ${sign}`);
    return;
  }

  try {
    await _updateAppIcon(iconName);
    await AsyncStorage.setItem(STORAGE_KEY, iconName);
    console.log(`✓ Icon set to: ${iconName}`);
  } catch (error) {
    console.error("Erreur lors de la modification de l'icône:", error);
    // Ne pas afficher d'alerte pour éviter d'interrompre l'UX
  }
}

/**
 * Récupère l'icône actuellement définie
 */
export async function getCurrentIcon(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored || DEFAULT_ICON_NAME;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'icône:", error);
    return DEFAULT_ICON_NAME;
  }
}

/**
 * Appelle le code natif pour changer l'icône
 */
async function _updateAppIcon(iconName: string | null): Promise<void> {
  try {
    if (!IconManagerModule.setIcon) {
      console.log("Module IconManager non disponible - icônes ignorées");
      return;
    }

    // Appeler le module natif directement
    await IconManagerModule.setIcon(iconName);
  } catch (error) {
    console.error("Erreur lors de l'appel au module natif:", error);
    // L'erreur est silencieuse pour l'utilisateur
  }
}

/**
 * Initialise le gestionnaire d'icônes au démarrage de l'app
 */
export async function initializeIconManager(): Promise<void> {
  try {
    const currentIcon = await getCurrentIcon();
    if (currentIcon && currentIcon !== DEFAULT_ICON_NAME) {
      // Restaurer l'icône au démarrage
      await _updateAppIcon(currentIcon);
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation du gestionnaire d'icônes:", error);
  }
}
