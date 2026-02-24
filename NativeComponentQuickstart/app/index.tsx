import { useEffect, useState } from "react";
import { useAuth, useUser, useClerk } from "@clerk/expo";
import { AuthView, UserButton, UserProfileView } from "@clerk/expo/native";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";

export default function MainScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Reset modal state when auth state changes
  useEffect(() => {
    setShowAuth(false);
    setShowProfile(false);
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    // While auth is in progress, show a loading spinner behind the native modal.
    // This prevents the landing page from flashing when the modal closes
    // but the JS SDK hasn't finished syncing the session yet.
    if (showAuth) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <AuthView
            mode="signInOrUp"
            onDismiss={() => setShowAuth(false)}
          />
        </View>
      );
    }

    return (
      <View style={styles.landingContainer}>
        <Text style={styles.landingTitle}>Clerk + Expo</Text>
        <Text style={styles.landingSubtitle}>
          Native Components Quickstart
        </Text>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => setShowAuth(true)}
        >
          <Text style={styles.signInButtonText}>Sign In / Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            onPress={() => setShowProfile(true)}
          >
            <Text style={styles.linkButtonText}>Native Profile</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.linkButton, styles.signOutButton]}
          onPress={() => signOut()}
        >
          <Text style={styles.linkButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {showProfile && (
        <UserProfileView
          onDismiss={() => setShowProfile(false)}
          onSignOut={async () => {
            await signOut();
          }}
        />
      )}
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
  landingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 40,
  },
  landingTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  landingSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
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
