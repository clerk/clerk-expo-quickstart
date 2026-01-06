import { useSignInWithApple } from "@clerk/clerk-expo";
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
 * AppleSignInButton Component
 *
 * This component provides native Apple Sign-In functionality for iOS devices.
 *
 * SETUP REQUIRED BEFORE USE:
 *
 * 1. Configure Apple Developer Console:
 *    - Enable "Sign in with Apple" capability for your App ID
 *    - Create a Services ID for Clerk
 *    - Generate and download a private key (.p8 file)
 *
 * 2. Configure Clerk Dashboard:
 *    - Enable Apple as an SSO connection: https://dashboard.clerk.com/last-active?path=user-authentication/sso-connections
 *
 * 3. Add your iOS app to Clerk Dashboard → Native Applications:
 *    - Bundle ID: Must match your app.json
 *    - App ID Prefix (Team ID): From Apple Developer Console
 *
 * 4. Build Configuration:
 *    - For EAS Build: Configure eas.json
 *    - For local build: Run `npx expo prebuild` and configure in Xcode
 *
 * For complete setup instructions, see: /docs/expo/guides/configure/auth-strategies/sign-in-with-apple
 *
 * @param onSignInComplete - Optional callback called when sign-in completes successfully
 * @param showDivider - Whether to show "OR" divider below button (default: true)
 */

interface AppleSignInButtonProps {
  onSignInComplete?: () => void;
  showDivider?: boolean;
}

export default function AppleSignInButton({
  onSignInComplete,
  showDivider = true,
}: AppleSignInButtonProps) {
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const router = useRouter();

  // Only render on iOS
  if (Platform.OS !== "ios") {
    return null;
  }

  const handleAppleSignIn = async () => {
    try {
      const { createdSessionId, setActive } =
        await startAppleAuthenticationFlow();

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
      // Handle specific Apple Sign-In errors
      if (err.code === "ERR_REQUEST_CANCELED") {
        // User canceled the sign-in flow - this is expected, don't show error
        return;
      }

      Alert.alert(
        "Error",
        err.message || "An error occurred during Apple Sign-In"
      );
      console.error("Apple Sign-In error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.appleButton} onPress={handleAppleSignIn}>
        <Text style={styles.appleButtonText}> Sign in with Apple</Text>
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
  appleButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  appleButtonText: {
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
