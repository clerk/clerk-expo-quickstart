import { UserProfileScreen } from '@clerk/expo/native/router'

// Flavor 2: drop-in expo-router screen. The route header is the only header;
// its back button, gestures, and Android hardware back drive Clerk's internal
// screens, and the route pops itself on sign-out or account deletion.
export default function AccountRoute() {
  return <UserProfileScreen options={{ title: 'Account' }} />
}
