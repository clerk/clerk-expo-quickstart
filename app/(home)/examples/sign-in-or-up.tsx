import { SignIn } from '@clerk/clerk-expo/native'
import { useRouter } from 'expo-router'

/**
 * Sign In or Sign Up Mode (Default)
 *
 * Allows users to choose between signing in or creating new accounts
 * This is the most flexible mode
 *
 * Combines all authentication features:
 * - All sign-in flows (email, phone, username, OAuth, passkeys, MFA)
 * - All sign-up flows (registration, verification, profile completion)
 * - Seamless switching between sign-in and sign-up
 * - Password reset and account recovery
 */
export default function SignInOrUpPage() {
  const router = useRouter()

  return (
    <SignIn
      mode="signInOrUp"
      isDismissable={true}
      onSuccess={() => router.replace('/(home)')}
      onError={(error) => console.error('Auth error:', error)}
    />
  )
}
