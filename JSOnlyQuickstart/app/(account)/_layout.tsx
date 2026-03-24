import { StackHeaderBack } from '@/components/stack-header-back'
import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'

export default function AccountLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerLeft: () => <StackHeaderBack fallbackHref="/" />,
      }}
    />
  )
}
