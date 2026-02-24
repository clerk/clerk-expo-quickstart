import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/expo";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function HomeLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Stack />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
