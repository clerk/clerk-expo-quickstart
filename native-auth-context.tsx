import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { DEMO_MODE } from "@/demo-config";

type NativeAuthContextType = {
  isNativeSignedIn: boolean;
  setNativeSignedIn: (value: boolean) => void;
};

const NativeAuthContext = createContext<NativeAuthContextType>({
  isNativeSignedIn: false,
  setNativeSignedIn: () => {},
});

export function useNativeAuth() {
  return useContext(NativeAuthContext);
}

function isNativeModuleAvailable(): boolean {
  if (Platform.OS !== "ios" && Platform.OS !== "android") return false;
  try {
    const { requireNativeModule } = require("expo-modules-core");
    return !!requireNativeModule("ClerkExpo");
  } catch {
    return false;
  }
}

async function checkNativeSession(): Promise<boolean> {
  if (DEMO_MODE !== "native" || !isNativeModuleAvailable()) return false;
  try {
    const { requireNativeModule } = require("expo-modules-core");
    const ClerkExpo = requireNativeModule("ClerkExpo");
    const session = await ClerkExpo.getSession();
    return !!session?.sessionId;
  } catch {
    return false;
  }
}

export function NativeAuthProvider({ children }: { children: React.ReactNode }) {
  const [isNativeSignedIn, setNativeSignedIn] = useState(false);
  const [checked, setChecked] = useState(DEMO_MODE !== "native");

  useEffect(() => {
    if (DEMO_MODE !== "native") return;
    checkNativeSession().then((result) => {
      setNativeSignedIn(result);
      setChecked(true);
    });
  }, []);

  // Don't render children until we've checked for an existing native session.
  // This prevents the auth layout from briefly showing the sign-in page.
  if (!checked) return null;

  return (
    <NativeAuthContext.Provider value={{ isNativeSignedIn, setNativeSignedIn }}>
      {children}
    </NativeAuthContext.Provider>
  );
}
