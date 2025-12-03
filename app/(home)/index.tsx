import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { UserButton } from "@clerk/clerk-expo/native";
import { Link, useRouter } from "expo-router";
import { Text, View, StyleSheet, Platform } from "react-native";
import { SignOutButton } from "@/app/components/SignOutButton";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SignedIn>
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

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.greeting}>
            Hello {user?.emailAddresses[0].emailAddress}
          </Text>

          <Link href="/(home)/profile" style={styles.link}>
            <Text style={styles.linkText}>View Profile (Native)</Text>
          </Link>

          <Link href="/(home)/examples" style={styles.link}>
            <Text style={styles.linkText}>Browse All Examples</Text>
          </Link>

          <SignOutButton />
        </View>
      </SignedIn>

      <SignedOut>
        <View style={styles.authLinks}>
          <Link href="/(auth)/sign-in" style={styles.link}>
            <Text style={styles.linkText}>Sign in (Native)</Text>
          </Link>
          <Link href="/(auth)/sign-up" style={styles.link}>
            <Text style={styles.linkText}>Sign up (Native)</Text>
          </Link>
        </View>
      </SignedOut>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  content: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  greeting: {
    fontSize: 18,
    marginBottom: 10,
  },
  authLinks: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
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
