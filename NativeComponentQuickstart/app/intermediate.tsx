import { Stack, useRouter } from 'expo-router'
import { Button, Text, View } from 'react-native'

// Sits between home and the auth flow so the auth route lands third.
// Its back button should return here, not all the way to home.
export default function IntermediateRoute() {
  const router = useRouter()

  return (
    <>
      <Stack.Screen options={{ headerBackButtonDisplayMode: 'minimal', title: 'Step 1' }} />
      <View style={{ flex: 1, padding: 20, gap: 16 }}>
        <Text style={{ fontSize: 16 }}>
          Pushing sign-in from here makes it the third screen. Back from Clerk&apos;s root should land
          back on this screen.
        </Text>
        <Button title="Push sign in (3rd screen)" onPress={() => router.push('/sign-in')} />
      </View>
    </>
  )
}
