import { useEffect } from "react";
import { Linking } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
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
import { useAuth } from "./src/contexts/AuthContext";
import { RootTabParamList } from "./src/types/navigation";

import { handleDeepLink } from "./src/lib/deepLink";

const queryClient = new QueryClient();

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

export default function App() {
  // Handle deep linking
  useEffect(() => {
    const handleInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        await handleDeepLink(url);
      }
    };

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    handleInitialURL();

    return () => subscription.remove();
  }, []);

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
}

function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer theme={THEME}>
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
              height: 80,
            },
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
