import { UserProfile } from '@clerk/clerk-expo/native'
import { useRouter } from 'expo-router'

export default function ProfilePage() {
  const router = useRouter()

  // UserProfile component handles platform detection internally
  // Works on both iOS (clerk-ios/SwiftUI) and Android (clerk-android/Jetpack Compose)
  return (
    <UserProfile
      isDismissable={false}
      onSignOut={() => {
        console.log('User signed out from profile')
        router.replace('/(auth)/sign-in')
      }}
      style={{ flex: 1 }}
    />
  )
}
