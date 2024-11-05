import { useSignIn } from "@clerk/clerk-expo";
import { useLocalCredentials } from "@clerk/clerk-expo/local-credentials";
import { TextInput, Button, View, StyleSheet } from "react-native";
import React, { useCallback, useState } from "react";

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    borderWidth: 1,
  },
});

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { hasCredentials, setCredentials, authenticate, biometricType } =
    useLocalCredentials();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = React.useCallback(
    async (useLocal = false) => {
      if (!isLoaded) {
        return;
      }

      try {
        const signInAttempt =
          hasCredentials && useLocal
            ? await authenticate()
            : await signIn.create({
                identifier: email,
                password,
              });

        if (signInAttempt.status === "complete") {
          if (!useLocal) {
            await setCredentials({
              identifier: email,
              password,
            });
          }
          await setActive({ session: signInAttempt.createdSessionId });

          // navigate away
        } else {
          // handle other statuses of sign in
        }
      } catch (err: any) {
        // handle any other error
      }
    },
    [isLoaded, email, password]
  );

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(password) => setPassword(password)}
      />

      <Button title="Sign In" onPress={() => onSignInPress()} />

      {hasCredentials && biometricType && (
        <Button
          title={
            biometricType === "face-recognition"
              ? "Sign in with Face ID"
              : "Sign in with Touch ID"
          }
          onPress={() => onSignInPress(true)}
        />
      )}
    </View>
  );
}
