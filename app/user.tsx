import { useUser, useClerk } from "@clerk/clerk-expo";
import { useLocalCredentials } from "@clerk/clerk-expo/local-credentials";
import { Button, View, Text } from "react-native";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const { userOwnsCredentials, clearCredentials } = useLocalCredentials();

  return (
    <View>
      <Text>Settings, {user?.emailAddresses[0].emailAddress}</Text>
      <Button title="Sign out" onPress={() => signOut()} />
      {userOwnsCredentials && (
        <Button
          title="Remove biometric credentials"
          onPress={() => clearCredentials()}
        />
      )}
    </View>
  );
}
