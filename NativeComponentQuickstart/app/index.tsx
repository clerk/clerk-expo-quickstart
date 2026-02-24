import { useAuth, useUser, useClerk, getClerkInstance } from "@clerk/expo";
import { UserButton } from "@clerk/expo/native";
import { useRouter } from "expo-router";
import { requireNativeModule } from "expo-modules-core";
import * as SecureStore from "expo-secure-store";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";

// TODO: Inline AuthView presentation has safe area issues when embedded in React Native views.
// ClerkKitUI's AuthView ignores additionalSafeAreaInsets because it's designed for
// full-screen modal presentation. Fix requires changes in:
//   1. @clerk/expo's ExpoView hosting — propagate window safe area to hosting controller
//   2. ClerkKitUI — respect safe area insets when rendered inline (not as full-screen modal)
// Using modal presentation until inline safe area is resolved.

const ClerkExpo = requireNativeModule("ClerkExpo");

/** Sync an existing native session to the JS SDK. */
async function syncNativeSession() {
  console.log("[syncNativeSession] Starting sync...");
  const token = await ClerkExpo.getClientToken();
  console.log("[syncNativeSession] Got token:", token ? `yes (${token.substring(0, 20)}...)` : "no");
  if (!token) return false;

  try {
    console.log("[syncNativeSession] Setting SecureStore...");
    await SecureStore.setItemAsync("__clerk_client_jwt", token, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });
    console.log("[syncNativeSession] SecureStore set OK");

    const clerkInstance = getClerkInstance() as any;
    console.log("[syncNativeSession] Has __internal_reloadInitialResources:", typeof clerkInstance?.__internal_reloadInitialResources);
    if (typeof clerkInstance?.__internal_reloadInitialResources === "function") {
      console.log("[syncNativeSession] Calling __internal_reloadInitialResources...");
      await clerkInstance.__internal_reloadInitialResources();
      console.log("[syncNativeSession] __internal_reloadInitialResources done");
    }

    // Check what the client looks like after reload
    const sessions = clerkInstance?.client?.sessions;
    console.log("[syncNativeSession] Client sessions count:", sessions?.length ?? 0);
    if (sessions?.length > 0) {
      sessions.forEach((s: any) => console.log("[syncNativeSession] Session:", s.id, s.status));
    }
    console.log("[syncNativeSession] Client activeSessions:", clerkInstance?.client?.activeSessions?.length ?? 0);

    // Get the native session to find the session ID
    console.log("[syncNativeSession] Calling getSession...");
    const sessionData = await ClerkExpo.getSession();
    const sessionId = sessionData?.session?.id;
    console.log("[syncNativeSession] sessionId:", sessionId);

    // Check if session is in client
    const sessionInClient = sessions?.some((s: any) => s.id === sessionId);
    console.log("[syncNativeSession] Session in client:", sessionInClient);

    if (sessionId && typeof clerkInstance?.setActive === "function") {
      console.log("[syncNativeSession] Calling setActive...");
      await clerkInstance.setActive({ session: sessionId });
      console.log("[syncNativeSession] setActive done, isSignedIn:", clerkInstance?.session?.id);
    }
    return true;
  } catch (err: any) {
    console.log("[syncNativeSession] ERROR:", err?.message, err?.code);
    throw err;
  }
}

/** Present the native auth modal and sync the session back to the JS SDK. */
async function presentNativeAuth() {
  console.log("[presentNativeAuth] Called");
  let result;
  try {
    result = await ClerkExpo.presentAuth({
      mode: "signInOrUp",
      dismissable: true,
    });
    console.log("[presentNativeAuth] Result:", JSON.stringify(result));
  } catch (e: any) {
    console.log("[presentNativeAuth] Error:", e?.message, e?.code);
    // If native SDK already has a session, sync it to JS SDK
    const msg = e?.message || "";
    if (msg.includes("already signed in") || msg.includes("AlreadySignedIn")) {
      console.log("[presentNativeAuth] Already signed in, syncing session...");
      await syncNativeSession();
      return;
    }
    throw e;
  }

  if (result.sessionId) {
    await syncNativeSession();
  }
}

export default function MainScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Signed-out state — matches the native iOS quickstart pattern:
  // Tap "Sign In / Sign Up" to present the native auth modal.
  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.signedOutContainer}>
          <Text style={styles.appTitle}>Clerk + Expo</Text>
          <Text style={styles.appSubtitle}>Native Components Quickstart</Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => {
              presentNativeAuth().catch(() => {
                // Modal dismissed or error — nothing to do
              });
            }}
          >
            <Text style={styles.signInButtonText}>Sign In / Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Signed-in state — UserButton in header, user info, links to demos
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
        <UserButton style={styles.userButton} />
      </View>

      <View style={styles.profileCard}>
        {user?.imageUrl && (
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.firstName || "User"} {user?.lastName || ""}
          </Text>
          <Text style={styles.userEmail}>
            {user?.emailAddresses[0]?.emailAddress || "No email"}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.linksSection}>
          <Text style={styles.sectionTitle}>Native Components</Text>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.linkButtonText}>Native Profile</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.linkButton, styles.signOutButton]}
          onPress={async () => {
            await ClerkExpo.signOut();
            await signOut();
          }}
        >
          <Text style={styles.linkButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  signedOutContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  appSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  signInButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
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
  signOutButton: {
    backgroundColor: "#666",
  },
});
