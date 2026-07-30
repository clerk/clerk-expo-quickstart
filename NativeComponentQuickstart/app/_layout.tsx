import { ClerkProvider, useAuth } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { Stack } from 'expo-router'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootStack />
    </ClerkProvider>
  )
}

function RootStack() {
  const { isSignedIn } = useAuth({ treatPendingAsSignedOut: false })

  return (
    <Stack>
      {/* iOS 26 renders the standard navigation bar as liquid glass, so the large
          title collapses into it without any transparency overrides. */}
      <Stack.Screen
        name="index"
        options={{
          title: 'Welcome',
          headerLargeTitle: true,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="settings-sheet"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: isSignedIn ? [0.64, 1] : [0.8, 1],
          sheetInitialDetentIndex: 0,
          sheetGrabberVisible: true,
          headerShown: false,
          // iOS form sheets don't give content a height; stretch it to the sheet.
          contentStyle: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
        }}
      />
    </Stack>
  )
}
