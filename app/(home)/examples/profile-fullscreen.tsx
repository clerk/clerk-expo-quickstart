import { useRouter } from "expo-router";
import {
  NativeModuleGuard,
  isNativeModuleAvailable,
} from "@/app/components/NativeModuleGuard";

/**
 * Fullscreen Profile (Non-dismissable)
 *
 * Full-screen profile without dismiss button
 */
export default function ProfileFullscreenPage() {
  const router = useRouter();

  return (
    <NativeModuleGuard title="Profile (Fullscreen)">
      <ProfileComponent router={router} />
    </NativeModuleGuard>
  );
}

function ProfileComponent({ router }: { router: ReturnType<typeof useRouter> }) {
  if (!isNativeModuleAvailable()) return null;

  const { UserProfileView } = require("@clerk/expo/native");

  return (
    <UserProfileView
      isDismissable={false}
      onSignOut={() => router.replace("/(auth)/sign-in")}
    />
  );
}
