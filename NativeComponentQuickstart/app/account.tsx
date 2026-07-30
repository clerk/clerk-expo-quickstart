import { UserProfileView } from '@clerk/expo/native'
import { Stack, useRouter } from 'expo-router'

// The profile pushed as a route: hide this route's header and Clerk's own chrome
// takes over. Sign-out ends the flow, so leave the route when it does.
export default function AccountRoute() {
  const router = useRouter()

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <UserProfileView
        isDismissible={false}
        onHostBack={() => router.back()}
        style={{ flex: 1 }}
      />
    </>
  )
}
