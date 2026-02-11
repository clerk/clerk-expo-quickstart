import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";

// Helper to check if native module is available
export function isNativeModuleAvailable(): boolean {
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return false;
  }
  try {
    const { requireNativeModule } = require("expo-modules-core");
    const module = requireNativeModule("ClerkExpo");
    return !!module;
  } catch {
    return false;
  }
}

interface NativeModuleGuardProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Component that guards against native module usage in Expo Go.
 * Shows a fallback message if native modules are not available.
 */
export function NativeModuleGuard({ title, children }: NativeModuleGuardProps) {
  const router = useRouter();

  if (!isNativeModuleAvailable()) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>
            This feature requires native modules which are not available in Expo Go.
          </Text>
          <Text style={styles.submessage}>
            Run `npx expo run:ios` or `npx expo run:android` to use native components.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  submessage: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
