import { SignIn } from "@clerk/clerk-expo/native";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <SignIn
      mode="signUp"
      onSuccess={() => router.replace("/(home)")}
      onError={(error) => console.error("Sign up error:", error)}
    />
  );
}
