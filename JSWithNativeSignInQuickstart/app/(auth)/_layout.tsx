import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/expo";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function UnAuthenticatedLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(home)" />;
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
