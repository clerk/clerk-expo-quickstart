import { SignIn } from '@clerk/clerk-expo/native'
import { useRouter } from 'expo-router'

/**
 * Fullscreen Authentication (Non-dismissable)
 *
 * Full-screen auth without dismiss button
 * Ideal for onboarding flows or required authentication
 *
 * User must complete authentication to proceed
 * No way to dismiss or skip
 * Automatically redirects on success
 */
export default function FullscreenAuthPage() {
  const router = useRouter()

  return (
    <SignIn
      mode="signInOrUp"
      isDismissable={false}
      onSuccess={() => router.replace('/(home)')}
      onError={(error) => console.error('Auth error:', error)}
    />
  )
}
