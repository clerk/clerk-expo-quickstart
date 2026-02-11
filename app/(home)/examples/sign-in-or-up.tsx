import { useRouter } from "expo-router";
import {
  NativeModuleGuard,
  isNativeModuleAvailable,
} from "@/app/components/NativeModuleGuard";

/**
 * Sign In or Sign Up Mode (Default)
 *
 * Allows users to choose between signing in or creating new accounts
 */
export default function SignInOrUpPage() {
  const router = useRouter();

  return (
    <NativeModuleGuard title="Sign In or Sign Up">
      <SignInComponent router={router} />
    </NativeModuleGuard>
  );
}

function SignInComponent({ router }: { router: ReturnType<typeof useRouter> }) {
  if (!isNativeModuleAvailable()) return null;

  const { AuthView } = require("@clerk/expo/native");

  return (
    <AuthView
      mode="signInOrUp"
      isDismissable={true}
      onSuccess={() => router.replace("/(home)")}
      onError={(error: any) => console.error("Auth error:", error)}
    />
  );
}
