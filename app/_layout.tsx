import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ClerkProvider, ClerkLoaded, useClerk } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { requireNativeModule } from "expo-modules-core";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Check if native module is supported on this platform
const isNativeSupported = Platform.OS === "ios" || Platform.OS === "android";

// Get the native module
const ClerkExpo = isNativeSupported ? requireNativeModule("ClerkExpo") : null;

// Component to sync native session to JS on startup
function NativeSessionSync() {
  const { setActive } = useClerk();

  useEffect(() => {
    const syncNativeSession = async () => {
      if (!ClerkExpo?.getSession) {
        return;
      }

      try {
        console.log("[NativeSessionSync] Checking for native session...");
        const nativeSession = await ClerkExpo.getSession();

        if (nativeSession?.sessionId) {
          console.log(
            "[NativeSessionSync] Found native session, syncing to JS:",
            nativeSession.sessionId
          );
          await setActive({ session: nativeSession.sessionId });
          console.log("[NativeSessionSync] Session synced successfully");
        } else {
          console.log("[NativeSessionSync] No native session found");
        }
      } catch (err) {
        console.log("[NativeSessionSync] Error syncing session:", err);
      }
    };

    syncNativeSession();
  }, [setActive]);

  return null;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <NativeSessionSync />
        <Slot />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
