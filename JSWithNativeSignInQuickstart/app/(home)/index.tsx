import { useUser, useClerk } from "@clerk/expo";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function HomePage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
      </View>

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

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          You're signed in using email/password or OAuth with the Core-3 Signal
          API.
        </Text>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => signOut()}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
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
  header: {
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
  signOutButton: {
    backgroundColor: "#666",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
