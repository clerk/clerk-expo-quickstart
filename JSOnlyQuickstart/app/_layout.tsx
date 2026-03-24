import { AppNavigationChrome } from '@/components/app-navigation-chrome'
import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <AppNavigationChrome />
      </ClerkProvider>
    </SafeAreaProvider>
  )
}
