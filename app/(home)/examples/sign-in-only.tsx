import { useRouter } from "expo-router";
import {
  NativeModuleGuard,
  isNativeModuleAvailable,
} from "@/app/components/NativeModuleGuard";

/**
 * Sign In Only Mode
 *
 * Restricts the interface to sign-in flows only
 * Users can only authenticate with existing accounts
 */
export default function SignInOnlyPage() {
  const router = useRouter();

  return (
    <NativeModuleGuard title="Sign In Only">
      <SignInComponent router={router} />
    </NativeModuleGuard>
  );
}

function SignInComponent({ router }: { router: ReturnType<typeof useRouter> }) {
  if (!isNativeModuleAvailable()) return null;

  const { AuthView } = require("@clerk/expo/native");

  return (
    <AuthView
      mode="signIn"
      isDismissable={true}
      onSuccess={() => router.replace("/(home)")}
      onError={(error: any) => console.error("Sign in error:", error)}
    />
  );
}
