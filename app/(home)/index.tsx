import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'
import { Stack, router } from 'expo-router'
import { Button, Text, View } from 'react-native'

export default function Page() {
  const { user } = useUser()
  const { signOut } = useAuth()

  return (
    <View>
      <Stack.Screen options={{ title: 'Home' }} />
      <SignedIn>
        <Text
          style={{
            padding: 10,
            fontSize: 24,
          }}
        >
          Welcome, {user?.emailAddresses[0].emailAddress}
        </Text>
        <Button
          title="Sign Out"
          onPress={() => {
            signOut().then(() => {
              router.replace('/')
            })
          }}
        />
      </SignedIn>
      <SignedOut>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 10,
            gap: 10,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Clerk 🤝 Expo
          </Text>
          <Button
            title="Sign In"
            onPress={() => {
              router.push('/sign-in')
            }}
          />
          <Button
            title="Sign Up"
            onPress={() => {
              router.push('/sign-up')
            }}
          />
        </View>
      </SignedOut>
    </View>
  )
}
