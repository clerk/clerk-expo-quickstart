import { useSignIn } from "@clerk/clerk-expo";
import { Link, Stack } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";

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

      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {}
  }, [isLoaded, emailAddress, password]);

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Sign In",
        }}
      />
      <View>
        <Link href="/">
          <Text>Home</Text>
        </Link>
      </View>
      <View>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email..."
          placeholderTextColor="#000"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>

      <View>
        <TextInput
          value={password}
          placeholder="Password..."
          placeholderTextColor="#000"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <TouchableOpacity onPress={onSignInPress}>
        <Text>Sign in</Text>
      </TouchableOpacity>

      <View>
        <Text>Have an account?</Text>

        <Link href="/sign-up" asChild>
          <TouchableOpacity>
            <Text>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
