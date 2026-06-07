import { ExpoConfig, ConfigContext } from "expo/config";

type ExpoConfigWithAlternateIcons = ExpoConfig & {
  ios: ExpoConfig["ios"] & {
    alternateIcons?: Record<string, { image: string }>;
  };
};

export default ({ config }: ConfigContext): ExpoConfigWithAlternateIcons => ({
  ...config,
  name: "AstroRoast",
  slug: "astroroast",
  version: "1.0.0",
  scheme: "astroroast",
  orientation: "portrait",
  userInterfaceStyle: "light",
  newArchEnabled: true,

  // Default icon
  icon: "./assets/icons/icon.png",

  splash: {
    image: "./assets/icons/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#0e0e0e",
  },

  ios: {
    bundleIdentifier: "com.astroroast.app",
    buildNumber: "1",
    supportsTablet: false, // portrait-only
    config: {
      // Using Supabase Auth with standard HTTPS)
      usesNonExemptEncryption: false,
    },
    associatedDomains: [],
    infoPlist: {
      // No tracking at all in this app
      NSUserTrackingUsageDescription:
        "AstroRoast does not track you or collect any personal data.",
      NSFaceIDUsageDescription:
        "AstroRoast uses Face ID to secure your session.",
    },
    alternateIcons: {
      aries: { image: "./assets/icons/ios/zodiac/aries.png" },
      taurus: { image: "./assets/icons/ios/zodiac/taurus.png" },
      gemini: { image: "./assets/icons/ios/zodiac/gemini.png" },
      cancer: { image: "./assets/icons/ios/zodiac/cancer.png" },
      leo: { image: "./assets/icons/ios/zodiac/leo.png" },
      virgo: { image: "./assets/icons/ios/zodiac/virgo.png" },
      libra: { image: "./assets/icons/ios/zodiac/libra.png" },
      scorpio: { image: "./assets/icons/ios/zodiac/scorpio.png" },
      sagittarius: { image: "./assets/icons/ios/zodiac/sagittarius.png" },
      capricorn: { image: "./assets/icons/ios/zodiac/capricorn.png" },
      aquarius: { image: "./assets/icons/ios/zodiac/aquarius.png" },
      pisces: { image: "./assets/icons/ios/zodiac/pisces.png" },
    },
  },

  android: {
    package: "com.astroroast.app",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/icons/android/adaptive-foreground.png",
      backgroundImage: "./assets/icons/android/adaptive-background.png",
    },
    edgeToEdgeEnabled: true,
    permissions: [
      "android.permission.RECEIVE_BOOT_COMPLETED", // notifications after reboot
      "android.permission.VIBRATE", // vibration for notifications
      "android.permission.POST_NOTIFICATIONS", // Android 13+
    ],
  },

  web: {
    favicon: "./assets/icons/icon.png",
  },

  plugins: [
    "expo-font",
    [
      "expo-notifications",
      {
        icon: "./assets/icons/icon.png",
        color: "#0e0e0e",
        defaultChannel: "default",
        enableBackgroundRemoteNotifications: false,
      },
    ],
    [
      "expo-secure-store",
      {
        configureAndroidBackup: true,
        faceIDPermission: "AstroRoast uses Face ID to secure your session.",
      },
    ],
  ],

  description:
    "Discover your daily horoscope with a roast twist. The stars don't guide you, they judge you.",

  extra: {
    eas: {
      projectId: "TON_PROJECT_ID_EAS", // todo: à récupérer via : eas init
    },
  },
});
