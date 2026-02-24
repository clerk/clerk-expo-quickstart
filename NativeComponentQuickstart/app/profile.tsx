import { useClerk } from "@clerk/expo";
import { UserProfileView } from "@clerk/expo/native";
import { useRouter } from "expo-router";

export default function ProfilePage() {
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <UserProfileView
      presentation="inline"
      isDismissable={true}
      onDismiss={() => router.back()}
      onSignOut={async () => {
        await signOut();
        router.back();
      }}
      style={{ flex: 1 }}
    />
  );
}
