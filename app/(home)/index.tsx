import { useAuth, useUser, useClerk } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";

// Helper to check if native module is available
function isNativeModuleAvailable(): boolean {
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

/**
 * Home Screen
 *
 * Displays user info when signed in, or sign in/up buttons when not.
 * Works in both Expo Go (JS-only) and development builds (native modules available).
 */
export default function HomePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isSignedIn && user) {
    const hasNativeModules = isNativeModuleAvailable();

    // Dynamically import UserButton if native modules available
    let UserButton: any = null;
    if (hasNativeModules) {
      try {
        UserButton = require("@clerk/expo/native").UserButton;
      } catch (e) {
        // UserButton not available
      }
    }

    return (
      <ScrollView style={styles.container}>
        {/* Header with optional UserButton */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          {UserButton && (
            <UserButton
              style={styles.userButton}
              onPress={() => console.log("UserButton pressed")}
            />
          )}
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          {user.imageUrl && (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user.firstName || "User"} {user.lastName || ""}
            </Text>
            <Text style={styles.userEmail}>
              {user.emailAddresses[0]?.emailAddress || "No email"}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            You're signed in using the Core-3 Signal API.
          </Text>

          <View style={styles.modeInfo}>
            <Text style={styles.modeTitle}>Current Mode:</Text>
            <Text style={styles.modeValue}>
              {Platform.OS === "web"
                ? "Web"
                : hasNativeModules
                ? "Development Build (Native)"
                : "Expo Go (JS-only)"}
            </Text>
          </View>

          {/* Navigation Links */}
          <View style={styles.linksSection}>
            <Text style={styles.sectionTitle}>Examples</Text>

            {hasNativeModules && (
              <>
                <Link href="/(home)/profile" asChild>
                  <TouchableOpacity style={styles.linkButton}>
                    <Text style={styles.linkButtonText}>
                      Native Profile Component
                    </Text>
                  </TouchableOpacity>
                </Link>

                <Link href="/(home)/examples" asChild>
                  <TouchableOpacity style={styles.linkButton}>
                    <Text style={styles.linkButtonText}>
                      All Native Component Examples
                    </Text>
                  </TouchableOpacity>
                </Link>
              </>
            )}

            {!hasNativeModules && (
              <View style={styles.expoGoNotice}>
                <Text style={styles.expoGoNoticeTitle}>
                  Running in Expo Go
                </Text>
                <Text style={styles.expoGoNoticeText}>
                  Native components require a development build.{"\n"}
                  Run `npx expo run:ios` or `npx expo run:android` for full
                  native support.
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, styles.signOutButton]}
            onPress={() => signOut()}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Not signed in
  return (
    <View style={styles.authContainer}>
      <View style={styles.authContent}>
        <Text style={styles.authTitle}>Clerk Expo Quickstart</Text>
        <Text style={styles.authSubtitle}>
          Authentication for React Native apps using Core-3 Signal API
        </Text>

        <View style={styles.modeInfo}>
          <Text style={styles.modeTitle}>Current Mode:</Text>
          <Text style={styles.modeValue}>
            {Platform.OS === "web"
              ? "Web"
              : isNativeModuleAvailable()
              ? "Development Build (Native)"
              : "Expo Go (JS-only)"}
          </Text>
        </View>

        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  userButton: {
    width: 44,
    height: 44,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    margin: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },
  modeInfo: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modeTitle: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  modeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
  linksSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  linkButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  linkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  expoGoNotice: {
    backgroundColor: "#fff3cd",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffc107",
  },
  expoGoNoticeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 8,
  },
  expoGoNoticeText: {
    fontSize: 13,
    color: "#856404",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#FF0000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 220,
  },
  signOutButton: {
    backgroundColor: "#666",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FF0000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#FF0000",
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  authContent: {
    width: "100%",
    maxWidth: 400,
    gap: 20,
    alignItems: "center",
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
  },
  authSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});
