import { useSignInWithGoogle } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * GoogleSignInButton Component
 *
 * This component provides native Google Sign-In functionality for iOS and Android devices.
 *
 * SETUP REQUIRED BEFORE USE:
 *
 * 1. Configure Google Cloud Console:
 *    - Create OAuth 2.0 credentials for Web, iOS, and Android
 *    - For Android: Add SHA-1 certificate fingerprints for debug and release builds
 *
 * 2. Configure Clerk Dashboard:
 *    - Enable Google as an SSO connection: https://dashboard.clerk.com/last-active?path=user-authentication/sso-connections
 *
 * 3. Add your iOS and Android apps to Clerk Dashboard → Native Applications:
 *    - iOS: Bundle ID must match your app.json
 *    - Android: Package name and SHA-1 fingerprints
 *
 * 4. Environment Variables:
 *    - EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID
 *    - EXPO_PUBLIC_CLERK_GOOGLE_IOS_CLIENT_ID (for iOS)
 *    - EXPO_PUBLIC_CLERK_GOOGLE_IOS_URL_SCHEME (for iOS)
 *    - EXPO_PUBLIC_CLERK_GOOGLE_ANDROID_CLIENT_ID (for Android)
 *
 * 5. Build Configuration:
 *    - Run `npx expo prebuild` to generate native projects
 *    - Or use EAS Build
 *
 * For complete setup instructions, see: https://clerk.com/docs/guides/configure/auth-strategies/sign-in-with-google
 *
 * @param onSignInComplete - Optional callback called when sign-in completes successfully
 * @param showDivider - Whether to show "OR" divider below button (default: true)
 */

interface GoogleSignInButtonProps {
  onSignInComplete?: () => void;
  showDivider?: boolean;
}

export default function GoogleSignInButton({
  onSignInComplete,
  showDivider = true,
}: GoogleSignInButtonProps) {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const router = useRouter();

  // Only render on iOS and Android
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return null;
  }

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } =
        await startGoogleAuthenticationFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });

        // Call optional callback
        if (onSignInComplete) {
          onSignInComplete();
        } else {
          // Default behavior: navigate to home
          router.replace("/");
        }
      }
    } catch (err: any) {
      // Handle specific Google Sign-In errors
      if (err.code === "SIGN_IN_CANCELLED") {
        // User canceled the sign-in flow - this is expected, don't show error
        return;
      }

      Alert.alert(
        "Error",
        err.message || "An error occurred during Google Sign-In"
      );
      console.error("Google Sign-In error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
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
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
