import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * GoogleSSOButton - Uses useOAuth hook for OAuth-based Google Sign-In
 */
export default function GoogleSSOButton() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting Google OAuth flow...");

      const result = await startOAuthFlow();

      console.log("OAuth flow result:", {
        createdSessionId: result.createdSessionId,
        authSessionResultType: result.authSessionResult?.type,
        signInStatus: result.signIn?.status,
        signUpStatus: result.signUp?.status,
      });

      const { createdSessionId, setActive, signIn, signUp } = result;

      // If we have a created session, set it as active
      if (createdSessionId && setActive) {
        console.log("Setting active session:", createdSessionId);
        await setActive({ session: createdSessionId });
        router.replace("/");
      } else if (signIn?.status === "complete") {
        // Legacy path - signIn is complete but no createdSessionId yet
        console.log("SignIn complete, setting active...");
        if (setActive && signIn.createdSessionId) {
          await setActive({ session: signIn.createdSessionId });
          router.replace("/");
        }
      } else if (signUp?.status === "complete") {
        // User was created via transfer
        console.log("SignUp complete, setting active...");
        if (setActive && signUp.createdSessionId) {
          await setActive({ session: signUp.createdSessionId });
          router.replace("/");
        }
      } else {
        // Flow didn't complete - user cancelled or error
        console.log("OAuth flow did not complete:", {
          signInStatus: signIn?.status,
          signUpStatus: signUp?.status,
        });
        setError("Google sign-in did not complete. Please try again.");
      }
    } catch (err: any) {
      console.error("Google OAuth error:", err);
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  }, [startOAuthFlow, router]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in with Google (OAuth)</Text>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
