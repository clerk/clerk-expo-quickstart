import { useRouter } from "expo-router";
import {
  NativeModuleGuard,
  isNativeModuleAvailable,
} from "@/app/components/NativeModuleGuard";

/**
 * Sign Up Only Mode
 *
 * Restricts the interface to sign-up flows only
 * Users can only create new accounts
 */
export default function SignUpOnlyPage() {
  const router = useRouter();

  return (
    <NativeModuleGuard title="Sign Up Only">
      <SignInComponent router={router} />
    </NativeModuleGuard>
  );
}

function SignInComponent({ router }: { router: ReturnType<typeof useRouter> }) {
  if (!isNativeModuleAvailable()) return null;

  const { AuthView } = require("@clerk/expo/native");

  return (
    <AuthView
      mode="signUp"
      isDismissable={true}
      onSuccess={() => router.replace("/(home)")}
      onError={(error: any) => console.error("Sign up error:", error)}
    />
  );
}
