import { useRouter } from "expo-router";
import {
  NativeModuleGuard,
  isNativeModuleAvailable,
} from "@/app/components/NativeModuleGuard";

/**
 * Dismissable Profile Sheet
 *
 * User profile as a sheet that can be dismissed
 */
export default function ProfileDismissablePage() {
  const router = useRouter();

  return (
    <NativeModuleGuard title="Profile (Dismissable)">
      <ProfileComponent router={router} />
    </NativeModuleGuard>
  );
}

function ProfileComponent({ router }: { router: ReturnType<typeof useRouter> }) {
  if (!isNativeModuleAvailable()) return null;

  const { UserProfileView } = require("@clerk/expo/native");

  return (
    <UserProfileView
      isDismissable={true}
      onSignOut={() => router.replace("/(auth)/sign-in")}
    />
  );
}
