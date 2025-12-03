import { SignIn } from "@clerk/clerk-expo/native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

export default function Page() {
  const router = useRouter();
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user } = useUser();

  // Show loading while checking auth state
  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  // If already signed in, show user info with options
  if (isSignedIn && user) {
    return (
      <View style={styles.container}>
        <View style={styles.signedInCard}>
          <Text style={styles.title}>Already Signed In</Text>

          {user.imageUrl && (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          )}

          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.userEmail}>
            {user.emailAddresses[0]?.emailAddress}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/(home)")}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.signOutButton]}
            onPress={() => signOut()}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Not signed in - show native sign in
  return (
    <SignIn
      mode="signIn"
      onSuccess={() => router.replace("/(home)")}
      onError={(error) => console.error("Sign in error:", error)}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  signedInCard: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
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
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: "#FF0000",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 12,
  },
  signOutButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
