import * as React from "react";
import { Text, TextInput, Button, View, StyleSheet } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import GoogleSignInButton from "../components/GoogleSignInButton";
// import AppleSignInButton from '../components/AppleSignInButton'
// import GoogleSignInButton from '../components/GoogleSignInButton'

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded || !signUp) return;

    try {
      // Start sign-up process using email and password provided
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded || !signUp) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session as active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
              console.log(session?.currentTask);
              return;
            }

            router.replace("/");
          },
        });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error("Sign-up status:", signUpAttempt.status);
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
        />
        <Button title="Verify" onPress={onVerifyPress} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>

      {/*
        OPTIONAL: Native Apple Sign-In (iOS only)

        To enable Apple Sign-In:
        1. Uncomment the import at the top: import AppleSignInButton from '../components/AppleSignInButton'
        2. Uncomment the <AppleSignInButton /> component below
        3. Follow the setup guide: https://clerk.com/docs/guides/configure/auth-strategies/sign-in-with-apple

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
        3. Follow the setup guide: https://clerk.com/docs/guides/configure/auth-strategies/sign-in-with-google

        Note: Requires Google Cloud Console setup and additional configuration in:
        - Google Cloud Console (OAuth credentials)
        - Clerk Dashboard
        - Environment variables (EXPO_PUBLIC_CLERK_GOOGLE_*)
        - iOS: @clerk/clerk-expo plugin in app.config.ts
      */}
      {/* <GoogleSignInButton /> */}

      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={(email) => setEmailAddress(email)}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#666666"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button title="Continue" onPress={onSignUpPress} />
      <View style={{ flexDirection: "row", gap: 4 }}>
        <Text>Have an account?</Text>
        <Link href="/sign-in">
          <Text>Sign in</Text>
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
});
