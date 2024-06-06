import React from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, TextInput, Button, View, Pressable } from "react-native";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      console.log(completeSignIn);

      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {}
  }, [isLoaded, emailAddress, password]);

  return (
    <View>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />

      <TextInput
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />

      <Button title="Sign In" onPress={onSignInPress} />

      <View>
        <Text>Don't have an account?</Text>

        <Link href="/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>
    </View>
  );
}
