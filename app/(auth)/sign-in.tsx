import { SignIn } from "@clerk/clerk-expo/native";
import { useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();

  return (
    <SignIn
      mode="signIn"
      onSuccess={() => router.replace("/(home)")}
      onError={(error) => console.error("Sign in error:", error)}
    />
  );
}
