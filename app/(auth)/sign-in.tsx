import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import React from "react";
// import AppleSignInButton from "../components/AppleSignInButton";
// import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>

      {/*
        OPTIONAL: Native Apple Sign-In (iOS only)

        To enable Apple Sign-In:
        1. Uncomment the import at the top: import AppleSignInButton from '../components/AppleSignInButton'
        2. Uncomment the <AppleSignInButton /> component below
        3. Follow the complete setup guide in APPLE_SIGNIN_SETUP.md

        Note: Requires Apple Developer Account and additional configuration in:
        - Apple Developer Console
        - Clerk Dashboard
        - EAS Build or Xcode signing
      */}
      {/* <AppleSignInButton /> */}

      {/*
        OPTIONAL: Native Google Sign-In (iOS and Android)

        To enable Google Sign-In:
        1. Uncomment the import at the top: import GoogleSignInButton from '../components/GoogleSignInButton'
        2. Uncomment the <GoogleSignInButton /> component below
        3. Follow the complete setup guide in GOOGLE_SIGNIN_SETUP.md

        Note: Requires Google Cloud Console configuration and native build:
        - Google Cloud Console OAuth credentials
        - Clerk Dashboard SSO connection
        - EAS Build or local prebuild
      */}
      {/* <GoogleSignInButton /> */}

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity style={styles.button} onPress={onSignInPress}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text style={styles.link}>Sign up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 5,
  },
  link: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
