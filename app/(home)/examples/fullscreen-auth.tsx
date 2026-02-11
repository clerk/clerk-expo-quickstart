import { useRouter } from "expo-router";
import {
  NativeModuleGuard,
  isNativeModuleAvailable,
} from "@/app/components/NativeModuleGuard";

/**
 * Fullscreen Authentication (Non-dismissable)
 *
 * Full-screen auth without dismiss button
 * Ideal for onboarding flows or required authentication
 */
export default function FullscreenAuthPage() {
  const router = useRouter();

  return (
    <NativeModuleGuard title="Fullscreen Auth">
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
      isDismissable={false}
      onSuccess={() => router.replace("/(home)")}
      onError={(error: any) => console.error("Auth error:", error)}
    />
  );
}
