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
 *    - Create OAuth 2.0 credentials for iOS and Android
 *    - Add SHA-1 certificate fingerprints for Android
 *    - Configure iOS URL scheme
 *
 *   TODO: ADD FIREBASE INSTRUCTIONS HERE. TEST SETUP AS USER WOULD BUT USING FIREBASE INSTEAD OF JUST GOOGLE CLOUD. IS GOOGLE CLOUD REQUIRED DURING FIREBASE SETUP? LETS FIND OUT.
 *
 * 2. Configure Clerk Dashboard:
 *    - Enable Google as an SSO connection: https://dashboard.clerk.com/last-active?path=user-authentication/sso-connections
 *
 * 3. Add your iOS and Android apps to Clerk Dashboard → Native Applications:
 *    - iOS Bundle ID: Must match your app.json
 *    - Android Package Name: Must match your app.json
 *
 * 4. Set Environment Variables in your .env file:
 *    - EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
 *    - EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
 *    - EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
 *
 * 5. Build Configuration:
 *    - For EAS Build: Configure eas.json
 *    - For local build: Run `npx expo prebuild`
 *
 * For complete setup instructions, see:
 * TODO: INSERT DOCUMENT GUIDE LINK HERE
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
      if (err.code === "SIGN_IN_CANCELLED" || err.code === "-5") {
        // User canceled the sign-in flow - this is expected, don't show error
        return;
      }

      Alert.alert(
        "Error",
        err.message || "An error occurred during Google Sign-In"
      );
      console.error("Google Sign-In error:", err);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
      >
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
