import { useEffect, useState } from "react";
import { Linking, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  DefaultTheme,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import { StyleSheet } from "react-native";
import { Flame, UserRound } from "lucide-react-native";

import { BlurView } from "expo-blur";

import { BurnScreen } from "./src/screens/BurnScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { AuthProvider } from "./src/contexts/AuthContext";
import { SplashScreen } from "./src/screens/SplashScreen";
import NewPasswordScreen from "./src/screens/NewPasswordScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import { AuthCallbackScreen } from "./src/screens/AuthCallbackScreen";
import { useAuth } from "./src/contexts/AuthContext";
import { RootTabParamList } from "./src/types/navigation";

import * as Sentry from "@sentry/react-native";

if (Platform.OS === "web") {
  document.body.style.overflow = "auto";
}

Sentry.init({
  dsn: "https://39759842472ad82ccf0ca9023b84d3a1@o4511631548416000.ingest.de.sentry.io/4511631555362896",
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],
});

const queryClient = new QueryClient();
const navigationRef = createNavigationContainerRef<RootTabParamList>();

enableScreens(true);

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator();

const THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f6efe8",
    card: "#fff8f1",
    text: "#25170f",
    border: "#e6d2c3",
    primary: "#8c4f2b",
  },
};

// Extract token_hash and type from the URL query parameters
function parseAuthParams(url: string) {
  const queryString = url.split("?")[1];
  if (!queryString) return { token_hash: null, type: null };
  const params = new URLSearchParams(queryString);
  return {
    token_hash: params.get("token_hash"),
    type: params.get("type"),
  };
}

export default Sentry.wrap(function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </SafeAreaProvider>
        <StatusBar style="dark" />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
});

function AppNavigator() {
  const { session, loading } = useAuth();
  const [navigationReady, setNavigationReady] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<
    keyof RootTabParamList | null
  >(null);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [recoveryTokenHash, setRecoveryTokenHash] = useState<string | null>(
    null,
  );

  const linking = {
    prefixes: ["astroroast://", "https://app.astroroast.app"],
    config: {
      screens: {
        AuthCallback: "auth/callback",
        Burn: "burn",
        Profile: "profile",
        ForgotPassword: "forgot-password",
      },
    },
  };

  // Détection précoce du recovery, AVANT que le NavigationContainer ne
  // monte quoi que ce soit — évite que l'établissement de session par
  // verifyOtp ne fasse basculer l'app vers l'écran connecté trop tôt.
  useEffect(() => {
    const checkInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (!url) return;
      const { token_hash, type } = parseAuthParams(url);
      if (type === "recovery" && token_hash) {
        setRecoveryTokenHash(token_hash);
        setIsRecoveringPassword(true);
      }
    };
    void checkInitialUrl();

    const subscription = Linking.addEventListener("url", ({ url }) => {
      const { token_hash, type } = parseAuthParams(url);
      if (type === "recovery" && token_hash) {
        setRecoveryTokenHash(token_hash);
        setIsRecoveringPassword(true);
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const notificationSubscription =
      Notifications.addNotificationResponseReceivedListener(() => {
        if (loading) return;
        setPendingRoute(session ? "Burn" : "Auth");
      });

    return () => notificationSubscription.remove();
  }, [loading, session]);

  useEffect(() => {
    if (!navigationReady || !pendingRoute || !navigationRef.isReady()) return;
    if (isRecoveringPassword) return;
    navigationRef.navigate(pendingRoute);
    setPendingRoute(null);
  }, [navigationReady, pendingRoute]);

  if (loading) {
    return <SplashScreen />;
  }

  if (isRecoveringPassword) {
    return (
      <NewPasswordScreen
        tokenHash={recoveryTokenHash}
        onComplete={() => {
          setIsRecoveringPassword(false);
          setRecoveryTokenHash(null);
        }}
      />
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      theme={THEME}
      onReady={() => setNavigationReady(true)}
    >
      {session ? (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#f6efe8",
            tabBarInactiveTintColor: "#b99e8d",
            tabBarStyle: {
              position: "absolute",
              backgroundColor: "rgba(14, 14, 14, 0.7)",
              borderTopWidth: 0,
              elevation: 0,
              height: 88,
              paddingTop: 8,
              paddingBottom: 12,
            },
            tabBarItemStyle: { paddingVertical: 8 },
            tabBarBackground: () => (
              <BlurView
                tint="dark"
                intensity={20}
                style={StyleSheet.absoluteFill}
              />
            ),
          }}
        >
          <Tab.Screen
            name="Burn"
            component={BurnScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Flame color={color} size={size} strokeWidth={2.25} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <UserRound color={color} size={size} strokeWidth={2.25} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: "#0e0e0e" },
          }}
        >
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="AuthCallback" component={AuthCallbackScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f6efe8",
  },
});
