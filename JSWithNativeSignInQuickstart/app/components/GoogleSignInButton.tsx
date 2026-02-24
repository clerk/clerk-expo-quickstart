import { useClerk } from "@clerk/expo";
import { useSignInWithGoogle } from "@clerk/expo/google";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";

interface GoogleSignInButtonProps {
  onSignInComplete?: () => void;
  showDivider?: boolean;
}

export default function GoogleSignInButton({
  onSignInComplete,
  showDivider = true,
}: GoogleSignInButtonProps) {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const clerk = useClerk();
  const [isLoading, setIsLoading] = useState(false);

  // Only render on iOS and Android
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return null;
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      const { createdSessionId, setActive } =
        await startGoogleAuthenticationFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        onSignInComplete?.();
      }
    } catch (err: any) {
      if (err.code === "SIGN_IN_CANCELLED" || err.code === "-5") {
        return;
      }

      const isAlreadySignedIn =
        err.message?.includes("already signed in") ||
        err.errors?.[0]?.code === "session_exists";

      if (isAlreadySignedIn) {
        try {
          const clerkAny = clerk as any;
          if (typeof clerkAny.__internal_reloadInitialResources === 'function') {
            await clerkAny.__internal_reloadInitialResources();
          }
          const activeSession = clerk.client?.sessions?.[0];
          if (activeSession) {
            await clerk.setActive({ session: activeSession.id });
          }
        } catch {
          Alert.alert("Sign-In Error", "Please restart the app and try again.");
        }
        return;
      }

      Alert.alert(
        "Google Sign-In Error",
        err.message || "An error occurred during Google Sign-In"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.googleButtonText}> Signing in...</Text>
          </View>
        ) : (
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>

      {showDivider && (
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  googleButtonDisabled: {
    backgroundColor: "#93B8F4",
    opacity: 0.7,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
  },
});
