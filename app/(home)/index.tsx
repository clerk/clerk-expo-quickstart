import { useUser, useClerk } from "@clerk/clerk-expo";
import { UserButton } from "@clerk/clerk-expo/native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SignOutButton } from "@/app/components/SignOutButton";
import { requireNativeModule } from "expo-modules-core";

// Get the native module for modal presentation
const ClerkExpo =
  Platform.OS === "ios" ? requireNativeModule("ClerkExpo") : null;

// Custom hook to check native session state
function useNativeSession() {
  const [nativeSession, setNativeSession] = useState<{
    sessionId: string;
    status: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    if (!ClerkExpo?.getSession) {
      setIsLoading(false);
      return;
    }

    try {
      const session = await ClerkExpo.getSession();
      setNativeSession(session);
    } catch (err) {
      console.log("[useNativeSession] Error:", err);
      setNativeSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return { nativeSession, isLoading, refresh: checkSession };
}

export default function Page() {
  const { user } = useUser();
  const { nativeSession, isLoading, refresh } = useNativeSession();

  const isSignedIn = !!nativeSession?.sessionId;

  const handleSignIn = async () => {
    if (!ClerkExpo?.presentAuth) {
      console.log("Native auth not available");
      return;
    }

    try {
      console.log("[Index] Presenting native sign-in modal");
      const result = await ClerkExpo.presentAuth({
        mode: "signIn",
        dismissable: true,
      });
      console.log("[Index] Sign-in completed:", result);
      // Refresh native session state
      refresh();
    } catch (err) {
      console.log("[Index] Sign-in modal dismissed or error:", err);
    }
  };

  const handleSignUp = async () => {
    if (!ClerkExpo?.presentAuth) {
      console.log("Native auth not available");
      return;
    }

    try {
      console.log("[Index] Presenting native sign-up modal");
      const result = await ClerkExpo.presentAuth({
        mode: "signUp",
        dismissable: true,
      });
      console.log("[Index] Sign-up completed:", result);
      // Refresh native session state
      refresh();
    } catch (err) {
      console.log("[Index] Sign-up modal dismissed or error:", err);
    }
  };

  const handleSignOut = async () => {
    if (!ClerkExpo?.signOut) {
      console.log("Native sign out not available");
      return;
    }

    try {
      console.log("[Index] Signing out...");
      await ClerkExpo.signOut();
      console.log("[Index] Signed out successfully");
      // Refresh native session state
      refresh();
    } catch (err) {
      console.log("[Index] Sign out error:", err);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF0000" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (isSignedIn) {
    return (
      <View style={styles.container}>
        {/* Header with UserButton */}
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          {Platform.OS === "ios" && (
            <UserButton
              style={styles.userButton}
              onPress={() => console.log("UserButton pressed")}
            />
          )}
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          {user?.imageUrl && (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.firstName || "User"} {user?.lastName || ""}
            </Text>
            <Text style={styles.userEmail}>
              {user?.emailAddresses?.[0]?.emailAddress || "Signed In"}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            Welcome back! You are signed in.
          </Text>
          <Text style={styles.sessionText}>
            Session: {nativeSession?.sessionId?.substring(0, 20)}...
          </Text>

          <Link href="/(home)/profile" style={styles.link}>
            <Text style={styles.linkText}>View Profile (Native)</Text>
          </Link>

          <Link href="/(home)/examples" style={styles.link}>
            <Text style={styles.linkText}>Browse All Examples</Text>
          </Link>

          <TouchableOpacity
            style={[styles.button, styles.signOutButton]}
            onPress={handleSignOut}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Not signed in
  return (
    <View style={styles.container}>
      <View style={styles.authLinks}>
        <Text style={styles.welcomeTitle}>Welcome</Text>
        <Text style={styles.welcomeSubtitle}>
          Sign in or create an account to continue
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign in (Native)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign up (Native)</Text>
        </TouchableOpacity>
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
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userButton: {
    width: 40,
    height: 40,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    margin: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
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
    flex: 1,
    padding: 20,
    gap: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  sessionText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  authLinks: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: "#FF0000",
    borderRadius: 8,
    minWidth: 220,
    alignItems: "center",
  },
  signOutButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#FF0000",
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
