import { useSignInWithApple } from "@clerk/expo/apple";
import { useRouter } from "expo-router";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

        if (onSignInComplete) {
          onSignInComplete();
        } else {
          router.replace("/");
        }
      }
    } catch (err: any) {
      if (err.code === "ERR_REQUEST_CANCELED") {
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
